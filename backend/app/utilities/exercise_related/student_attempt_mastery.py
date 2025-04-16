from sqlalchemy import text
from app.database import get_session, engine
from app.models import Exercise, StudentLearningObjectiveMastery, StudentExerciseAttempt, Users, QuestionAnswer
from datetime import datetime, timedelta
import random

with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS student_exercise_attempts CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS student_learning_objective_mastery CASCADE"))
    conn.commit()
StudentExerciseAttempt.__table__.create(engine)
StudentLearningObjectiveMastery.__table__.create(engine)

def update_mastery_status(session, student_id, exercise_id):
    exercise = session.query(Exercise).filter_by(id=exercise_id).first()

    learning_objective_id = exercise.learning_objective_id
    mastery = (
        session.query(StudentLearningObjectiveMastery)
        .filter_by(id=student_id, learning_objective_id=learning_objective_id)
        .first()
    )

    if not mastery:
        mastery = StudentLearningObjectiveMastery(
            id=student_id,
            learning_objective_id=learning_objective_id,
            is_mastered=True
        )
        session.add(mastery)
    else:
        mastery.is_mastered = True

def populate_student_attempts(session, student_ids):
    exercises = session.query(Exercise).all()
    base_date = datetime.now() - timedelta(days=30)
    
    for student_id in student_ids:
        for exercise in exercises:
            if random.random() < 0.5:  # 50% chance of attempting
                num_attempts = random.randint(1, 3)
                
                for attempt_num in range(num_attempts):
                    random_days = random.randint(0, 30)
                    attempt_date = base_date + timedelta(days=random_days)

                    total_question = session.query(QuestionAnswer).filter_by(exercise_id=exercise.id).count() if exercise.id == 77 else 5 # since the dummy data is only for exercise with id 77
                    correct_question = random.randint(0, total_question)

                    success = correct_question == total_question
                    
                    attempt = StudentExerciseAttempt(
                        student_id=student_id,
                        exercise_id=exercise.id,
                        attempt_date=attempt_date,
                        correct_question=correct_question,
                        is_successful=success,
                    )
                    session.add(attempt)
    
    session.commit()

try:
    session = get_session()
    student_ids = [user.id for user in session.query(Users).filter(Users.roleId == 3).all()]

    populate_student_attempts(session, student_ids)

    attempts = session.query(StudentExerciseAttempt).all()
    for attempt in attempts:
        if attempt.is_successful:
            update_mastery_status(session, attempt.student_id, attempt.exercise_id)

    session.commit()
    print("Student attempt and mastery populated successfully!")

except Exception as e:
    print(f"Error populating student attempt and mastery: {str(e)}")
    session.rollback()
finally:
    session.close()