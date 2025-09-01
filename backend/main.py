from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import numpy as np
import pickle
import os


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

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model = None
if os.path.exists("heart.pkl"):
    with open("heart.pkl", "rb") as f:
        model = pickle.load(f)
else:
    raise RuntimeError("Error: heart.pkl not found. Please add the model file.")

@app.get("/", response_model=dict)
def welcome():
    return {"result": "welcome"}

@app.post("/predict", response_model=dict)
def predict(input: Patient):
    try:
       
        if not (0 <= input.age <= 120):
            raise HTTPException(status_code=400, detail="Age must be between 0 and 120")
        if not (0 <= input.cp <= 3):
            raise HTTPException(status_code=400, detail="Chest pain type must be between 0 and 3")
        if not (90 <= input.trestbps <= 200):
            raise HTTPException(status_code=400, detail="Resting blood pressure must be between 90 and 200")
        if not (100 <= input.chol <= 600):
            raise HTTPException(status_code=400, detail="Cholesterol must be between 100 and 600")
        if not (0 <= input.restecg <= 2):
            raise HTTPException(status_code=400, detail="Resting ECG must be between 0 and 2")
        if not (60 <= input.thalach <= 202):
            raise HTTPException(status_code=400, detail="Maximum heart rate must be between 60 and 202")
        if not (0 <= input.oldpeak <= 6.2):
            raise HTTPException(status_code=400, detail="ST depression must be between 0 and 6.2")
        if not (0 <= input.slope <= 2):
            raise HTTPException(status_code=400, detail="Slope must be between 0 and 2")
        if not (0 <= input.ca <= 4):
            raise HTTPException(status_code=400, detail="Number of vessels must be between 0 and 4")
        if not (0 <= input.thal <= 3):
            raise HTTPException(status_code=400, detail="Thalassemia must be between 0 and 3")

       
        features = np.array([[
            input.age,
            input.cp,
            input.trestbps,
            input.chol,
            input.restecg,
            input.thalach,
            float(input.oldpeak),  # ensure float
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
