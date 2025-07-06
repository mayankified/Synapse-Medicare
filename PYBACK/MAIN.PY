from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pickle
import openai
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize FastAPI app
app = FastAPI()

# Allow CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained ML model
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

# ✅ Chat API using OpenAI
class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": request.message}]
        )
        return {"response": response["choices"][0]["message"]["content"]}
    except Exception as e:
        return {"error": str(e)}

# ✅ Prediction API using Pickle ML Model
class PredictRequest(BaseModel):
    values: list[float]

@app.post("/predict")
def predict(request: PredictRequest):
    try:
        values_array = np.array(request.values).reshape(-1, 1)
        prediction = model.predict(values_array).tolist()
        return {"prediction": prediction}
    except Exception as e:
        return {"error": str(e)}

# ✅ Health Check
@app.get("/")
def root():
    return {"message": "FastAPI server is running 🚀"}

