from fastapi import APIRouter, Query, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from app.utilities.business_logic.chapter_retrieval import ChapterService
from app.utilities.business_logic.jwt_service import JWTService
from app.database import get_db
from pydantic import BaseModel


router = APIRouter()
jwt = JWTService()

#pydantic
class ChatSessionRequest(BaseModel):
    subjectId: int
    chapterId: int
    sessionName: str


@router.post("/add-chat-session")
def add_chat_session(request: ChatSessionRequest, auth_data: dict = Depends(jwt.verify_token), db: Session = Depends(get_db)):
    user_id = auth_data.get("sub")
    chapter_service = ChapterService(db)
    return chapter_service.add_chat_session(user_id, request.subjectId, request.chapterId, request.sessionName)
