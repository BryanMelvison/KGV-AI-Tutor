from sqlalchemy import text
from app.database import get_session, engine
from app.models import LearningObjective, Chapters, Exercise
import random
import string

with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS exercises CASCADE"))
    conn.commit()
Exercise.__table__.create(engine)

try:
    session = get_session()

    learning_objectives = (
        session.query(LearningObjective)
        .order_by(LearningObjective.chapter.asc(), LearningObjective.id.asc())
        .all()
    )

    current_chapter = None
    exercise_letter_idx = 0
    letters = list(string.ascii_uppercase)  # ['A', 'B', 'C', ...]

    for lo in learning_objectives:
        chapter = (
            session.query(Chapters)
            .filter(Chapters.subjectId == 1, Chapters.id == lo.chapter)
            .first()
        )

        # Reset exercise letter to 'A' when chapter changes
        if current_chapter != chapter.id: 
            current_chapter = chapter.id
            exercise_letter_idx = 0

        exercise = Exercise(
            chapter_id=chapter.id,
            learning_objective_id=lo.id,
            subject_name="Biology",
            exercise_letter=letters[exercise_letter_idx],
            secret_letter=random.choice(string.ascii_uppercase),            
        )
        session.add(exercise)

        # Increment exercise letter index for the next exercise
        exercise_letter_idx = (exercise_letter_idx + 1) % len(letters)

    session.commit()
    print("Exercises populated successfully.")

except Exception as e:
    print(f"Error populating exercises: {str(e)}")
    session.rollback()

finally:
    session.close()