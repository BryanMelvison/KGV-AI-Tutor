from langchain_community.document_loaders.directory import DirectoryLoader
from langchain_text_splitters.character import RecursiveCharacterTextSplitter
from tqdm.auto import tqdm
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
from pathlib import Path
from .prompt import QUESTION_GEN_PROMPT, QUESTION_CHECK_PROMPT, EXERCISE_EVAL_PROMPT
from app.database import get_session
from app.models import Exercise, StudentExerciseAttempt, QuestionAnswer, StudentLearningObjectiveMastery
import random
import pandas as pd
import json

class ExerciseService:
    def setup_llm_chain(self, prompt_template):
        prompt = ChatPromptTemplate.from_template(prompt_template)
        return prompt | OllamaLLM(
            model="llama3.2",
            base_url="http://localhost:11434",
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
    def save_exercise_attempt(questionId, completedQuestions, totalQuestions, user_id):
        session = get_session()
        try:
            qna = session.query(QuestionAnswer).filter(QuestionAnswer.id == questionId).first()
            exec_id = qna.exercise_id
            lo_id = qna.learning_objective_id
            
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
        