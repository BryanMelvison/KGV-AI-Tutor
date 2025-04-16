from app.database import get_session
from app.models import LearningObjective, StudentLearningObjectiveMastery

class StudentService:
    @staticmethod
    def get_mastery_status(student_id, subject, chapter):
        try:
            session = get_session()

            lo_id = session.query(LearningObjective.id).filter(
                LearningObjective.chapter == chapter
            ).order_by(LearningObjective.id.asc()).all()

            mastery_status = []
            for lo in lo_id:
                mastery = session.query(StudentLearningObjectiveMastery.is_mastered).filter(
                    StudentLearningObjectiveMastery.id == student_id,
                    StudentLearningObjectiveMastery.learning_objective_id == lo.id
                ).first()

                mastery_status.append(True if mastery else False)
        
            return mastery_status
        except Exception as e:
            raise e
        finally:
            session.close()