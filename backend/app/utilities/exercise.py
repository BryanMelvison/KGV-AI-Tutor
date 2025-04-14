from langchain_community.document_loaders.directory import DirectoryLoader
from langchain_text_splitters.character import RecursiveCharacterTextSplitter
from tqdm.auto import tqdm
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
from pathlib import Path
from .prompt import QUESTION_GEN_PROMPT, QUESTION_CHECK_PROMPT, EXERCISE_EVAL_PROMPT
import random
import pandas as pd
import json

class ExerciseService:
    def __init__(self):
        self.llm = OllamaLLM(
            model="llama3.2",
            base_url="http://localhost:11434"
        )

        self.dataset = []
        self.question = ""
        self.answer = ""

    def setup_llm_chain(self, prompt_template):
        prompt = ChatPromptTemplate.from_template(prompt_template)
        return prompt | self.llm

    def create_question(self):
        try:
            current_dir = Path(__file__).parent
            book_dir = current_dir / "book"

            loader = DirectoryLoader(str(book_dir), glob="chapter_[1].txt")
            docs = loader.load()
            print("INI DOCS: ", docs)

            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=2000,
                chunk_overlap=400,
                add_start_index=True,
                separators=["\n\n", "\n", ".", " ", ""],
            )
            docs_processed = []
            for doc in docs:
                docs_processed.extend(text_splitter.split_documents([doc]))
            print("INI CHUNKSNYA: \n", docs_processed)
            print("INI JUMLAH CHUNKSNYA: \n", len(docs_processed))
            
            chain = self.setup_llm_chain(QUESTION_GEN_PROMPT)

            for doc in tqdm(random.sample(docs_processed, 1)): # ini cuma ngambil 1 random qna pairs, nanti diganti jadi gausa random
                output_QA = chain.invoke({"context": doc.page_content})
                try:
                    question = output_QA.split("Question: ")[-1].split("Answer: ")[0]
                    answer = output_QA.split("Answer: ")[-1]
                    # assert len(answer) < 500, "Answer is too long"
                    self.dataset.append(
                        {
                            "context": doc.page_content,
                            "question": question,
                            "answer": answer,
                            "source_doc": doc.metadata["source"],
                        }
                    )
                except Exception as e:print(e)

            print("INI TABLE AWAL:\n\n", pd.DataFrame(self.dataset))
        except Exception as e:
            print(f"Error: {str(e)}")

    def check_question(self):
        try:
            chain = self.setup_llm_chain(QUESTION_CHECK_PROMPT)
            for output in tqdm(self.dataset):
                try:
                    evaluation = chain.invoke({
                        "context": output["context"],
                        "question": output["question"],
                        "answer": output["answer"],}
                    )
                    score, eval = (
                        int(evaluation.split("Total rating: ")[-1].strip()),
                        evaluation.split("Total rating: ")[-2].split("Evaluation: ")[1],
                    )
                    output.update(
                        {
                            "score": score,
                            "eval": eval
                        }
                    )
                except Exception as e:
                    print(e)
            self.dataset = [d for d in self.dataset if d["score"] >= 2] # nanti diganti jadi tergantung mau brapa kkmnya
            print("INI TABLE SETELAH DI CHECK:\n\n", pd.DataFrame(self.dataset))

        except Exception as e:
            print(f"Error: {str(e)}")

    def process_message(self, user_input: str) -> dict:     
        chain = self.setup_llm_chain(EXERCISE_EVAL_PROMPT)
        evaluation = chain.invoke({
            "question": self.question,
            "correct_answer": self.answer,
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

    def initialize_exercise(self):
        self.create_question()
        # self.check_question() // nanti jgn lupa di uncomment
        print("check ini dataset: \n", self.dataset)
        self.question = self.dataset[0]["question"]
        self.answer = self.dataset[0]["answer"]
        print("\n ini questionnya: \n", self.question)
        print("\n ini answernya: \n", self.answer)

        return {"question": self.question, "answer": self.answer}