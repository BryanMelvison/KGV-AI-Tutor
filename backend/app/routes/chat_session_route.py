from fastapi import APIRouter, Query, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from app.utilities.business_logic.chat_session import ChatSessionService
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
    chat_session_service = ChatSessionService(db)
    return chat_session_service.add_session_to_database(user_id, request.subjectId, request.chapterId, request.sessionName)

@router.get("/get-chat-session")
def get_chat_session(
    subjectId: int = Query(...),
    chapterId: int = Query(...),
    auth_data: dict = Depends(jwt.verify_token),
    db: Session = Depends(get_db),
):
    user_id = auth_data.get("sub")
    chat_session_service = ChatSessionService(db)
    return chat_session_service.retrieve_all_session_from_database(user_id, subjectId, chapterId)
