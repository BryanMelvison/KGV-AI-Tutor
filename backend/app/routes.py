from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.llm import ChatService
from app.services.exercise import ExerciseService

router = APIRouter()
chat_service = ChatService()
exercise_service = ExerciseService()

class MessageRequest(BaseModel):
    prompt: str
    session_id: str

class EndSessionRequest(BaseModel):
    session_id: str

class ExerciseMessageRequest(BaseModel):
    prompt: str

@router.post("/chat/messages")
def process_message(request: MessageRequest):
    try:
        response = chat_service.process_message(request.prompt, request.session_id)
        return {"status": "success", "data": {"response": response}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/clear", status_code=204)
def clear_session(request: EndSessionRequest):
    try:
        chat_service.clear_memory(request.session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/exercise/initialize")
def initialize_exercise():
    try:
        response = exercise_service.initialize_exercise()
        return {"status": "success", "data": {"response": response}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/exercise/response")
def process_exercise_message(request: ExerciseMessageRequest):
    try:
        response = exercise_service.process_message(request.prompt)
        return {"status": "success", "data": {"response": response}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))