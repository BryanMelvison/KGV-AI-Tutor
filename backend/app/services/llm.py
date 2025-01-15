from langchain_ollama.llms import OllamaLLM
from langchain.memory import ConversationBufferWindowMemory
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from typing import List, Dict
from ..config import config



class ChatService:
    def __init__(self):
        self.llm = OllamaLLM(
            model=config.OLLAMA_MODEL,
            base_url=config.OLLAMA_BASE_URL,
        )
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful assistant, answer very concisely."), # ini prompt yg harus diganti"
            MessagesPlaceholder(variable_name="history"),
            ("human", "{question}"),
        ])
        self.chain = self.prompt | self.llm
        self.store = {}

    def get_session_history(self, session_id: str) -> InMemoryChatMessageHistory:
        if session_id not in self.store:
            self.store[session_id] = InMemoryChatMessageHistory()
        memory = ConversationBufferWindowMemory(
            chat_memory=self.store[session_id],
            k=12, # ini jumlah maksimal pesan yg disimpan llm
            return_messages=True,
        )
        # Retrieve messages
        key = memory.memory_variables[0]
        messages = memory.load_memory_variables({})[key]
        self.store[session_id] = InMemoryChatMessageHistory(messages=messages)
        return self.store[session_id]

    def format_messages(self, messages) -> List[Dict]:
        formatted_messages = []
        for msg in messages:
            role = "human" if "HumanMessage" in str(type(msg)) else "ai"
            formatted_messages.append({
                "role": role,
                "content": msg.content
            })
        return formatted_messages

    def process_message(self, user_input: str, session_id: str) -> dict:
        try:
            self.chain_with_history = RunnableWithMessageHistory(
                runnable=self.chain,
                get_session_history=self.get_session_history,
                input_messages_key="question",
                history_messages_key="history",
            )
            response = self.chain_with_history.invoke(
                {"question": user_input},
                config={"configurable": {"session_id": session_id}}
            )
            chat_history = self.format_messages(self.store[session_id].messages)
            return {
                "response": response,
                "memory": chat_history
            }
        except Exception as e:
            raise Exception(f"Failed to process message: {str(e)}")

    def clear_memory(self, session_id: str) -> None:
        try:
            if session_id in self.store:
                del self.store[session_id]
            print(f"Cleared memory for session: {session_id}")
        except Exception as e:
            print(f"Error clearing memory: {str(e)}")
            raise Exception(f"Failed to clear memory for session {session_id}")