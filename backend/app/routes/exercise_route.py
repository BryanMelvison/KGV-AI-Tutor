from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from app.utilities.exercise import ExerciseService
from app.utilities.business_logic.jwt_service import JWTService

router = APIRouter()
jwt = JWTService()
exercise_service = ExerciseService()

class ExerciseMessageRequest(BaseModel):
    question_title: str
    question_answer: str
    prompt: str
    
class ExerciseAttemptRequest(BaseModel):
    questionId: int
    completedQuestions: int
    totalQuestions: int

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

@router.post("/save-exercise-attempt")
def save_exercise_attempt(
    request: ExerciseAttemptRequest, 
    auth_data: dict = Depends(jwt.verify_token)):
    try:
        user_id = auth_data.get("sub")
        exercise_service.save_exercise_attempt(
            request.questionId,
            request.completedQuestions,
            request.totalQuestions,
            user_id
        )
        return {"message": "Exercise attempt saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/get-exercise-mcq-answer")
def get_mcq_options(
    questionId: int = Query(..., description="Question ID"),
    auth_data: dict = Depends(jwt.verify_token)
):
    try:
        # user_id = auth_data.get("sub")
        response = exercise_service.get_mcq_options(questionId)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))