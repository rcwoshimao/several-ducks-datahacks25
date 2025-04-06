import random, json

BASE_PERSONALITY = {
    "Sarcasm": 0.0,
    "Temperament": 0.0,
    "Neuroticism": 0.0,
    "Toxcitiy": 0.0,
    "Obsession": 0.0,
    "Elitism": 0.0,
    "Sycophant": 0.0,
    "Loyalty": 0.0,
    "Confrontational": 0.0,
    "Openminded": 0.0
}

for key in BASE_PERSONALITY:
    BASE_PERSONALITY[key] = 2.0 # preset to allow clipping

COUNT = 50 
OUTPUT_FILE = "agent_personas.json"

def invalid_traits(personality):
    # Check if the personality profile is valid
    invalids = []
    for key, value in personality.items():
        if not (-1 <= value <= 1):
            invalids.append(key)
    return invalids

output_data = {
    "agents": []
}

for n in range(COUNT):
    # Generate a random personality profile by sampling from a normal distribution
    print(f"Agent {n} generating...")
    personality = {key: random.gauss(0, 1) for key, value in BASE_PERSONALITY.items()}
    personality = {key: round(value, 2) for key, value in personality.items()}
    invalids = invalid_traits(personality)
    while len(invalids) > 0:
        for persona in invalids:
            personality[persona] = random.gauss(-1, 1) 
            personality[persona] = round(personality[persona], 2)
        invalids = invalid_traits(personality)        
    
    output_data["agents"].append(personality)
        
with open(OUTPUT_FILE, 'w') as f:
    json.dump(output_data, f, indent=4)
    print(f"Generated {COUNT} random personality profiles and saved to '{OUTPUT_FILE}'.")