import google.generativeai as genai
import json
from dotenv import load_dotenv
import os

try:
    env_path = os.path.join(os.path.dirname(__file__), "../.env")
    load_dotenv(env_path)
    api_key = os.environ.get("GEMINI_API_KEY")
    genai.configure(api_key=api_key)

    print("API Key configured successfully.")
except ValueError as e:
    print(f"API Key Configuration Error: {e}")
    print("Please set the GEMINI_API_KEY environment variable or configure the API key directly in the script for testing (not recommended for production).")
    exit()
except Exception as e:
    print(f"An unexpected error occurred during configuration: {e}")
    exit()

model_name = "gemini-2.0-flash"

# --- Input Data (from adapted_swift_thread_json) ---
# This JSON string still needs to be defined here or loaded from its own source
input_file_path = os.path.join(os.path.dirname(__file__), "sample_msg.json")

# Read the input JSON data from the file
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
prompt = None # Initialize prompt variable

try:
    print(f"Reading prompt template from file: {prompt_filename}")
    # Read the entire content of the prompt file
    with open(prompt_filename, 'r', encoding='utf-8') as f:
        prompt_template = f.read()

    # Assume prompt.txt contains placeholders like {input_thread_json_str}
    # Use .format() to insert the actual JSON data into the template
    prompt = prompt_template.format(input_thread_json_str=input_thread_json_str)
    print("Prompt constructed successfully using template file.")

except FileNotFoundError:
    print(f"Error: Prompt file not found at '{os.path.abspath(prompt_filename)}'")
    print("Please ensure the file exists in the correct directory relative to the script.")
    exit()
except KeyError as e:
    # This error occurs if the placeholder is missing in the file
    print(f"Error: Placeholder {e} not found in the prompt template file '{prompt_filename}'.")
    print("Ensure the file contains necessary placeholders like {input_thread_json_str}.")
    exit()
except Exception as e:
    print(f"An error occurred reading or formatting the prompt file: {e}")
    exit()

# Ensure prompt was loaded successfully before proceeding
if prompt is None:
   print("Error: Prompt could not be loaded or constructed. Exiting.")
   exit()

# --- Generate Content ---
try:
    # Initialize the generative model
    model = genai.GenerativeModel(model_name)

    # Configure generation parameters (optional)
    generation_config = genai.types.GenerationConfig(
        temperature=0.7 
    )

    safety_settings = [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_ONLY_HIGH"},
    ]

    print(f"\nSending prompt to Gemini model ({model_name})...")
    response = model.generate_content(
        prompt,
        generation_config=generation_config,
        safety_settings=safety_settings
    )

    # --- Process and Print Response ---
    print("\n--- Gemini API Raw Response Text ---")
    if response.text:
        cleaned_response_text = response.text.strip().strip('```json').strip('```').strip()
        print(cleaned_response_text)

        # Optional: Try to parse the response as JSON
        try:
            parsed_json = json.loads(cleaned_response_text)
            print("\n--- Response Parsed as JSON (Validation) ---")
            print(json.dumps(parsed_json, indent=2))
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

except Exception as e:
    print(f"\nAn error occurred during API call or processing: {e}")

print("\n--- Script Finished ---")
