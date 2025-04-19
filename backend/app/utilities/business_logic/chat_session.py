
from sqlalchemy.orm import Session
from app.models import LearningObjective, Chapters, Subjects, Users, studentSubjects, Role, ChatSessions, chatMessage
from typing import List
from fastapi import HTTPException
from uuid import uuid4
import datetime

class ChatSessionService:
    def __init__(self, db: Session):
        self.db = db
        
    def _verify_student(self, user_id: str):
        user = self.db.query(Users).filter(Users.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user.role.roleName != Role.STUDENT:
            raise HTTPException(status_code=403, detail="Only students can access this resource")
        
        return user

    def add_session_to_database(self, userId, subjectId, chapterId, sessionName):
        """Add a new chat session to the database"""
        try:
            # Verify user is a student
            self._verify_student(userId)
            
            
            # Generate ID:
            sessionId = uuid4()

            # Dummy time data:
            timestamp = datetime.datetime.now()
            # Create a new chat session
            new_session = ChatSessions(
                id=sessionId,
                userId=userId,
                chapterId=chapterId,
                subjectId=subjectId,
                startTimestamp=timestamp,
                endTimestamp=timestamp,
                chatSessionTitle=sessionName,
            )
            # Add the new session to the database
            self.db.add(new_session)
            self.db.commit()

            # Return the Session ID:
            return {
                "sessionId": str(sessionId),
                "message": "Chat session added successfully",
                "startTimestamp": timestamp,
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def retrieve_all_session_from_database_specific(self, userId, subjectId, chapterId):
        # Poor design practice, but for now, we fetch the session IDs first.
        # then we go to chatMessage table and then fetch the latest message for each session, and it is sorted based on the latest message, 
        # so the latest message is at the top, but if there is no message at all, then we use the startTimestamp from ChatSessions table as the timestamp.
        # This is not the best design, but it works for now.
        try:
            self._verify_student(userId)

            # Get all sessions for the user
            sessions = self.db.query(ChatSessions).filter(
                ChatSessions.userId == userId,
                ChatSessions.chapterId == chapterId,
                ChatSessions.subjectId == subjectId
            ).all()

            # Get the latest message for each session        
            latest_messages = {}
            for session in sessions:
                latest_message = self.db.query(chatMessage).filter(
                    chatMessage.sessionId == session.id
                ).order_by(chatMessage.timestamp.desc()).first()
                
                if latest_message:
                    latest_messages[session.id] = latest_message.timestamp
                else:
                    latest_messages[session.id] = session.startTimestamp
            # Sort sessions by latest message timestamp
            sorted_sessions = sorted(sessions, key=lambda x: latest_messages[x.id], reverse=True)
            # Create a list of session data
            session_data = []
            for session in sorted_sessions:
                timestamp = latest_messages[session.id]
                message = None
                if timestamp == session.startTimestamp:
                    # No message was found, set message to None
                    message = None
                else:
                    latest_message = self.db.query(chatMessage).filter(
                        chatMessage.sessionId == session.id,
                        chatMessage.timestamp == timestamp
                    ).first()
                    if latest_message:
                        message = latest_message.message

                session_data.append({
                    "sessionId": str(session.id),
                    "sessionName": session.chatSessionTitle,
                    "timestamp": timestamp,
                    "message": message
                })

            return session_data

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
    def retrieve_total_session_from_database(self, userId):
        try:
            self._verify_student(userId)
            # Get all sessions for the user
            sessions = self.db.query(ChatSessions).filter(
                ChatSessions.userId == userId
            ).all()
            # Return total number:
            total_sessions = len(sessions)
            return total_sessions  
        
        except Exception as e:
            raise HTTPException(status_code = 500, detail=str(e))
            
    def retrieve_all_session_from_database_user(self, userId):
        try:
            self._verify_student(userId)

            # Get all sessions for the user with subject and chapter names
            # Disini, add columns nya itu ibaratnya jadi ada session, subjectName, chapterName, semacem list. 
            sessions = (
                self.db.query(ChatSessions)
                .filter(ChatSessions.userId == userId)
                .join(Subjects, ChatSessions.subjectId == Subjects.id)
                .join(Chapters, ChatSessions.chapterId == Chapters.id)
                .add_columns(Subjects.subjectName.label("subjectName"), Chapters.chapterName.label("chapterName"))
                .all()
            )

            # Get the latest message for each session        
            latest_messages = {}
            for session, subject_name, chapter_name in sessions:
                latest_message = self.db.query(chatMessage).filter(
                    chatMessage.sessionId == session.id
                ).order_by(chatMessage.timestamp.desc()).first()

                if latest_message:
                    latest_messages[session.id] = latest_message.timestamp
                else:
                    latest_messages[session.id] = session.startTimestamp

            # Sort sessions by latest message timestamp
            sorted_sessions = sorted(sessions, key=lambda x: latest_messages[x[0].id], reverse=True)

            # Create a list of session data
            session_data = []
            for session, subject_name, chapter_name in sorted_sessions:
                timestamp = latest_messages[session.id]
                message = None
                if timestamp == session.startTimestamp:
                    # No message was found, set message to None
                    message = None
                else:
                    latest_message = self.db.query(chatMessage).filter(
                        chatMessage.sessionId == session.id,
                        chatMessage.timestamp == timestamp
                    ).first()
                    if latest_message:
                        message = latest_message.message

                session_data.append({
                    "sessionId": str(session.id),
                    "sessionName": session.chatSessionTitle,
                    "timestamp": timestamp,
                    "message": message,
                    "subjectName": subject_name,
                    "chapterName": chapter_name
                })

            return session_data

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))