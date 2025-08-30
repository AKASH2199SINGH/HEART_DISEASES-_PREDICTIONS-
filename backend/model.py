from pydantic import BaseModel
from fastapi import FastAPI

class Patient(BaseModel):
    age: int
    cp: int
    trestbps:int
    chol: int
    restecg:int
    thalach:int
    oldpeak:float
    slope:int
    ca:int
    thal:int