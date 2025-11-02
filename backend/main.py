from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pickle
import os
from groq import Groq  # Correct import for Groq client

# if you want to run this then you have to firslty run the backend server using: uvicorn backend.main:app --reload or   python -m uvicorn main:app --reload 
# you have to run this command in the backend folder where main.py is located\
    # Make sure to install required packages: fastapi, uvicorn, numpy, scikit-learn, pydantic, groq
    #now ypu should use the frontend to start by giving command : npm run dev 


    
# Initialize FastAPI app
app = FastAPI()
# CORS configuration

origins = [
    "https://heart-diseases-predictions-52ut-1zt62bsg6.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "*"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Load model
# model = None
# if os.path.exists("heart.pkl"):
#     with open("heart.pkl", "rb") as f:
#         model = pickle.load(f)
# else:
#     raise RuntimeError("Error: heart.pkl not found. Please add the model file.")

# Path to heart.pkl inside the same backend folder
MODEL_PATH = os.path.join(os.path.dirname(__file__), "heart.pkl")

if not os.path.exists(MODEL_PATH):
    raise RuntimeError(f"Error: heart.pkl not found at {MODEL_PATH}. Please upload the file.")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

# Initialize Groq client with API key
groq_api_key = os.getenv("GROQ_API_KEY", "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")  # Default for dev; use env var in production
if not groq_api_key:
    raise RuntimeError("GROQ_API_KEY not set.")

groq_client = Groq(api_key=groq_api_key)

# Request models
class Patient(BaseModel):
    age: int
    cp: int
    trestbps: int
    chol: int
    restecg: int
    thalach: int
    oldpeak: float
    slope: int
    ca: int
    thal: int

class ChatRequest(BaseModel):
    message: str

# Routes
@app.get("/")
def home():
    return {"message": "Heart Disease Prediction API is Live ✅"}


@app.post("/predict", response_model=dict)
def predict(input: Patient):
    try:
        features = np.array([[
            input.age,
            input.cp,
            input.trestbps,
            input.chol,
            input.restecg,
            input.thalach,
            float(input.oldpeak),
            input.slope,
            input.ca,
            input.thal
        ]], dtype=float)

        pred = model.predict(features)
        proba = model.predict_proba(features).tolist() if hasattr(model, "predict_proba") else None

        return {
            "prediction": int(pred[0]),
            "proba": proba,
            "message": "Heart disease detected" if int(pred[0]) == 1 else "No heart disease detected"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

import httpx  # Make sure httpx is installed: pip install httpx

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "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")

@app.post("/chat")
async def chat_with_bot(req: ChatRequest):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openai/gpt-oss-20b",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant specialized in heart disease."},
            {"role": "user", "content": req.message}
        ],
        "temperature": 0.7,
        "max_tokens": 150
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(GROQ_API_URL, headers=headers, json=payload)
            response.raise_for_status()  # Raise error if HTTP status code is not 2xx
            data = response.json()
            reply = data["choices"][0]["message"]["content"].strip()
            return {"reply": reply}
    except httpx.HTTPError as e:
        print("Groq API error:", str(e))
        return {"reply": "Sorry, I could not process your request at this time."}
