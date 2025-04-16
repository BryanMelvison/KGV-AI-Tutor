from sqlalchemy import text
from pydantic import BaseModel
from typing import List
from langchain_ollama.llms import OllamaLLM
from app.utilities.prompt import llm_prompt_generate_question, qna_critique_prompt
from app.database import get_session, engine, Base
from app.models import LearningObjective, Chapters, Exercise, QuestionAnswer as QuestionAnswerDB
from pathlib import Path
from ..test_metadata import metadata # Refactor nanti,
from app.utilities.rag import textbookRAG

class QnaPair(BaseModel):
    question: str
    answer: str
    source: str
    rating: int = 0
    eval: str = "Not evaluated"

class QnaPairs(BaseModel):
    qa_pairs: List[QnaPair]

class Eval(BaseModel): 
    rating: int
    eval: str

class QuestionAnswer(BaseModel):
    learning_objective_id: int
    question_text: str
    answer_text: str
    source_text: str
    rating_score: int
    evaluation_notes: str

    class Config:
        from_attributes = True

with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS question_answers CASCADE"))
    conn.commit()
QuestionAnswerDB.__table__.create(engine)

session = get_session()
learning_objectives = session.query(LearningObjective).all()
session.close()


def rag_search(query: str, subject: str, chapter: str) -> str:
    book_dir = Path("../book")
    rag = textbookRAG(metadata=metadata, book_dir=book_dir)
    resultrag = rag.search(query, subject = subject, chapterTitle = chapter)
    return resultrag

def generate_qna(objective_text: str, resultrag: str) -> QnaPairs:
    llm_prompt = llm_prompt_generate_question.format(learning_objective=objective_text, context=resultrag)
    model = OllamaLLM(model="llama3.2", format="json")
    response = model.invoke(llm_prompt, format=QnaPairs.model_json_schema())
    qna_pairs = QnaPairs.model_validate_json(response)
    return qna_pairs

def evaluate_qna(qna_pairs: QnaPairs) -> QnaPairs:
    evaluated_pairs = []
    for pair in qna_pairs.qa_pairs: 
        llm_prompt = qna_critique_prompt.format(question=pair.question, answer=pair.answer, context=pair.source)
        model = OllamaLLM(model="llama3.2", format="json")
        response = model.invoke(llm_prompt, format=Eval.model_json_schema())
        val = Eval.model_validate_json(response)
        pair.rating = val.rating
        pair.eval = val.eval
        if pair.rating >= 3:
            evaluated_pairs.append(pair)
    qna_pairs.qa_pairs = evaluated_pairs
    return qna_pairs

try:
    session = get_session()

    for objective in learning_objectives:
        learning_objective = objective.learning_objective_text
        chapter_title = session.query(Chapters).filter(Chapters.id == objective.chapter).first().chapterName
        resultrag = rag_search(learning_objective, subject = "biology", chapter=chapter_title)
        print(f"Processing Learning Objective: {learning_objective}")
        print(f"Retrieved RAG content: {resultrag[:200]}...")
        print(f"Retrieved RAG length: {len(resultrag)}")
        print("Chapter: ", objective.chapter)
        print("\n")
        generated_qna = generate_qna(learning_objective, resultrag)
        evaluated_qna = evaluate_qna(generated_qna)

        print("Generated Q&A Pairs:", evaluated_qna)

        exec_id = session.query(Exercise).filter(Exercise.learning_objective_id == objective.id).first().id
    
        # store in database
        for pair in evaluated_qna.qa_pairs:
            qna_entry = QuestionAnswerDB(
                learning_objective_id=objective.id,
                exercise_id=exec_id,
                question_text=pair.question,
                answer_text=pair.answer,
                source_text=pair.source,
                rating_score=pair.rating,
                evaluation_notes=pair.eval
            )
            session.add(qna_entry)
        break # only for testing, remove this line to process all learning objectives

    session.commit()
    print("Q&A pairs successfully inserted into the database!")


except Exception as e:
    print(f"Error: {e}")
    session.rollback()

finally:
    session.close()