# code masih in progress...

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
from ..database import get_db
from .. import models
from pydantic import BaseModel

router = APIRouter()

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

def get_conversation_history(db: Session, limit: int = 5) -> str:
    """Fetch recent conversation history and format it"""
    history = db.query(models.ChatHistory).order_by(
        models.ChatHistory.timestamp.desc()
    ).limit(limit).all()
    
    # Reverse to get chronological order
    history = history[::-1]
    
    formatted_history = ""
    for entry in history:
        formatted_history += f"Human: {entry.message}\n"
        formatted_history += f"Assistant: {entry.response}\n"
    
    return formatted_history

template = """Answer the question below.
Here is the conversation history: {context}
Question: {question}
Answer:"""

prompt = ChatPromptTemplate.from_template(template)
model = OllamaLLM(model="llama3.2")
chain = prompt | model

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    message: ChatMessage,
    db: Session = Depends(get_db)
):
    try:
        context = get_conversation_history(db)
        
        response = chain.invoke({
            "context": context,
            "question": message.message
        })
        
        chat_history = models.ChatHistory(
            message=message.message,
            response=response
        )
        db.add(chat_history)
        db.commit()
        
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chat/history", response_model=List[dict])
async def get_chat_history(db: Session = Depends(get_db)):
    try:
        history = db.query(models.ChatHistory).order_by(
            models.ChatHistory.timestamp.desc()
        ).limit(50).all()
        
        return [
            {
                "message": h.message,
                "response": h.response,
                "timestamp": h.timestamp
            } for h in history
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))