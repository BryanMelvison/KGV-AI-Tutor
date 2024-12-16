from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.chat import ChatMessage, ChatResponse, ChatHistorySchema
from app.services.chat import ChatService

router = APIRouter()
chat_service = ChatService()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    message: ChatMessage,
    db: Session = Depends(get_db)
):
    try:
        response = chat_service.create_chat_response(db, message.message)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chat/history", response_model=List[ChatHistorySchema])
async def get_chat_history(db: Session = Depends(get_db)):
    try:
        return chat_service.get_chat_history(db, limit=50)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))