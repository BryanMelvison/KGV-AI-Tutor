from sqlalchemy.orm import Session
from app.models.chat import ChatHistory
from app.utilities.llm.ollama import OllamaChatLLM
from typing import List, Optional

class ChatService:
    def __init__(self):
        self.llm = OllamaChatLLM()

    def get_conversation_history(
        self, 
        db: Session, 
        limit: int = 5
    ) -> str:
        history = self._fetch_history(db, limit)
        return self._format_history(history)

    def _fetch_history(
        self, 
        db: Session, 
        limit: int
    ) -> List[ChatHistory]:
        history = db.query(ChatHistory).order_by(
            ChatHistory.timestamp.desc()
        ).limit(limit).all()
        return history[::-1]  # Reverse to get chronological order

    def _format_history(
        self, 
        history: List[ChatHistory]
    ) -> str:
        return "\n".join([
            f"Human: {entry.message}\nAssistant: {entry.response}"
            for entry in history
        ])

    def create_chat_response(
        self, 
        db: Session, 
        message: str
    ) -> str:
        try:
            context = self.get_conversation_history(db)
            response = self.llm.generate_response(context, message)
            
            self._save_chat_entry(db, message, response)
            
            return response
        except Exception as e:
            db.rollback()
            raise Exception(f"Failed to create chat response: {str(e)}")

    def _save_chat_entry(
        self, 
        db: Session, 
        message: str, 
        response: str
    ) -> None:
        chat_history = ChatHistory(
            message=message,
            response=response
        )
        db.add(chat_history)
        db.commit()