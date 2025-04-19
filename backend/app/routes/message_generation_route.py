# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from typing import Optional
# from app.utilities.llm import ChatService

# router = APIRouter()
# chat_service = ChatService()

# class MessageRequest(BaseModel):
#     prompt: str
#     session_id: str
#     subject: Optional[str] = None
#     chapter: Optional[str] = None

# class EndSessionRequest(BaseModel):
#     session_id: str

# @router.post("/messages")
# def process_message(request: MessageRequest):
#     try:
#         response = chat_service.process_message(
#             user_input=request.prompt,
#             session_id=request.session_id,
#             subject=request.subject,
#             chapter=request.chapter
#         )
#         return {
#             "status": "success",
#             "data": {
#                 "response": response["response"],
#                 "chat_history": response["memory"],
#                 "used_rag": response["used_rag"]
#             }
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.post("/clear", status_code=204)
# def clear_session(request: EndSessionRequest):
#     try:
#         chat_service.clear_memory(request.session_id)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.utilities.llm import ChatService
from app.utilities.business_logic.jwt_service import JWTService
from app.database import get_db
from sqlalchemy.orm import Session
from langchain_core.messages import HumanMessage, AIMessage


router = APIRouter()
jwt = JWTService()

class MessageRequest(BaseModel):
    prompt: str
    session_id: str
    subject: Optional[str] = None
    chapter: Optional[str] = None

class EndSessionRequest(BaseModel):
    session_id: str

@router.post("/messages")
def process_message(
    request: MessageRequest, 
    auth_data: dict = Depends(jwt.verify_token),
    db: Session = Depends(get_db)
):
    try:
        # Create chat service with database session
        chat_service = ChatService(db)
        
        response = chat_service.process_message(
            user_input=request.prompt,
            session_id=request.session_id,
            subject=request.subject,
            chapter=request.chapter
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

@router.post("/clear", status_code=204)
def clear_session(
    request: EndSessionRequest,
    auth_data: dict = Depends(jwt.verify_token),
    db: Session = Depends(get_db)
):
    try:
        chat_service = ChatService(db)
        chat_service.clear_memory(request.session_id)
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
            formatted_messages.append({
                "role": msg_type,
                "content": msg.content,
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
