from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from app.utilities.exercise import ExerciseService

router = APIRouter()
exercise_service = ExerciseService()

class ExerciseMessageRequest(BaseModel):
    question_title: str
    question_answer: str
    prompt: str
    
@router.post("/response")
def process_exercise_message(request: ExerciseMessageRequest):
    try:
        response = exercise_service.process_message(request.question_title, request.question_answer, request.prompt)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/get-exercises")
def get_exercises(    
    studentId: int = Query(..., description="Student ID"),
    subject: str = Query(..., description="Subject name"),
    chapter: int = Query(..., description="Chapter number")
):
    try:
        response = exercise_service.get_exercises(studentId, subject, chapter)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/get-exercise-questions")
def get_exercise_questions(
    subject: str = Query(..., description="Subject name"),
    chapter: int = Query(..., description="Chapter number"),
    exerciseLetter: str = Query(..., description="Exercise Letter")
):
    try:
        response = exercise_service.get_exercise_questions(subject, chapter, exerciseLetter)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))