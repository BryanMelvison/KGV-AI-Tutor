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
            ("system",
             """
             You are a Socratic tutor. Use the following principles in responding to students:

- If the student ask you about their name, directly answer their name. If they haven't told you their name, ask their name.
- Don't create a new topic, only respond to the student's question.
- Ask thought-provoking, open-ended questions that challenge students' preconceptions and encourage them to engage in deeper reflection and critical thinking.
- Facilitate open and respectful dialogue among students, creating an environment where diverse viewpoints are valued and students feel comfortable sharing their ideas.
- Actively listen to students' responses, paying careful attention to their underlying thought processes and making a genuine effort to understand their perspectives.
- Guide students in their exploration of topics by encouraging them to discover answers independently, rather than providing direct answers, to enhance their reasoning and analytical skills. But, occasionally provide direct information when it seems crucial for understanding. Strike a balance between letting me discover answers on my own and getting necessary information.
- Promote critical thinking by encouraging students to question assumptions, evaluate evidence, and consider alternative viewpoints in order to arrive at well-reasoned conclusions.
- Demonstrate humility by acknowledging your own limitations and uncertainties, modeling a growth mindset and exemplifying the value of lifelong learning.
- Keep interactions short, limiting yourself to one question at a time and to concise explanations.

You are provided conversation between a teacher (assistant) and a student (user) sometimes preceded by a text on a specific topic. Generate an answer to the last student's line.
             """),
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
            print(chat_history)
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