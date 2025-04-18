# from sqlalchemy.orm import Session
# from app.models import LearningObjective, Chapters, Subjects, Users, studentSubjects, Role, ChatSessions
# from typing import List
# from fastapi import HTTPException


# class ChatSessionService:
#     def __init__(self, db: Session):
#         self.db = db
        
#     def _verify_student(self, user_id: str):
#         user = self.db.query(Users).filter(Users.id == user_id).first()
#         if not user:
#             raise HTTPException(status_code=404, detail="User not found")
        
#         if user.role.roleName != Role.STUDENT:
#             raise HTTPException(status_code=403, detail="Only students can access this resource")
        
#         return user

#     def add_session_to_database(self, userId, chapterId, subjectId, sessionName):
#         """Add a new chat session to the database"""
#         try:
#             # Verify user is a student
#             self._verify_student(userId)
            
#             # Generate ID:
