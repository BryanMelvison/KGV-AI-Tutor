from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.utilities.llm import ChatService
from app.utilities.business_logic.jwt_service import JWTService
from app.database import get_db
from sqlalchemy.orm import Session
from langchain_core.messages import HumanMessage
import datetime

router = APIRouter()
jwt = JWTService()

class MessageRequest(BaseModel):
    prompt: str 
    session_id: str
    subject: str
    chapter: str

class EndSessionRequest(BaseModel):
    session_id: str

class MessageResponse(BaseModel):
    role: str
    content: str
    timestamp: Optional[datetime.datetime] = None

class ChatHistoryResponse(BaseModel):
    session_id: str
    messages: List[MessageResponse]

@router.post("/messages")
def process_message(
    request: MessageRequest, 
    auth_data: dict = Depends(jwt.verify_token),
    db: Session = Depends(get_db)
):
    try:        
        # Create chat service with database session
        user_id = auth_data.get("sub")

        chat_service = ChatService(user_id, db, subject=request.subject, chapter=request.chapter)
        
        # Process the message
        response = chat_service.process_message(
            user_input=request.prompt,  # Use prompt as user_input
            session_id=request.session_id,
        )
                        
        return {
            "status": "success",
            "data": {
                "response": response["response"],
                "chat_history": response["memory"],
                "used_rag": response["used_rag"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/clear")
def clear_session(
    request: EndSessionRequest,
    auth_data: dict = Depends(jwt.verify_token),
    db: Session = Depends(get_db)
):
    try:
        user_id = auth_data.get("sub")
        chat_service = ChatService(user_id, db)
        deleted_count = chat_service.clear_memory(request.session_id)
        return {
            "status": "success", 
            "message": f"Session cleared successfully. Deleted {deleted_count} messages."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{session_id}")
def get_chat_history(
    session_id: str,
    auth_data: dict = Depends(jwt.verify_token),
    db: Session = Depends(get_db)
):
    try:        
        # Create a temporary chat service to load messages
        chat_service = ChatService(db)
        messages = chat_service.load_messages_from_db(session_id)
        
        # Format messages for API response
        formatted_messages = []
        for msg in messages:
            msg_type = "human" if isinstance(msg, HumanMessage) else "ai"
            
            # Safely get timestamp from response_metadata
            timestamp = None
            if hasattr(msg, 'response_metadata') and msg.response_metadata:
                timestamp = msg.response_metadata.get("timestamp", None)
            
            formatted_messages.append({
                "role": msg_type,
                "content": msg.content,
                "timestamp": timestamp,
            })
                            
        return {
            "status": "success",
            "data": {
                "session_id": session_id,
                "messages": formatted_messages
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))