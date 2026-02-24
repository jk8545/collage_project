import os
from dotenv import load_dotenv

load_dotenv()

print(f"Groq Key Loaded: {bool(os.getenv('GROQ_API_KEY'))}")
print(f"DB URL Loaded: {bool(os.getenv('DATABASE_URL'))}")