from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, ARRAY, Table, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
from typing import List
from typing import Optional
from sqlalchemy import ForeignKey, Integer, DateTime, String, Uuid, create_engine, types, Enum, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker
import uuid
from enum import Enum as PyEnum  

# # only for testing, nanti bm ganti aja
# class Student(Base):
#     __tablename__ = "students"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, index=True)
#     chat_sessions = relationship("ChatSession", back_populates="student")

# # only for testing, nanti bm ganti aja
# class ChatSession(Base):
#     __tablename__ = "chat_sessions"

#     id = Column(Integer, primary_key=True, index=True)
#     student_id = Column(Integer, ForeignKey("students.id"))
#     topic = Column(String, index=True)
#     start_time = Column(DateTime, default=lambda: datetime.now(datetime.timezone.utc))
#     end_time = Column(DateTime, nullable=True)
#     summary = Column(Text, nullable=True)
#     insights = Column(Text, nullable=True)  # Store flagged insights
#     student = relationship("Student", back_populates="chat_sessions")

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


# Define enums using Python's Enum
class senderType(PyEnum):
    USER = "user"
    CHATBOT = "chatbot"

class Role(PyEnum):
    ADMIN = "admin"
    STUDENT = "student"
    TEACHER = "teacher"

class Base(DeclarativeBase):
    pass
class Roles(Base):
    __tablename__ = 'roles'

    id: Mapped[int] = mapped_column(primary_key=True)
    roleName: Mapped["Role"] = mapped_column(Enum(Role), nullable=False)

    # This is a one-to-many relationship between roles and users
    user_roles: Mapped[List["Users"]] = relationship(back_populates="role")

class Users(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    displayName: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(50), nullable=False)
    password: Mapped[str] = mapped_column(String(60), nullable=False)
    roleId: Mapped[int] = mapped_column(ForeignKey("roles.id"), nullable=False)

    # This is a many-to-one relationship between users and roles
    role: Mapped["Roles"] = relationship(back_populates="user_roles")

    # This is a one-to-many relationship between users and teacherSubjects
    teacher_subjects: Mapped[List["teacherSubjects"]] = relationship(back_populates="teacher")

    # This is a one-to-many relationship between users and studentSubjects
    student_subjects: Mapped[List["studentSubjects"]] = relationship(back_populates="student")

    # This is a one-to-many relationship between users and chatSessions
    chat_sessions: Mapped[List["ChatSessions"]] = relationship(back_populates="user")

class teacherSubjects(Base):
    __tablename__ = 'teacherSubjects'

    # No primary key, but a composite key of teacherId and subjectId
    # This is a one-to-many relationship between users and teacherSubjects, and many-to-one relaitonshpip between subjects and teacherSubjects
    teacherId: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    subjectId: Mapped[int] = mapped_column(ForeignKey("subjects.id"), primary_key=True)
    assignedDate: Mapped[DateTime] = mapped_column(DateTime, nullable=False)

    # This is a many-to-one relationship between teacherSubjects and users
    teacher: Mapped["Users"] = relationship(back_populates="teacher_subjects")

    # This is a many-to-one relationship between teacherSubjects and subjects
    subject: Mapped["Subjects"] = relationship(back_populates="subjects")


class Subjects(Base):
    __tablename__ = 'subjects'
    id: Mapped[int] = mapped_column(primary_key=True)
    subjectName: Mapped[str] = mapped_column(String(50), nullable=False)
    totalChapters: Mapped[int] = mapped_column(Integer, nullable=False)
    
    # This is a one-to-many relationship between subjects and teacherSubjects
    subjects: Mapped[List["teacherSubjects"]] = relationship(back_populates="subject")

    # This is a one-to-many relationship between subjects and studentSubjects
    student_subjects: Mapped[List["studentSubjects"]] = relationship(back_populates="subject")

    # This is a one-to-many relationship between subjects and chapters
    chapters: Mapped[List["Chapters"]] = relationship(back_populates="subject")

    # This is a one-to-many relationship between subjects and chatSessions
    chat_sessions: Mapped[List["ChatSessions"]] = relationship(back_populates="subject")

class studentSubjects(Base):
    __tablename__ = 'studentSubjects'
    # No primary key, but a composite key of studentId and subjectId
    studentId: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    subjectId: Mapped[int] = mapped_column(ForeignKey("subjects.id"), primary_key=True)
    assignedDate: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    studentSubjectGrade: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # This is a many-to-one relationship between studentSubjects and users
    subject: Mapped["Subjects"] = relationship(back_populates="student_subjects")

    # This is a many-to-one relationship between studentSubjects and users
    student: Mapped["Users"] = relationship(back_populates="student_subjects")


class Chapters(Base):
    __tablename__ = 'chapters'
    id: Mapped[int] = mapped_column(primary_key=True)
    subjectId: Mapped[int] = mapped_column(ForeignKey("subjects.id"), nullable=False)
    chapterNumber: Mapped[int] = mapped_column(Integer, nullable=False)
    chapterName: Mapped[str] = mapped_column(String(50), nullable=False)

    # This is a many-to-one relationship between chapters and subjects
    subject: Mapped["Subjects"] = relationship(back_populates="chapters")

    # This is a one-to-many relationship between chapters and chatSessions
    chat_sessions: Mapped[List["ChatSessions"]] = relationship(back_populates="chapter")

class ChatSessions(Base):
    __tablename__ = 'chatSessions'
    id: Mapped[uuid.UUID] = mapped_column(Uuid(), primary_key=True, default=uuid.uuid4)
    userId: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    chapterId: Mapped[int] = mapped_column(ForeignKey("chapters.id"), nullable=False)
    subjectId: Mapped[int] = mapped_column(ForeignKey("subjects.id"), nullable=False)
    startTimestamp: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    endTimestamp: Mapped[DateTime] = mapped_column(DateTime, nullable=False)

    # This is a many-to-one relationship between chatSessions and users
    user: Mapped["Users"] = relationship(back_populates="chat_sessions")
    # This is a many-to-one relationship between chatSessions and chapters
    chapter: Mapped["Chapters"] = relationship(back_populates="chat_sessions")
    # This is a many-to-one relationship between chatSessions and subjects
    subject: Mapped["Subjects"] = relationship(back_populates="chat_sessions") 
    # This is a one-to-many relationship between chatSessions and chatMessages
    messages: Mapped[List["chatMessage"]] = relationship(back_populates="chatSession")


class chatMessage(Base):
    __tablename__ = 'chatMessages'
    id: Mapped[uuid.UUID] = mapped_column(Uuid(), primary_key=True, default=uuid.uuid4)
    sessionId: Mapped[uuid.UUID] = mapped_column(ForeignKey("chatSessions.id"), nullable=False)
    # Since we know each session is associated with a user, we can use the userId from the session, so for senderType we use Enum 
    # to determine if the sender is a teacher or student
    senderType: Mapped["senderType"] = mapped_column(Enum(senderType), nullable=False)

    message: Mapped[str] = mapped_column(String(500), nullable=False)
    timestamp: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    # This is a many-to-one relationship between chatMessages and chatSessions
    chatSession: Mapped["ChatSessions"] = relationship(back_populates="messages")