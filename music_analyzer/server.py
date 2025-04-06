import agents.orchestrator
from flask import Flask, request, jsonify
import io
import librosa
import torch
import soundfile as sf
from transformers import WhisperProcessor, WhisperForConditionalGeneration, AutoTokenizer, AutoModelForSequenceClassification
from safetensors.torch import load_file as load_safetensors
from flask_cors import CORS  # Import flask-cors
from scipy.special import softmax
from nltk.corpus import stopwords
import nltk

import agents



app = Flask(__name__)
CORS(app)

roberta = "cardiffnlp/twitter-roberta-base-sentiment"
model_sena = AutoModelForSequenceClassification.from_pretrained(roberta)
tokenizer = AutoTokenizer.from_pretrained(roberta)

def tweet_sentiment(tweet):
    encoded_tweet = tokenizer(tweet, return_tensors='pt')
    output = model_sena(**encoded_tweet)
    scores = softmax(output[0][0].detach().numpy())
    return scores

def calculate_parallel(tweet_data):
    # formatting
    return_template = { # agent 1, agent 2, ... 
        "agents": [

        ]
    }
    agent_personalities = {}
    agent_sentiments = {} # agent 47 : [0.84, 0.99, 0.75]
    agent_sign = {} # agent 47 : [pos, neg, neu]

    stack = tweet_data['comments']
    visited = set()
    responses = []
    while stack:
        # examining current tweet
        tweet = stack.pop()
        visited.add(tweet['message_id'])

        # processing tweet
        author = tweet['author_name']
        if agent_personalities.get(author, None) == None: # note: need to standardize
            agent_personalities[author] = tweet['personality']

        neg, neu, pos = tweet_sentiment(tweet['comment_text'])

        if neg > neu and neg > pos: # neg
            agent_sign[author] = agent_sign.get(author, []) + ["negative"]
        elif pos > neu and pos > neg: # pos
            agent_sign[author] = agent_sign.get(author, []) + ["positive"]
        else:
            agent_sign[author] = agent_sign.get(author, []) + ["neutral"]
        
        agent_sentiments[author] = max(neg, neu, pos)


        # finding new tweets
        if 'replies' not in tweet.keys():
            continue
        for new_tweet in tweet['replies']:
            if new_tweet['message_id'] not in visited:
                stack.append(new_tweet)
    
    for author in agent_personalities.keys():
        return_template['agents'].append(make_agent(author, agent_personalities[author], agent_sentiments[author], agent_sign[author]))

    #schema = json.dump(return_template)
    # return schema
    return return_template
    
def calculate_pi(tweet_data, temp=0.69):
    stack = tweet_data['comments']
    visited = set()
    responses = []
    while stack:
        tweet = stack.pop()
        visited.add(tweet['message_id'])
        responses.append(tweet['comment_text'])
        for new_tweet in tweet['replies']:
            if new_tweet['message_id'] not in visited:
                stack.append(new_tweet)
    senti = []
    for resp in responses:
        senti.append(tweet_sentiment(resp))
    
    plus, minus, zero = 0, 0, 0

    for neg, neu, pos in senti:
        if neg > temp:
            minus += 1
        elif pos > temp:
            plus += 1
        else:
            zero += 1
        
    schema = {
        "sentiment_counts": {
            "positive" : plus,
            "negative" : minus,
            "neutral" : zero
        }
    }

    return schema
        
def calculate_cloud(tweet_data, temp=0.69):
    stack = tweet_data['comments']
    visited = set()
    responses = []
    while stack:
        tweet = stack.pop()
        visited.add(tweet['message_id'])
        responses.append(tweet['comment_text'])
        for new_tweet in tweet['replies']:
            if new_tweet['message_id'] not in visited:
                stack.append(new_tweet)

    return get_word_frequencies_json(responses)


def get_word_frequencies_json(sentences):
    word_freq = {}
    tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
    stop_words = set(stopwords.words("english"))

    for sentence in sentences:
        # Tokenize into input IDs
        input_ids = tokenizer.encode(sentence, add_special_tokens=False)
        tokens = tokenizer.convert_ids_to_tokens(input_ids)

        word = ""
        for token in tokens:
            if token.startswith("##"):
                word += token[2:]  # Continue the subword
            else:
                if word:  # Add the previous word if exists
                    word_lower = word.lower()
                    if word_lower not in stop_words and word_lower.isalpha():
                        word_freq[word_lower] = word_freq.get(word_lower, 0) + 1
                word = token  # Start a new word

        # Catch the last word
        if word:
            word_lower = word.lower()
            if word_lower not in stop_words and word_lower.isalpha():
                word_freq[word_lower] = word_freq.get(word_lower, 0) + 1

    # Convert to JSON format
    word_frequencies = [{"text": word, "value": count} for word, count in word_freq.items()]
    # return json.dumps({"word_frequencies": word_frequencies}, indent=2)
    return {"word_frequencies": word_frequencies}


def load_finetuned_model():
    # --- First load: merge fine-tuned weights into the base model ---
    base_model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-small")
    base_state = base_model.state_dict()

    # Load your fine-tuned checkpoint (safetensors)
    ft_state = load_safetensors(
        "C:/Users/erics/OneDrive/Desktop/several-ducks-datahacks25/music_analyzer/whisper-musiccaps-finetuned-local/model.safetensors",
        device="cpu"
    )

    # Optional: inspect keys if needed
    # base_keys = set(base_model.state_dict().keys())
    # ft_keys = set(ft_state.keys())
    # print("Missing in fine-tuned state:", base_keys - ft_keys)
    # print("Extra in fine-tuned state:", ft_keys - base_keys)

    # Merge fine-tuned weights into the base state dict
    base_state.update(ft_state)
    base_model.load_state_dict(base_state)

    # --- Second load: handle missing 'proj_out.weight' ---
    base_model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-small")
    base_state = base_model.state_dict()
    ft_state = load_safetensors(
        "C:/Users/erics/OneDrive/Desktop/several-ducks-datahacks25/music_analyzer/whisper-musiccaps-finetuned-local/model.safetensors",
        device="cpu"
    )
    if 'proj_out.weight' not in ft_state:
        ft_state['proj_out.weight'] = base_state['proj_out.weight']
    base_state.update(ft_state)
    base_model.load_state_dict(base_state)

    base_model.eval()
    return base_model

# Load the fine-tuned model and processor once at startup.
model = load_finetuned_model()
processor = WhisperProcessor.from_pretrained("openai/whisper-small")

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'audio' not in request.files:
        print(request)
        return jsonify({"error": "No audio file provided. Use form-data with key 'audio'."}), 400

    # Read the audio file from the request.
    audio_file = request.files['audio']
    audio_bytes = audio_file.read()

    # Load audio using soundfile.
    try:
        data, sr = sf.read(io.BytesIO(audio_bytes))
    except Exception as e:
        print("error reading audio file")
        return jsonify({"error": f"Error reading audio file: {e}"}), 400

    # Resample to 16kHz if necessary (Whisper expects 16kHz)
    if sr != 16000:
        data = librosa.resample(data, orig_sr=sr, target_sr=16000)
        sr = 16000

    # Convert stereo to mono if needed
    if len(data.shape) > 1:
        data = data.mean(axis=1)

    # Extract features from the audio
    inputs = processor.feature_extractor(data, sampling_rate=sr, return_tensors="pt")
    input_features = inputs.input_features.to(model.device)

    # Generate transcription using the model
    predicted_ids = model.generate(input_features)
    transcription = processor.tokenizer.batch_decode(predicted_ids, skip_special_tokens=True)[0]

    with open("output.txt", "w") as f:
        f.write(transcription)
    
    thread_json = agents.orchestrator.simulate(
        input_file_path="output.txt",
        agent_count=10,
        rounds=8,
        first_response_count=2,
        round_agents=5,
        temperature=0.7,
        confrontational_decay=0.48,
    )
    
    parallels = calculate_parallel(thread_json)
    calc_pie = calculate_pi(thread_json)
    calc_cloud = calculate_cloud(thread_json)

    return jsonify({
        "transcription": transcription,
        "parallel": parallels,
        "pie": calc_pie,
        "cloud": calc_cloud
    })

if __name__ == '__main__':
    # Run the server on port 8081
    app.run(host='0.0.0.0', port=8081)
