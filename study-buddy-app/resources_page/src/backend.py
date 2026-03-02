import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import google.genai as genai
from google.api_core.exceptions import ResourceExhausted
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# 1. Initialize FastAPI
app = FastAPI(title="StudyBuddy API")

# 2. Configure CORS so your React frontend can talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Configure Gemini (Make sure to set GEMINI_API_KEY in your environment variables)
# Example: export GEMINI_API_KEY="your_api_key_here"
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("WARNING: GEMINI_API_KEY environment variable not set!")
else:
    genai.configure(api_key=api_key)

# 4. Define Data Models
class UserRequest(BaseModel):
    weakAreas: List[str]

# 5. Tenacity Backoff Logic
# This will retry UP TO 5 times.
# It will wait 2^x * 1 seconds between each retry, up to a maximum of 20 seconds.
# It ONLY retries if the error is "ResourceExhausted" (which is the 429 Rate Limit error).
@retry(
    wait=wait_exponential(multiplier=1, min=2, max=20),
    stop=stop_after_attempt(5),
    retry=retry_if_exception_type(ResourceExhausted),
    reraise=True # If it fails 5 times, throw the error to the user
)
def generate_recommendations_with_backoff(prompt: str):
    print("Attempting to call Gemini API...")
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    # We enforce JSON output structure to make parsing safer
    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )
    return response.text

# 6. API Endpoint
@app.post("/api/recommendations")
async def get_recommendations(req: UserRequest):
    if not api_key:
         raise HTTPException(status_code=500, detail="Server missing Gemini API Key")

    areas = ", ".join(req.weakAreas)
    prompt = f"""
    I am a Class 12 student weak in {areas}. 
    Suggest 3 short resources (Video/Notes) to help me understand this better.
    Return ONLY a JSON array with the exact following keys: 
    "title", "type" (must be "Video" or "Notes"), "source", "desc", "link" (a valid URL).
    """

    try:
        # Call our robust function wrapped in Tenacity
        raw_json_string = generate_recommendations_with_backoff(prompt)
        
        # Parse the JSON and return it to the frontend
        parsed_data = json.loads(raw_json_string)
        return parsed_data
        
    except ResourceExhausted:
        raise HTTPException(status_code=429, detail="API Rate limit exceeded even after retries. Please wait a minute.")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Gemini returned invalid JSON.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# To run this file, use:
# uvicorn backend:app --reload --port 8000