from fastapi import APIRouter, Query, Depends, Request
from sqlalchemy.orm import Session
from app.utilities.business_logic.chapter_retrieval import ChapterService
from app.utilities.business_logic.jwt_service import JWTService
from app.database import get_db

router = APIRouter()

jwt = JWTService()


@router.post("/learning-objective")
async def get_learning_objective(
    request: Request,
    subject: str = Query(...),
    chapter: int = Query(...),
    auth_data: dict = Depends(jwt.verify_token),
    db: Session = Depends(get_db),
):
    user_id = auth_data.get("sub")
    chapter_service = ChapterService(db)
    return chapter_service.get_learning_objective(user_id, chapter, subject)

@router.post("/chapter-number")
async def get_chapter_number(
    request: Request,
    chapter: str = Query(...),
    auth_data: dict = Depends(jwt.verify_token),
    db: Session = Depends(get_db),
):
    user_id = auth_data.get("sub")
    chapter_service = ChapterService(db)
    return chapter_service.get_chapter_number(user_id, chapter)

@router.post("/all-chapter-name")
async def get_all_chapter_name(
    request: Request,
    subject: int = Query(...),
    auth_data: dict = Depends(jwt.verify_token),
    db: Session = Depends(get_db),
):
    user_id = auth_data.get("sub")
    chapter_service = ChapterService(db)
    return chapter_service.get_all_chapter_name(user_id, subject)

@router.post("/subject-number")
async def get_subject_number(
    request: Request,
    subject: str = Query(...),
    auth_data: dict = Depends(jwt.verify_token),
    db: Session = Depends(get_db),
):
    user_id = auth_data.get("sub")
    chapter_service = ChapterService(db)
    return chapter_service.get_subject_number(user_id, subject)

@router.post("/syllabus-completed-percentage")
async def get_syllabus_completed_percentage(
    auth_data: dict = Depends(jwt.verify_token),
    db: Session = Depends(get_db),
):
    user_id = auth_data.get("sub")
    chapter_service = ChapterService(db)
    return chapter_service.get_syllabus_completed_percentage(user_id)
