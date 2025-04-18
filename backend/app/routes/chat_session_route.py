from fastapi import APIRouter, Query, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from backend.app.utilities.business_logic.chapter_retrieval import ChapterService
from app.utilities.business_logic.jwt_service import JWTService
from app.database import get_db


router = APIRouter()

jwt = JWTService()
@router.post("")