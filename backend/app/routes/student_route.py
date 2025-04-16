from fastapi import APIRouter, HTTPException, Query
from app.utilities.student import StudentService

router = APIRouter()
student_service = StudentService()

@router.post("/mastery-status")
def get_mastery_status(
    studentId: int = Query(..., description="Student ID"),
    subject: str = Query(..., description="Subject name"),
    chapter: int = Query(..., description="Chapter number")
):
    try:
        response = student_service.get_mastery_status(studentId, subject, chapter)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))