from flask import Flask, request, jsonify
import io
import librosa
import torch
import soundfile as sf
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from safetensors.torch import load_file as load_safetensors
from flask_cors import CORS  # Import flask-cors

app = Flask(__name__)
CORS(app)

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

    return jsonify({"transcription": transcription})

if __name__ == '__main__':
    # Run the server on port 8081
    app.run(host='0.0.0.0', port=8081)
