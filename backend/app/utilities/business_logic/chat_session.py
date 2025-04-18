
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
                chatsessiontitle=sessionName,
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

    # def retrieve_all_session_from_database(self, userId, subjectId, chapterId):
    #     # Poor design practice, but for now, we fetch the session IDs first.
    #     # then we go to chatMessage table and then fetch the latest message for each session, and it is sorted based on the latest message, 
    #     # so the latest message is at the top, but if there is no message at all, then we use the startTimestamp from ChatSessions table as the timestamp.
    #     # This is not the best design, but it works for now.


