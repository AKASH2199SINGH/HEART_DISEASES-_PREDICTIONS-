from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import numpy as np
import pickle

# Request schema (import your existing one if defined)
from model import Patient

app = FastAPI()

# CORS: list the FRONTEND origins (no paths)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.1.7:8081"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # during dev you can use ["*"] to test
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


with open("heart.pkl", "rb") as f:
    model = pickle.load(f)

@app.get("/")
def welcome():
    return JSONResponse({"result": "welcome"})

@app.post("/predict")
def predict(input: Patient):
    # Build features in the SAME order used in training
    features = np.array([
        input.age,
        input.cp,
        input.trestbps,
        input.chol,
        input.restecg,
        input.thalach,
        input.oldpeak,
        input.slope,
        input.ca,
        input.thal
    ], dtype=float).reshape(1, -1)

    # Do NOT fit a new scaler here. If the saved model is a Pipeline, this will include the scaler.
    # If your pickle is only the estimator, ensure to load the saved, pre-fitted scaler and use scaler.transform(features).

    pred = model.predict(features)
    proba = None
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(features).tolist()

    return JSONResponse(content={"prediction": int(pred), "proba": proba})
