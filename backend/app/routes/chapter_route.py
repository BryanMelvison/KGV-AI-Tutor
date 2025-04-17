from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from app.utilities.chapter import ChapterService

router = APIRouter()
chapter_service = ChapterService()

@router.post("/learning-objective")
def get_learning_objective(
    subject: str = Query(..., description="Subject name"),
    chapter: int = Query(..., description="Chapter number")
):
    try:        
        response = chapter_service.get_learning_objective(chapter, subject)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chapter-number")
def get_chapter_number(
    chapter: str = Query(..., description="Chapter name")
):
    try:
        response = chapter_service.get_chapter_number(chapter)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/all-chapter-name")
def get_all_chapter_name(
    subject: int = Query(..., description="Subject name")
):
    try:
        response = chapter_service.get_all_chapter_name(subject)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/subject-number")
def get_subject_number(
    subject: str = Query(..., description="Subject name")
):
    try:
        response = chapter_service.get_subject_number(subject)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))