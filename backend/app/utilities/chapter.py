from app.database import get_session
from app.models import LearningObjective, Chapters, Subjects
from typing import List


class ChapterService:
    @staticmethod
    def get_learning_objective(chapter: int, subject: str) -> List[str]:        
        session = get_session()
        try:
            learning_objectives = (
                session.query(LearningObjective.learning_objective_text)
                .filter(LearningObjective.chapter == chapter)
                .all()
            )            
            return [lo[0] for lo in learning_objectives]
            
        except Exception as e:
            print(f"Database error: {str(e)}")
            raise
        finally:
            session.close()

    @staticmethod
    def get_chapter_number(chapter_name: str) -> int:
        session = get_session()
        try:
            chapter_number = (
                session.query(Chapters.chapterNumber)
                .filter(Chapters.chapterName == chapter_name)
                .first()
            )
            return chapter_number[0] if chapter_number else None
        except Exception as e:
            print(f"Database error: {str(e)}")
            raise
        finally:
            session.close()

    @staticmethod
    def get_all_chapter_name(subject_id: int) -> List[str]:
        session = get_session()
        try:
            chapter_names = (
                session.query(Chapters.chapterName)
                .filter(Chapters.subjectId == subject_id)
                .all()
            )
            return [chapter[0] for chapter in chapter_names]
        except Exception as e:
            print(f"Database error: {str(e)}")
            raise
        finally:
            session.close()

    @staticmethod
    def get_subject_number(subject_name: str) -> int:
        session = get_session()
        try:
            subject_number = (
                session.query(Subjects.id)
                .filter(Subjects.subjectName.ilike(subject_name))
                .first()
            )
            return subject_number[0] if subject_number else None
        except Exception as e:
            print(f"Database error: {str(e)}")
            raise
        finally:
            session.close()