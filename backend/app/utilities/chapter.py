from sqlalchemy.orm import Session
from app.models import LearningObjective, Chapters, Subjects, Users, studentSubjects
from typing import List
from fastapi import HTTPException

class ChapterService:
    def __init__(self, db: Session):
        self.db = db
        
    def _verify_student(self, user_id: str):
        user = self.db.query(Users).filter(Users.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user.role.roleName != "student":
            raise HTTPException(status_code=403, detail="Only students can access this resource")
        
        return user

    def get_learning_objective(self, user_id: str, chapter: int, subject: str) -> List[str]:
        """Get learning objectives for a chapter, ensuring the student is enrolled in the subject"""
        try:
            # Verify user is a student
            self._verify_student(user_id)
            
            # Get subject ID
            subject_id = self.get_subject_number(user_id, subject)
            if not subject_id:
                raise HTTPException(status_code=404, detail=f"Subject '{subject}' not found")
            
            # Check if student is enrolled in this subject
            enrollment = (
                self.db.query(studentSubjects)
                .filter(
                    studentSubjects.studentId == user_id,
                    studentSubjects.subjectId == subject_id
                )
                .first()
            )
            
            if not enrollment:
                raise HTTPException(status_code=403, detail="You are not enrolled in this subject")
            
            # Get learning objectives
            learning_objectives = (
                self.db.query(LearningObjective.learning_objective_text)
                .join(Chapters, LearningObjective.chapter == Chapters.chapterNumber)
                .filter(
                    Chapters.chapterNumber == chapter,
                    Chapters.subjectId == subject_id
                )
                .all()
            )
            
            return [lo[0] for lo in learning_objectives]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_chapter_number(self, user_id: str, chapter_name: str) -> int:
        """Get chapter number by name, ensuring the student is enrolled in the subject"""
        try: 
            # Verify user is a student
            self._verify_student(user_id)
            
            # Get chapter with subject verification
            chapter_data = (
                self.db.query(Chapters.chapterNumber, Chapters.subjectId)
                .filter(Chapters.chapterName == chapter_name)
                .first()
            )
            
            if not chapter_data:
                raise HTTPException(status_code=404, detail=f"Chapter '{chapter_name}' not found")
            
            chapter_number, subject_id = chapter_data
            
            # Check if student is enrolled in this subject
            enrollment = (
                self.db.query(studentSubjects)
                .filter(
                    studentSubjects.studentId == user_id,
                    studentSubjects.subjectId == subject_id
                )
                .first()
            )
            
            if not enrollment:
                raise HTTPException(status_code=403, detail="You are not enrolled in the subject for this chapter")
            
            return chapter_number
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_all_chapter_name(self, user_id: str, subject_id: int) -> List[str]:
        """Get all chapter names for a subject, ensuring the student is enrolled"""
        try:
            # Verify user is a student
            self._verify_student(user_id)
            
            # Check if student is enrolled in this subject
            enrollment = (
                self.db.query(studentSubjects)
                .filter(
                    studentSubjects.studentId == user_id,
                    studentSubjects.subjectId == subject_id
                )
                .first()
            )
            
            if not enrollment:
                raise HTTPException(status_code=403, detail="You are not enrolled in this subject")
            
            # Get chapter names
            chapter_names = (
                self.db.query(Chapters.chapterName)
                .filter(Chapters.subjectId == subject_id)
                .all()
            )
            
            return [chapter[0] for chapter in chapter_names]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_subject_number(self, user_id: str, subject_name: str) -> int:
        """Get subject ID by name, ensuring the student is enrolled"""
        try:
            # Verify user is a student
            self._verify_student(user_id)
            
            # Get subject ID
            subject_query = (
                self.db.query(Subjects.id)
                .filter(Subjects.subjectName.ilike(subject_name))
            )
            
            subject_data = subject_query.first()
            
            if not subject_data:
                raise HTTPException(status_code=404, detail=f"Subject '{subject_name}' not found")
            
            subject_id = subject_data[0]
            
            # Check if student is enrolled in this subject
            enrollment = (
                self.db.query(studentSubjects)
                .filter(
                    studentSubjects.studentId == user_id,
                    studentSubjects.subjectId == subject_id
                )
                .first()
            )
            
            if not enrollment:
                raise HTTPException(status_code=403, detail="You are not enrolled in this subject")
            
            return subject_id
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))