from http.client import HTTPException
from langchain_community.document_loaders.directory import DirectoryLoader
from langchain_text_splitters.character import RecursiveCharacterTextSplitter
from tqdm.auto import tqdm
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
from pathlib import Path
from app.config import Settings
from .prompt import QUESTION_GEN_PROMPT, QUESTION_CHECK_PROMPT, EXERCISE_EVAL_PROMPT
from app.database import get_session
from app.models import Chapters, Exercise, StudentExerciseAttempt, QuestionAnswer, StudentLearningObjectiveMastery, Subjects, Users, studentSubjects
import random
import pandas as pd
import json

class ExerciseService:
    def setup_llm_chain(self, prompt_template):
        prompt = ChatPromptTemplate.from_template(prompt_template)
        return prompt | OllamaLLM(
            model=Settings().MODEL_NAME,
            base_url=Settings().MODEL_URL,
            format="json"
        )

    def process_message(self, question:str, answer: str, user_input: str) -> dict:     
        chain = self.setup_llm_chain(EXERCISE_EVAL_PROMPT)
        evaluation = chain.invoke({
            "question": question,
            "correct_answer": answer,
            "user_answer": user_input
        })
        try:
            eval_dict = json.loads(evaluation)
            score = eval_dict["score"]
            reason = eval_dict["reason"]
            hint = eval_dict.get("hint", None)
            
            if score >= 8:
                return {
                    "score": score,
                    "reason": reason,
                    "hint": "-",
                    "comment": "Great job! Your answer is detailed and accurate. Move on to the next question."
                }
            else:
                return {
                    "score": score,
                    "reason": reason,
                    "hint": hint,
                    "comment": "Your answer needs improvement. Here's a hint to guide you."
                }
        
        except json.JSONDecodeError as e:
            print(f"Error parsing evaluation: {e}")
    
    @staticmethod
    def get_exercises(studentId, subject, chapter):
        try:
            session = get_session()
            
            exercises = (
                session.query(Exercise)
                .filter(Exercise.chapter_id == chapter)
                .order_by(Exercise.exercise_letter)
                .all()
            )

            completed_exercise_ids = set(
                exercise_id[0] for exercise_id in 
                session.query(StudentExerciseAttempt.exercise_id)
                .filter(
                    StudentExerciseAttempt.student_id == studentId,
                    StudentExerciseAttempt.is_successful == True
                )
                .distinct()
                .all()
            )
            
            # Format response
            exercise_list = [{
                'id': exercise.exercise_letter,
                'completed': exercise.id in completed_exercise_ids,
                'secretLetter': exercise.secret_letter
            } for exercise in exercises]

            return exercise_list
        except Exception as e:
            raise e
        finally:
            session.close()

    @staticmethod
    def get_exercise_questions(subject, chapter, exerciseLetter):
        try:
            session = get_session()
            exercise = (
                session.query(Exercise)
                .filter(Exercise.chapter_id == chapter, Exercise.exercise_letter == exerciseLetter)
                .first()
            )

            # use exercise_id 1's questions as dummy data for all exercises
            qna = (
                session.query(QuestionAnswer)
                .filter(QuestionAnswer.exercise_id == 1)  # later change 1 to exercise.id
                .all()
            )

            response = [
                {
                    "number": str(i + 1),
                    "title": qna[i].question_text,
                    "answer": qna[i].answer_text,
                    "id": qna[i].id,

                } for i in range(len(qna))
            ]

            return response
        except Exception as e:
            raise e
        finally:
            session.close()

    @staticmethod
    def save_exercise_attempt(subject, chapter, letter, completedQuestions, totalQuestions, user_id):
        session = get_session()
        try:
            exercise = session.query(Exercise).filter(
                Exercise.subject_name == subject,
                Exercise.exercise_letter == letter
            ).first()
            exec_id = exercise.id
            lo_id = exercise.learning_objective_id
            
            attempt = StudentExerciseAttempt(
                student_id=user_id,
                exercise_id=exec_id,
                correct_question=completedQuestions,
                attempt_date=pd.Timestamp.now(),
                is_successful=(completedQuestions == totalQuestions)
            )
            session.add(attempt)

            if completedQuestions == totalQuestions:
                mastery = StudentLearningObjectiveMastery(
                    id=user_id,
                    learning_objective_id=lo_id,
                    is_mastered=True
                )
                session.add(mastery)
                
            session.commit()
            return "success"
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

    @staticmethod
    def get_mcq_options(qna_id):
        session = get_session()
        try:
            qna = session.query(QuestionAnswer).filter(QuestionAnswer.id == qna_id).first()            
            return qna.mcq_answer
        except Exception as e:
            raise e
        finally:
            session.close()

    @staticmethod
    def get_random_quiz_questions(subject: str, user_id: int, total: int = 5):
        session = get_session()
        try:
            subject_obj = (
                session.query(Subjects)
                .filter(Subjects.subjectName.ilike(subject))
                .first()
            )

            if not subject_obj:
                raise HTTPException(status_code=404, detail=f"Subject '{subject}' not found")

            subject_id = subject_obj.id

            is_enrolled = (
                session.query(studentSubjects)
                .filter(
                    studentSubjects.studentId == user_id,
                    studentSubjects.subjectId == subject_id
                )
                .first()
            )

            if not is_enrolled:
                raise HTTPException(status_code=403, detail="Student is not enrolled in this subject")

            chapter_ids = (
                session.query(Chapters.id)
                .filter(Chapters.subjectId == subject_id)
                .all()
            )
            chapter_ids = [cid[0] for cid in chapter_ids]
            print("Chapter IDs:", chapter_ids)

            all_questions = []

            for chapter_id in chapter_ids:
                exercises = (
                    session.query(Exercise)
                    .filter(Exercise.chapter_id == chapter_id)
                    .all()
                )

                for exercise in exercises:
                    letter = exercise.exercise_letter

                    questions = (
                        session.query(QuestionAnswer)
                        .filter(QuestionAnswer.exercise_id == exercise.id)
                        .all()
                    )

                    for q in questions:
                        options_data = q.mcq_answer
                        print(f"Question ID: {q.id}, Options: {options_data}")

                        formatted = {
                            "id": q.id,
                            "title": q.question_text,
                            "description": "",
                            "options": [
                                {"letter": chr(65 + i), "title": opt}
                                for i, opt in enumerate(options_data["options"])
                            ]
                        }

                        all_questions.append(formatted)

            random.shuffle(all_questions)
            print("Returning", min(total, len(all_questions)), "questions")
            return all_questions[:total]

        except Exception as e:
            print("ERROR in get_random_quiz_questions:", str(e))
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            session.close()

    @staticmethod
    def get_latest_exercise_attempt(user_id):
        session = get_session()
        try:
            latest_attempt = (
                session.query(StudentExerciseAttempt)
                .filter(
                    StudentExerciseAttempt.student_id == user_id,
                    StudentExerciseAttempt.is_successful == False
                )
                .order_by(StudentExerciseAttempt.attempt_date.desc())
                .first()
            )
            exercise = (
                session.query(Exercise)
                .filter(Exercise.id == latest_attempt.exercise_id)
                .first()
            )
            chapter_name = (
                session.query(Chapters)
                .filter(Chapters.id == exercise.chapter_id)
                .first().chapterName
            )

            return {
                "subject": exercise.subject_name,
                "chapter": chapter_name,
                "letter": exercise.exercise_letter
            }
        except Exception as e:
            raise e
        finally:
            session.close()