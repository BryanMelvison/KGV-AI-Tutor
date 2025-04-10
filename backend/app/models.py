from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, ARRAY, Table, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

# only for testing, nanti bm ganti aja
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    chat_sessions = relationship("ChatSession", back_populates="student")

# only for testing, nanti bm ganti aja
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

# ini for exercise, dont change!
class Syllabus(Base):
    __tablename__ = 'syllabus'

    id = Column(Integer, primary_key=True, autoincrement=True)
    topic_id = Column(Integer, nullable=False)
    topic_name = Column(String(255), nullable=False)
    subtopic_id = Column(String(1))
    subtopic_name = Column(String(255))
    subtopic_category = Column(String(100))
    statement_code = Column(String(10), nullable=False)
    statement_text = Column(Text, nullable=False)
    
class LearningObjective(Base):
    __tablename__ = 'learning_objectives'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    chapter = Column(Integer, nullable=False)
    learning_objective_text = Column(Text, nullable=False)
    syllabus_tags = Column(ARRAY(String), nullable=True)
    syllabus_ids = Column(ARRAY(Integer), nullable=False)

    # relationship
    question_answers = relationship("QuestionAnswer", back_populates="learning_objective")

class QuestionAnswer(Base):
    __tablename__ = 'question_answers'

    id = Column(Integer, primary_key=True, autoincrement=True)
    learning_objective_id = Column(Integer, ForeignKey('learning_objectives.id'), nullable=False)
    question_text = Column(String, nullable=False)
    answer_text = Column(String, nullable=False)
    source_text = Column(String, nullable=False)
    rating_score = Column(Integer, default=0)
    evaluation_notes = Column(String, default="Not evaluated")

    # relationship
    learning_objective = relationship("LearningObjective", back_populates="question_answers")
