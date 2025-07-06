import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, File, UploadFile, Depends
from pydantic import BaseModel
from PIL import Image
import pytesseract
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from fastapi.middleware.cors import CORSMiddleware
import json
import io
import requests
from bs4 import BeautifulSoup

load_dotenv()


app = FastAPI(title="Doctor-Patient Chat API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

llm = ChatOpenAI(
    base_url="https://api.groq.com/openai/v1/",
    api_key=os.getenv("GROQ_API_KEY"),
    

    model="llama-3.3-70b-versatile",
)


session_memory = {}



class ChatRequest(BaseModel):
    session_id: str
    patient_message: str


@app.post("/chat")
async def chat_with_doctor(request: ChatRequest):
    session_id = request.session_id
    patient_message = request.patient_message

    
    if session_id not in session_memory:
        session_memory[session_id] = ConversationBufferMemory()

    memory = session_memory[session_id]

    
    conversation = ConversationChain(llm=llm, memory=memory)

    
    doctor_prompt = (
        "You are a professional and empathetic doctor. "
        "Engage in a friendly and informative conversation with the patient. "
        "Provide medical advice in a responsible manner while ensuring..keep the message  consise and friendly..don't give long replies "
        "the conversation is clear and easy to understand...After every piece of medical advice, include a short disclaimer reminding the patient that this advice may not be entirely accurate, and they should consult a qualified medical professional\n\n"
        
        f"Patient: {patient_message}"
    )

    try:
        
        response = conversation.invoke(input=doctor_prompt)
        doctor_response = response.get(
            "response", "I'm here to help! How can I assist you?"
        )

        return {
            "session_id": session_id,
            "patient_message": patient_message,
            "doctor_response": doctor_response,
            "chat_history": memory.buffer,  
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class DiseaseDetectionRequest(BaseModel):
    main_symptom: str
    duration: str
    severity: str
    additional_symptoms: str


@app.post("/disease-detection")
async def detect_disease(request: DiseaseDetectionRequest):
    try:
        detection_prompt = (
            "You are a professional AI-powered medical assistant. "
            "Based on the symptoms provided, suggest possible conditions and their urgency. "
            "Also, recommend relevant doctors for consultation. "
            "Provide responses in a structured JSON format ONLY, without any extra text.\n\n"
            "**Examples of the expected format:**\n"
            "JSON:\n```json\n"
            "{\n"
            '  "possible_conditions": [\n'
            '    {"name": "Upper Respiratory Infection", "probability": "High", "urgency": "Moderate"},\n'
            '    {"name": "Seasonal Allergies", "probability": "Medium", "urgency": "Low"}\n'
            "  ],\n"
            '  "recommended_doctors": [\n'
            '    {"name": "Dr. Amit Patel", "specialty": "General Medicine", "availability": "Today, 4:00 PM", "fee": "₹500"},\n'
            '    {"name": "Dr. Priya Shah", "specialty": "Pulmonologist", "availability": "Tomorrow, 10:00 AM", "fee": "₹700"}\n'
            "  ]\n"
            "}\n"
            "```\n\n"
            "Now, based on the following symptoms, generate a structured JSON response:\n\n"
            f"Main Symptom: {request.main_symptom}\n"
            f"Duration: {request.duration}\n"
            f"Severity: {request.severity}\n"
            f"Additional Symptoms: {request.additional_symptoms}\n"
        )

        response = llm.invoke(detection_prompt)

        
        if hasattr(response, "content"):
            response_content = response.content.strip()
        else:
            response_content = str(response).strip()

        

        
        start_index = response_content.find("{")
        end_index = response_content.rfind("}")

        if start_index == -1 or end_index == -1:
            raise HTTPException(
                status_code=500, detail="AI response does not contain valid JSON."
            )

        clean_json = response_content[start_index : end_index + 1]

        
        try:
            parsed_response = json.loads(clean_json)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=500, detail="AI response is not valid JSON."
            )

        return {
            "possible_conditions": parsed_response.get("possible_conditions", []),
            "recommended_doctors": parsed_response.get("recommended_doctors", []),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class DietPlanRequest(BaseModel):
    disease_name: str
    condition: str
    special_instructions: str

@app.post("/diet-plan")
async def generate_diet_plan(request: DietPlanRequest):
    """
    Generates a diet plan based on the user's disease, condition, and any special
    instructions such as foods they avoid. 
    """

    diet_prompt = (
        "You are a professional nutritionist. "
        "Consider the patient's condition, disease, and special instructions. "
        "Create a concise 7-day diet plan that is practical, balanced, and mindful of the patient's needs. "
        "Each day's plan should briefly include breakfast, lunch, and dinner ideas. "
        "Recommend healthy and nutritious INDIAN foods that can help improve the patient's condition.INDIAN IS IMPORTANT "
        "Avoid any items the patient has restrictions on, and address their specific condition requirements. "
        "End with a short disclaimer that this plan is not a substitute for professional medical advice.\n\n"
        f"Disease: {request.disease_name}\n"
        f"Condition/Details: {request.condition}\n"
        f"Special Instructions (e.g., foods to avoid): {request.special_instructions}\n\n"
        "Now please provide the 7-day diet plan."
    )

    try:
        response = llm.invoke(diet_prompt)

        
        if hasattr(response, "content"):
            response_content = response.content.strip()
        else:
            response_content = str(response).strip()

        
        return {
            "disease_name": request.disease_name,
            "condition": request.condition,
            "special_instructions": request.special_instructions,
            "diet_plan": response_content,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/analyze-report")
async def analyze_medical_report(file: UploadFile = File(...)):
    try:
        
        image = Image.open(io.BytesIO(await file.read()))
        
        
        extracted_text = pytesseract.image_to_string(image)
        
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="No readable text found in the image.")
        
        
        medical_insights_prompt = (
            "You are an AI medical assistant. Based on the extracted text from a medical report, "
            "identify key medical terms, possible diagnoses, and their implications. "
            "Provide insights in structured JSON format with 'key_terms', 'possible_conditions', and 'advice'.\n\n"
            f"Extracted Text: {extracted_text}\n"
        )
        
        response = llm.invoke(medical_insights_prompt)
        
        
        if hasattr(response, "content"):
            response_content = response.content.strip()
        else:
            response_content = str(response).strip()
        
        
        start_index = response_content.find("{")
        end_index = response_content.rfind("}")

        if start_index == -1 or end_index == -1:
            raise HTTPException(status_code=500, detail="AI response does not contain valid JSON.")

        clean_json = response_content[start_index:end_index + 1]

        try:
            parsed_response = json.loads(clean_json)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="AI response is not valid JSON.")
        
        return {
            "extracted_text": extracted_text,
            "medical_insights": parsed_response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
scraped_data = []


def scrape_myths():
    global scraped_data
    url = 'https://www.medicalnewstoday.com/'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    myth_links = soup.find_all('a', class_='css-xqmvw1 css-i4o77u')
    
    scraped_data = []  
    for myth in myth_links:
        text = myth.get_text(strip=True)
        link = myth.get('href')
        scraped_data.append({"text": text, "link": link})


@app.get("/scrape")
def scrape():
    scrape_myths()  
    return {"myths": scraped_data}

from fastapi import FastAPI
import joblib
import pandas as pd
from pydantic import BaseModel


model = joblib.load("health_scheme_recommender.pkl")
label_encoders = joblib.load("label_encoders.pkl")




class HealthSchemeInput(BaseModel):
    age: int
    income: int
    employment_type: str
    bank_account: str
    socio_status: str
    family_size: int


@app.post("/recommend")
def recommend_scheme(data: HealthSchemeInput):
    
    input_data = pd.DataFrame([[
        data.age, data.income, data.employment_type,
        data.bank_account, data.socio_status, data.family_size
    ]], columns=["Age", "Income", "Employment Type", "Bank Account", "Socio-Economic Status", "Family Size"])
    
    
    input_data["Employment Type"] = label_encoders["Employment Type"].transform([data.employment_type])[0]
    input_data["Bank Account"] = label_encoders["Bank Account"].transform([data.bank_account])[0]
    input_data["Socio-Economic Status"] = label_encoders["Socio-Economic Status"].transform([data.socio_status])[0]
    
    
    scheme_index = model.predict(input_data)[0]
    scheme = label_encoders["Recommended Scheme"].inverse_transform([scheme_index])[0]
    
    return {"Recommended Scheme": scheme}



class ConsentFormRequest(BaseModel):
    consent_text: str

class SimplifiedConsentResponse(BaseModel):
    simplified_points: list

@app.post("/simplify-consent", response_model=SimplifiedConsentResponse)
async def simplify_consent_form(request: ConsentFormRequest):
    """
    Simplifies a complex medical consent form into easy-to-understand key points.
    """
    try:
        simplification_prompt = (
            "You are an expert in simplifying complex medical and legal jargon. "
            "Your task is to take a medical consent form and extract the key points, summarizing them in a simple, easy-to-understand manner for a layperson. "
            "You must provide the response as a structured JSON object with a single key: 'simplified_points'. "
            "The value of 'simplified_points' should be a list of objects, where each object has a 'title' and 'text' field. "
            "The 'title' should be a simple heading for the point, and the 'text' should be a simplified explanation. "
            "Your output must be JSON ONLY, without any additional text or markdown.\n\n"
            "**Example of the expected JSON format:**\n"
            "```json\n"
            "{\n"
            '  "simplified_points": [\n'
            '    {"title": "What is the procedure?", "text": "This part explains what the medical procedure is."},'
            '    {"title": "What are the risks?", "text": "This explains the possible side effects or complications."}'
            '  ]\n'
            "}\n"
            "```\n\n"
            "Now, simplify the following medical consent form text:\n\n"
            f"Consent Form Text: {request.consent_text}\n"
        )

        response = llm.invoke(simplification_prompt)
        response_content = response.content.strip()

        
        start_index = response_content.find("{")
        end_index = response_content.rfind("}")

        if start_index == -1 or end_index == -1:
            raise HTTPException(
                status_code=500, detail="AI response does not contain valid JSON."
            )
        
        clean_json = response_content[start_index : end_index + 1]

        
        try:
            parsed_response = json.loads(clean_json)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=500, detail="AI response is not valid JSON."
            )
        
        
        return SimplifiedConsentResponse(
            simplified_points=parsed_response.get("simplified_points", [])
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")
    

class HandoffSummaryRequest(BaseModel):
    reports: list[str] 


@app.post("/smart-handoff-summary")
async def get_smart_handoff_summary(request: HandoffSummaryRequest):
    """
    Generates an AI-powered summary of multiple nursing handoff reports.
    """
    try:
        if not request.reports:
            return {"summary": "No handoff reports provided for summarization."}

        
        combined_reports = "\n\n---\n\n".join(request.reports) 
        
        summary_prompt = (
            "You are an AI assistant specialized in summarizing nursing handoff reports. "
            "Your goal is to create a concise, critical, and actionable summary of the provided reports. "
            "Highlight key patient updates, critical observations, pending tasks, and any immediate concerns. "
            "Organize the summary logically, for example, by patient or by type of update (e.g., Critical, Pending, General). "
            "Format the summary clearly using bullet points or short paragraphs with clear headings. "
            "Do not include any introductory or concluding remarks outside the summary itself. "
            "Keep it professional and to the point.\n\n"
            "Here are the handoff reports:\n\n"
            f"{combined_reports}"
        )
        
        response = llm.invoke(summary_prompt)
        summary_content = response.content.strip()
        
        return {"summary": summary_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate summary: {str(e)}")
