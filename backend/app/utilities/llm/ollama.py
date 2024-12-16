from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
from app.core.config import settings
from .base import BaseLLM

class OllamaChatLLM(BaseLLM):
    def __init__(self):
        self.template = """Answer the question below.
        Here is the conversation history: {context}
        Question: {question}
        Answer:"""
        self.prompt = ChatPromptTemplate.from_template(self.template)
        self.model = OllamaLLM(model=settings.MODEL_NAME)
        self.chain = self.prompt | self.model

    def generate_response(self, context: str, question: str) -> str:
        return self.chain.invoke({
            "context": context,
            "question": question
        })
