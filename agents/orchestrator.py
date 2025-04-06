import google.generativeai as genai
import json
from dotenv import load_dotenv
import os
import random
import math

AGENT_PERSONAS_FILE = "agent_personas.json"

try:
    env_path = os.path.join(os.path.dirname(__file__), "../.env")
    load_dotenv(env_path)
    api_key = os.environ.get("GEMINI_API_KEY")
    model_name = os.environ.get("MODEL_NAME", "gemini-2.0-flash")
    genai.configure(api_key=api_key)

    print("API Key configured successfully.")
except ValueError as e:
    print(f"API Key Configuration Error: {e}")
    print("Please set the GEMINI_API_KEY environment variable or configure the API key directly in the script for testing (not recommended for production).")
    exit()
except Exception as e:
    print(f"An unexpected error occurred during configuration: {e}")
    exit()

def load_agents(agent_count):
    with open(AGENT_PERSONAS_FILE, "r") as f:
        agents_json = json.load(f)
        agents = agents_json["agents"]
    if agent_count > len(agents):
        print(f"Warning: Requested agent count {agent_count} exceeds available agents {len(agents)}. Using all available agents.")
        agent_count = len(agents)
    return agents[:agent_count]    

def get_agent_response(agent, prompt, temperature):
    model = genai.GenerativeModel(model_name=model_name)
    generation_config = genai.GenerationConfig(
        temperature=temperature,
    )

    SAFETY_SETTINGS = [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_ONLY_HIGH"},
    ]
    
    response = model.generate_content(
        prompt,
        generation_config=generation_config,
        safety_settings=SAFETY_SETTINGS
    )
    
    if response.text:
        cleaned_response_text = response.text.strip().strip('```json').strip('```').strip()
        # print(cleaned_response_text)

        try:
            parsed_json = json.loads(cleaned_response_text)
            return parsed_json
        except json.JSONDecodeError:
            print("\n--- Warning: Could not parse response text as JSON. ---")
        except Exception as e:
            print(f"\n--- Error processing parsed JSON: {e} ---")
    else:
        print("Received an empty or potentially blocked response.")
        try:
            print(f"Finish Reason: {response.candidates[0].finish_reason}")
            print(f"Safety Ratings: {response.candidates[0].safety_ratings}")
        except (IndexError, AttributeError):
            pass
        if response.prompt_feedback:
            print(f"Prompt Feedback: {response.prompt_feedback}")    
    return None
    
def extract_ids(response):
    def parse_ids(message_id):
        out = message_id.split("_")
        return out[0], out[1]
    
    message_counts = {}

    def _traverse(comments_list):
        nonlocal message_counts
        
        for comment in comments_list:
            agent_num, message_num = parse_ids(comment["message_id"])
            if agent_num not in message_counts:
                message_counts[agent_num] = message_num
            else:
                message_counts[agent_num] = max(message_counts[agent_num], message_num)
            if "replies" in comment:
                _traverse(comment["replies"])

    return (_traverse(response["replies"]), message_counts)[-1]
    
def merge(response, output_response):
    # Placeholder for merging logic
    # This function should implement the logic to merge the response with the output_response
    # For now, we'll just return the response as is.
    reply_to = response["reply_to"]
    comments = output_response["replies"]
    queue = [comment for comment in comments]
    
    agent_number = response["author_name"].split(" ")[-1]
    message_count = extract_ids(output_response)
    if agent_number not in message_count:
        agent_number_new_id = 1
    else:
        agent_number_new_id = int(message_count[agent_number]) + 1   
    
    new_comment = {
        "author_name": response["author_name"],
        "message_id": f"{agent_number}_{agent_number_new_id}",
        "comment_text": response["comment_text"],
        "replies": []
    }
    
    if reply_to == "MAIN":
        output_response["replies"].append(new_comment)
        return output_response
        
    while queue:
        comment = queue.pop(0)
        if comment["message_id"] == reply_to:
            comment["replies"].append(new_comment)
            return output_response
        if "replies" in comment:
            queue.extend(comment["replies"])
    
    return None

def calculaute_apathy(confrontational, round_idx, decay_rate):
    top = (confrontational + 1) * math.exp(-0.1 * round_idx - 1)
    bot = 1 + math.pow(1 + 0.1 * decay_rate, round_idx)
    return top / bot

def simulate(
        input_file_path=None, 
        agent_count=10, 
        rounds=5, 
        first_response_count=5,
        temperature=0.7,
        confrontational_decay=0.48,
    ):
    
    if input_file_path is None:
        print("No input file path provided. Reverting to default.")
        input_file_path = os.path.join(os.path.dirname(__file__), "sample_msg.json")
    
    try:
        with open(input_file_path, 'r', encoding='utf-8') as input_file:
            input_thread_json_str = input_file.read()
            print("Input JSON data loaded successfully.")
    except FileNotFoundError:
        print(f"Error: Input file not found at '{os.path.abspath(input_file_path)}'")
        print("Please ensure the file exists in the correct directory.")
        exit()
    except Exception as e:
        print(f"An error occurred while reading the input file: {e}")
        exit()
    
    # --- Construct the Prompt from File ---
    prompt_filename = "prompt.txt"
    prompt = None
    
    print(f"Reading prompt template from file: {prompt_filename}")
    
    with open(prompt_filename, 'r', encoding='utf-8') as f:
        prompt_template = f.read()

    
    # --- Simulate First Responses ---
    agents = load_agents(agent_count)    
    random_numbers = random.sample(range(agent_count), k=first_response_count)
    print(f"Random agents: {random_numbers}")

    initial_responses = []

    for i in random_numbers:
        agent_personality = agents[i]
        # need to load the agent persona and name into the input_thread_json then convert to a string
        # then pass it to the prompt        
        input_thread_json = json.loads(input_thread_json_str)
        input_thread_json["name"] = f"Agent {i}"
        input_thread_json["personality"] = agent_personality
        input_thread_json_str = json.dumps(input_thread_json)
        
        prompt = prompt_template.format(input_thread_json_str=input_thread_json_str)
        
        print(f"Agent {i} is generating a response.")
        response = get_agent_response(agent_personality, prompt, temperature)
        if response:
            # response will be an array of responses, up to 2        
            initial_responses.extend(response)
        else:
            print(f"Agent {i} failed to generate a response.")    
    
    output_response = json.loads(input_thread_json_str)
    
    for reply in initial_responses:
        new_response = merge(reply, output_response)
        if new_response is None:
            print("Error: Could not merge response.")
            print(f"Reply: {reply}")
            continue  
        else:
            print(f"{reply['author_name']} merged their response.")
            output_response = new_response.copy()
    
    # --- Simulate Rounds ---    
    apathetic_agents = set()
    
    for round_idx in range(rounds):
        print(f"Round {round_idx + 1} of {rounds}")
        interested_agents = set(range(agent_count)) - apathetic_agents
        if not interested_agents:
            print("All agents are apathetic. Ending simulation.")
            break
        for i in interested_agents:
            agent_personality = agents[i]
            # need to load the agent persona and name into the input_thread_json then convert to a string
            # then pass it to the prompt        
            input_thread_json = json.loads(input_thread_json_str)
            input_thread_json["name"] = f"Agent {i}"
            input_thread_json["personality"] = agent_personality
            input_thread_json_str = json.dumps(input_thread_json)
            
            prompt = prompt_template.format(input_thread_json_str=input_thread_json_str)
            
            print(f"Agent {i} is generating a response.")
            response = get_agent_response(agent_personality, prompt, temperature)
            if response:
                # response will be an array of responses, up to 2
                agent_confrontation = agent_personality["Confrontational"]
                apathy_probability = calculaute_apathy(agent_confrontation, round_idx, confrontational_decay)
                
                if random.random() > apathy_probability:                        
                    initial_responses.extend(response)
                elif random.random() > apathy_probability/2:
                    initial_responses.append(response[0])
                else:
                    apathetic_agents.add(i)
            else:
                print(f"Agent {i} failed to generate a response.")
    
    

    formatted = json.dumps(output_response, indent=4)
    print(formatted)

if __name__ == "__main__":
    simulate(
        input_file_path="sample_msg.json",
        agent_count=10,
        rounds=8,
        first_response_count=2,
        temperature=0.7,
        confrontational_decay=0.48,
    )