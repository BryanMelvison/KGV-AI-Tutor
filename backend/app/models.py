from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

# masih subject to change ya semua disini, masih blum dipake juga
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    chat_sessions = relationship("ChatSession", back_populates="student")

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    topic = Column(String, index=True)
    start_time = Column(DateTime, default=lambda: datetime.now(datetime.timezone.utc))
    end_time = Column(DateTime, nullable=True)
    summary = Column(Text, nullable=True)
    insights = Column(Text, nullable=True)  # Store flagged insights
    student = relationship("Student", back_populates="chat_sessions")