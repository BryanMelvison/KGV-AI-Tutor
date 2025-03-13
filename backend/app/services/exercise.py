from langchain_community.document_loaders.directory import DirectoryLoader
from langchain_text_splitters.character import RecursiveCharacterTextSplitter
from tqdm.auto import tqdm
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
from pathlib import Path
import random
import pandas as pd
import json

# from ..config import config // ini kyk error gatau knapa

QUESTION_GEN_PROMPT = """
You are a question-answer pair generator.

Your task is to write a question and an answer based on the given context. The question must begin with one of the following IGCSE command words: 'analyse', 'assess', 'calculate', 'comment', 'compare', 'consider', 'contrast', 'define', 'describe', 'develop', 'discuss', 'evaluate', 'explain', 'give', 'identify', 'justify', 'outline', 'predict', 'state', 'suggest', 'summarise'.
Before formulating the question, carefully consider the context to determine the most appropriate IGCSE command word.

The question should be answerable using information from the context. This means that your question MUST NOT mention phrases like 'according to the passage' or "context".

The answer should be a detailed and comprehensive response that fully addresses the question, following the expectations of the chosen command word as defined below:
- analyse: Examine in detail to show meaning, identifying elements and their relationships.
- assess: Make an informed judgement.
- calculate: Work out from given facts, figures, or information.
- comment: Give an informed opinion.
- compare: Identify/comment on similarities and/or differences.
- consider: Review and respond to given information.
- contrast: Identify/comment on differences.
- define: Give a precise meaning.
- describe: State the points of a topic or give characteristics and main features.
- develop: Take forward to a more advanced stage or build upon given information.
- discuss: Write about issue(s) or topic(s) in depth in a structured way.
- evaluate: Judge or calculate the quality, importance, amount, or value of something.
- explain: Set out purposes or reasons, make relationships clear, and support with evidence.
- give: Produce an answer from recall or a given source.
- identify: Name/select/recognise.
- justify: Support a case with evidence/argument.
- outline: Set out the main points.
- predict: Suggest what may happen based on available information.
- state: Express in clear terms.
- suggest: Apply knowledge to propose valid responses or considerations.
- summarise: Select and present the main points without detail.

Provide your output as follows:

Output:::
Question: (your question)
Answer: (your answer to the question)

Now here is the context.

Context: {context}\n
Output:::"""

QUESTION_CHECK_PROMPT = """
You are a neutral judge.

You will be given a question, answer, and a context.
Your task is to provide a total rating using the additive point scoring system described below.
Points start at 0 and are accumulated based on the satisfaction of each evaluation criterion:

Evaluation Criteria:
- Groundedness: Can the question be answered from the given context? Add 1 point if the question can be answered from the context
- Stand-alone: Is the question understandable free of any context, for someone with domain knowledge/Internet access? Add 1 point if the question is independent and can stand alone.
- Faithfulness: The answer should be grounded in the given context. Add 1 point if the answer can be derived from the context
- Answer Relevance: The generated answer should address the actual question that was provided. Add 1 point if the answer actually answers the question

Provide your answer as follows:

Answer:::
Evaluation: (your rationale for the rating, as a text)
Total rating: (your rating, as a number between 0 and 4)

You MUST provide values for 'Evaluation:' and 'Total rating:' in your answer.

Now here are the question, answer, and context.

Question: {question}\n
Answer: {answer}\n
Context: {context}\n
Answer::: """

EVAL_PROMPT = """
You are an expert evaluator and tutor for IGCSE-level biology questions. Your task is to evaluate a user's answer to a biology question by comparing it to the correct answer and guide them using the Socratic method if their answer is not fully correct.

Follow these steps:

1. **Compare the user's answer to the correct answer**: Identify similarities and differences in content, accuracy, and detail.
2. **Assign a score out of 10**: Base the score on how accurate, complete, and relevant the user's answer is compared to the correct answer. A score of 10 means the user's answer is fully correct and detailed, while a score of 0 means the answer is completely incorrect or irrelevant.
3. **Provide a reason for the score**: Explain why you gave the score, highlighting what the user did well and what they missed or got wrong.
4. **If the score is less than 8, provide a Socratic-style hint or question**: This should guide the user towards the correct answer without directly giving it away. The hint should encourage the user to think deeper or consider specific aspects they might have missed.

Here is the question:
Question: {question}

Here is the correct answer:
Correct Answer: {correct_answer}

Here is the user's answer:
User's Answer: {user_answer}

Now, evaluate the user's answer and provide guidance to help the user achieve the correct answer.

Provide your output in JSON format:
{{
  "score": X,
  "reason": "your detailed reasoning for the score",
  "hint": "Socratic hint if score < 8"
}}
"""

class ExerciseService:
    def __init__(self):
        self.llm = OllamaLLM(
            model="llama3.2", # nanti diganti ke config.OLLAMA_MODEL
            base_url="http://localhost:11434", # nanti diganti ke config.OLLAMA_BASE_URL
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

            loader = DirectoryLoader(current_dir, glob="**/*.md")
            docs = loader.load()
            print("INI DOCS: ", docs)

            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=2000,
                chunk_overlap=200,
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
        chain = self.setup_llm_chain(EVAL_PROMPT)
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