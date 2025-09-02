from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pickle
import os
import openai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # For production, restrict accordingly
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model file
model = None
if os.path.exists("heart.pkl"):
    with open("heart.pkl", "rb") as f:
        model = pickle.load(f)
else:
    raise RuntimeError("Error: heart.pkl not found. Please add the model file.")

# Load OpenAI API Key securely
import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")
if openai.api_key is None:
    raise RuntimeError("OPENAI_API_KEY environment variable not set")

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

@app.get("/", response_model=dict)
def welcome():
    return {"result": "welcome"}

@app.post("/predict", response_model=dict)
def predict(input: Patient):
    try:
        # Validation here...
        # Same as your original code

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

@app.post("/chat")
async def chat_with_bot(req: ChatRequest):
    prompt = f"You are a helpful assistant specialized in heart disease. User: {req.message}\nAssistant:"
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=150,
            temperature=0.7,
            n=1,
            stop=["User:", "Assistant:"],
        )
        reply = response.choices[0].text.strip()
        return {"reply": reply}
    except Exception as e:
        print("OpenAI error:", str(e))  # Print the error in backend console
        return {"reply": "Sorry, I could not process your request at this time."}
