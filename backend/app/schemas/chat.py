from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class ChatHistorySchema(BaseModel):
    message: str
    response: str
    timestamp: datetime

    class Config:
        from_attributes = True