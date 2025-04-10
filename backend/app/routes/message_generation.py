from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.utilities.llm import ChatService

router = APIRouter()
chat_service = ChatService()

class MessageRequest(BaseModel):
    prompt: str
    session_id: str
    subject: Optional[str] = None
    chapter: Optional[str] = None

class EndSessionRequest(BaseModel):
    session_id: str

@router.post("/messages")
def process_message(request: MessageRequest):
    try:
        response = chat_service.process_message(
            user_input=request.prompt,
            session_id=request.session_id,
            subject=request.subject,
            chapter=request.chapter
        )
        print(response)
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
def clear_session(request: EndSessionRequest):
    try:
        chat_service.clear_memory(request.session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))