# from langchain_ollama.llms import OllamaLLM
# from langchain.memory import ConversationBufferWindowMemory
# from langchain_core.chat_history import InMemoryChatMessageHistory
# from langchain_core.runnables.history import RunnableWithMessageHistory
# from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# from typing import List, Dict
# from app.utilities.prompt import chatBotPrompt, verifierPrompt
# from app.utilities.rag import textbookRAG
# from langchain_core.output_parsers import StrOutputParser
# from app.config import Settings


# class ChatService:
#     def __init__(self):
#         self.llm = OllamaLLM(
#             model=Settings().MODEL_NAME,
#             base_url=Settings().MODEL_URL,
#         )
#         self.chatPrompt = ChatPromptTemplate.from_messages([
#             ("system", chatBotPrompt + "\n\nRelevant textbook information: {context}"),
#             MessagesPlaceholder(variable_name="history"),
#             ("human", "{question}"),
#         ])
#         self.chain = self.chatPrompt | self.llm
#         self.store = {}
#         self.rag = textbookRAG()
        
#         # Add the verifier prompt
#         self.verifierPrompt = verifierPrompt

#     def check_if_need_rag(self, user_input: str, subject: str, chapter_title: str) -> bool:
#         try:
#             llm_prompt = self.verifierPrompt.format(
#                 subject=subject,
#                 chapterTitle=chapter_title,
#                 user_query=user_input
#             )
#             response = self.llm(llm_prompt, output_parser=StrOutputParser())
#             response = response.lower().strip()
            
#             return "yes" in response
            
#         except Exception as e:
#             print(f"Error in relevancy check: {str(e)}")
#             return False

#     def search_textbook(self, query: str, subject: str, chapterTitle: str) -> dict:
#         try:
#             if self.check_if_need_rag(query, subject, chapterTitle):
#                 response = self.rag.search(query, subject=subject, chapterTitle=chapterTitle)
#                 return response
#             return None
#         except Exception as e:
#             raise Exception(f"Failed to search textbook: {str(e)}")

#     def process_message(self, user_input: str, session_id: str, subject: str = None, chapter: str = None) -> dict:
#         try:
#             # If subject and chapter are provided, check if RAG is needed
#             rag_result = None
#             if subject and chapter:
#                 rag_result = self.search_textbook(user_input, subject, chapter)

#             # Modify the chain input to include RAG results if available
#             chain_input = {
#                 "question": user_input,
#                 "context": rag_result if rag_result else ""
#             }
#             self.chain_with_history = RunnableWithMessageHistory(
#                 runnable=self.chain,
#                 get_session_history=self.get_session_history,
#                 input_messages_key="question",
#                 history_messages_key="history",
#             )
            
#             response = self.chain_with_history.invoke(
#                 chain_input,
#                 config={"configurable": {"session_id": session_id}}
#             )
        
#             chat_history = self.format_messages(self.store[session_id].messages)

            
#             return {
#                 "response": response,
#                 "memory": chat_history,
#                 "used_rag": rag_result is not None
#             }
#         except Exception as e:
#             raise Exception(f"Failed to process message: {str(e)}")

#     def get_session_history(self, session_id: str) -> InMemoryChatMessageHistory:
#         if session_id not in self.store:
#             self.store[session_id] = InMemoryChatMessageHistory()
#         memory = ConversationBufferWindowMemory(
#             chat_memory=self.store[session_id],
#             k=12, # ini jumlah maksimal pesan yg disimpan llm
#             return_messages=True,
#         )
#         # Retrieve messages
#         key = memory.memory_variables[0]
#         messages = memory.load_memory_variables({})[key]
#         self.store[session_id] = InMemoryChatMessageHistory(messages=messages)
#         return self.store[session_id]

#     def format_messages(self, messages) -> List[Dict]:
#         formatted_messages = []
#         for msg in messages:
#             role = "human" if "HumanMessage" in str(type(msg)) else "ai"
#             formatted_messages.append({
#                 "role": role,
#                 "content": msg.content
#             })
#         return formatted_messages
    
#     def clear_memory(self, session_id: str):
#         if session_id in self.store:
#             del self.store[session_id]
#         else:
#             raise Exception(f"Session ID {session_id} not found.")
        


from langchain_ollama.llms import OllamaLLM
from langchain.memory import ConversationBufferWindowMemory
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from typing import List, Dict
from app.utilities.prompt import chatBotPrompt, verifierPrompt
from app.utilities.rag import textbookRAG
from langchain_core.output_parsers import StrOutputParser
from app.config import Settings
from sqlalchemy.orm import Session
from app.models import ChatSessions, chatMessage, senderType
import datetime
import uuid


class ChatService:
    def __init__(self, db: Session = None):
        self.db = db
        self.llm = OllamaLLM(
            model=Settings().MODEL_NAME,
            base_url=Settings().MODEL_URL,
        )
        self.chatPrompt = ChatPromptTemplate.from_messages([
            ("system", chatBotPrompt + "\n\nRelevant textbook information: {context}"),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{question}"),
        ])
        self.chain = self.chatPrompt | self.llm
        self.store = {}
        self.rag = textbookRAG()
        
        # Add the verifier prompt
        self.verifierPrompt = verifierPrompt

    def check_if_need_rag(self, user_input: str, subject: str, chapter_title: str) -> bool:
        try:
            llm_prompt = self.verifierPrompt.format(
                subject=subject,
                chapterTitle=chapter_title,
                user_query=user_input
            )
            response = self.llm(llm_prompt, output_parser=StrOutputParser())
            response = response.lower().strip()
            
            return "yes" in response
            
        except Exception as e:
            print(f"Error in relevancy check: {str(e)}")
            return False

    def search_textbook(self, query: str, subject: str, chapterTitle: str) -> dict:
        try:
            if self.check_if_need_rag(query, subject, chapterTitle):
                response = self.rag.search(query, subject=subject, chapterTitle=chapterTitle)
                return response
            return None
        except Exception as e:
            raise Exception(f"Failed to search textbook: {str(e)}")

    def save_message_to_db(self, session_id: str, message_content: str, is_user: bool):
        """Save a message to the database"""
        if not self.db:
            return  # Skip if no database session is provided
            
        try:
            # Convert session_id string to UUID
            session_uuid = uuid.UUID(session_id)
            
            # Create a new message
            new_message = chatMessage(
                id=uuid.uuid4(),
                sessionId=session_uuid,
                senderType=senderType.STUDENT if is_user else senderType.CHATBOT,
                message=message_content,
                timestamp=datetime.datetime.now()
            )
            
            # Add and commit to database
            self.db.add(new_message)
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            print(f"Error saving message to database: {str(e)}")

    def load_messages_from_db(self, session_id: str) -> List:
        """Load messages from the database for a given session"""
        if not self.db:
            return []
            
        try:
            # Convert session_id string to UUID
            session_uuid = uuid.UUID(session_id)
            
            # Query messages for this session, ordered by timestamp
            db_messages = self.db.query(chatMessage).filter(
                chatMessage.sessionId == session_uuid
            ).order_by(chatMessage.timestamp).all()
            
            # Convert to LangChain message format
            langchain_messages = []
            for msg in db_messages:
                if msg.senderType == senderType.STUDENT:
                    langchain_messages.append(HumanMessage(content=msg.message))
                else:
                    langchain_messages.append(AIMessage(content=msg.message))
                    
            return langchain_messages
        except Exception as e:
            print(f"Error loading messages from database: {str(e)}")
            return []

    def process_message(self, user_input: str, session_id: str, subject: str = None, chapter: str = None) -> dict:
        try:
            # Save user message to database
            self.save_message_to_db(session_id, user_input, is_user=True)
            
            # If subject and chapter are provided, check if RAG is needed
            rag_result = None
            if subject and chapter:
                rag_result = self.search_textbook(user_input, subject, chapter)

            # Modify the chain input to include RAG results if available
            chain_input = {
                "question": user_input,
                "context": rag_result if rag_result else ""
            }
            
            self.chain_with_history = RunnableWithMessageHistory(
                runnable=self.chain,
                get_session_history=self.get_session_history,
                input_messages_key="question",
                history_messages_key="history",
            )
            
            response = self.chain_with_history.invoke(
                chain_input,
                config={"configurable": {"session_id": session_id}}
            )
            
            # Save AI response to database
            self.save_message_to_db(session_id, response, is_user=False)
            
            # Get updated chat history
            chat_history = self.format_messages(self.store[session_id].messages)
            
            return {
                "response": response,
                "memory": chat_history,
                "used_rag": rag_result is not None
            }
        except Exception as e:
            raise Exception(f"Failed to process message: {str(e)}")

    def get_session_history(self, session_id: str) -> InMemoryChatMessageHistory:
        if session_id not in self.store:
            # Initialize with messages from database
            db_messages = self.load_messages_from_db(session_id)
            self.store[session_id] = InMemoryChatMessageHistory(messages=db_messages)
        
        memory = ConversationBufferWindowMemory(
            chat_memory=self.store[session_id],
            k=12,  # Maximum number of messages to keep in context
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
    
    def clear_memory(self, session_id: str):
        if session_id in self.store:
            del self.store[session_id]
        else:
            raise Exception(f"Session ID {session_id} not found.")