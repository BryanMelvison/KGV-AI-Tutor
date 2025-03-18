from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utilities.llm import ChatService

router = APIRouter()
chat_service = ChatService()


class MessageRequest(BaseModel):
    prompt: str
    session_id: str

class EndSessionRequest(BaseModel):
    session_id: str

@router.post("/messages")
def process_message(request: MessageRequest):
    try:
        response = chat_service.process_message(request.prompt, request.session_id)
        return {"status": "success", "data": {"response": response}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/clear", status_code=204)
def clear_session(request: EndSessionRequest):
    try:
        chat_service.clear_memory(request.session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
