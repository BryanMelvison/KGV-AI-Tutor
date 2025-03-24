from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utilities.exercise import ExerciseService

router = APIRouter()
exercise_service = ExerciseService()

class ExerciseMessageRequest(BaseModel):
    prompt: str

@router.post("/initialize")
def initialize_exercise():
    try:
        response = exercise_service.initialize_exercise()
        return {"status": "success", "data": {"response": response}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/response")
def process_exercise_message(request: ExerciseMessageRequest):
    try:
        response = exercise_service.process_message(request.prompt)
        return {"status": "success", "data": {"response": response}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))