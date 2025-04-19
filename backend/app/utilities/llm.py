from langchain_ollama.llms import OllamaLLM
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from typing import List, Dict, Any
from app.utilities.prompt import chatBotPrompt, verifierPrompt
from app.utilities.rag import textbookRAG
from langchain_core.output_parsers import StrOutputParser
from app.config import Settings
from sqlalchemy.orm import Session
from app.models import ChatSessions, chatMessage, senderType
import datetime
import uuid

# Global store for memory across instances
GLOBAL_MEMORY_STORE = {}

class ChatService:
    def __init__(self, db: Session = None):
        self.db = db
        self.llm = OllamaLLM(
            model=Settings().MODEL_NAME,
            base_url=Settings().MODEL_URL,
            temperature=0.7, 
        )
        self.chatPrompt = ChatPromptTemplate.from_messages([
            ("system", f"{chatBotPrompt}\n\nIMPORTANT: You MUST use the conversation history to maintain context and remember details the student has shared. If the student mentions their name or asks about previous topics, refer to the conversation history to provide accurate responses.\n\nRelevant textbook information: {{context}}"),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{question}"),
        ])
        
        self.chain = self.chatPrompt | self.llm
        self.rag = textbookRAG()
        self.verifierPrompt = verifierPrompt
        
        # Use the global store instead of instance-specific store
        global GLOBAL_MEMORY_STORE
        self.store = GLOBAL_MEMORY_STORE

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
            return False

    def search_textbook(self, query: str, subject: str, chapterTitle: str) -> dict:
        try:
            if self.check_if_need_rag(query, subject, chapterTitle):
                response = self.rag.search(query, subject=subject, chapterTitle=chapterTitle)
                return response
            return None
        except Exception as e:
            raise Exception(f"Failed to search textbook: {str(e)}")

    def save_message_to_db(self, session_id: str, message_content: str, is_user: bool) -> datetime.datetime:
        """Save a message to the database and return the timestamp"""
        if not self.db:
            return datetime.datetime.now()  # Return current time if no DB
            
        try:
            # Convert session_id string to UUID
            session_uuid = uuid.UUID(session_id)
            
            # Check if the session exists
            session = self.db.query(ChatSessions).filter(ChatSessions.id == session_uuid).first()
            if not session:
                raise Exception(f"Session {session_id} not found")
            
            # Check for duplicate message (same content, sender type, and session within last minute)
            current_time = datetime.datetime.now()
            
            # Create a new message with current timestamp
            message_timestamp = current_time
            new_message = chatMessage(
                id=uuid.uuid4(),
                sessionId=session_uuid,
                senderType=senderType.USER if is_user else senderType.CHATBOT,
                message=message_content,
                timestamp=message_timestamp
            )
            
            # Add and commit to database
            self.db.add(new_message)
            self.db.commit()
            
            return message_timestamp
            
        except Exception as e:
            self.db.rollback()
            raise Exception(f"Error saving message to database: {str(e)}")

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
                if msg.senderType == senderType.USER:
                    langchain_messages.append(HumanMessage(
                        content=msg.message, 
                        response_metadata={"timestamp": msg.timestamp}
                    ))
                else:
                    langchain_messages.append(AIMessage(
                        content=msg.message, 
                        response_metadata={"timestamp": msg.timestamp}
                    ))
                    
            return langchain_messages
        except Exception as e:
            return []

    def initialize_memory_from_db(self, session_id: str):
        """Initialize or refresh memory from database"""
        try:
            # Load messages from database
            db_messages = self.load_messages_from_db(session_id)
            
            # Create a new memory with these messages
            memory = InMemoryChatMessageHistory(messages=db_messages)
            
            # Update the store
            self.store[session_id] = memory
            
            return memory
        except Exception as e:
            # Return an empty memory if there's an error
            return InMemoryChatMessageHistory()

    def process_message(self, user_input: str, session_id: str, subject: str = None, chapter: str = None) -> dict:
        try:                        
            # Always initialize/refresh memory from database first
            self.initialize_memory_from_db(session_id)
            
            # Save user message to database and get timestamp
            user_timestamp = self.save_message_to_db(session_id, user_input, is_user=True)
            
            # If subject and chapter are provided, check if RAG is needed
            rag_result = None
            if subject and chapter:
                rag_result = self.search_textbook(user_input, subject, chapter)

            # Modify the chain input to include RAG results if available
            chain_input = {
                "question": user_input,
                "context": rag_result if rag_result else ""
            }
            
            # Create a runnable with history
            self.chain_with_history = RunnableWithMessageHistory(
                runnable=self.chain,
                get_session_history=self.get_session_history,
                input_messages_key="question",
                history_messages_key="history",
            )
            
            # Process the message with the LLM
            response = self.chain_with_history.invoke(
                chain_input,
                config={"configurable": {"session_id": session_id}}
            )
                        
            # Save AI response to database
            ai_timestamp = self.save_message_to_db(session_id, response, is_user=False)
            
            # After saving to database, refresh memory from database again
            self.initialize_memory_from_db(session_id)
            
            # Get updated chat history directly from the database
            messages = self.load_messages_from_db(session_id)
            chat_history = self.format_messages(messages)
            
            return {
                "response": response,
                "memory": chat_history,
                "used_rag": rag_result is not None
            }
        except Exception as e:
            raise Exception(f"Failed to process message: {str(e)}")

    def get_session_history(self, session_id: str) -> InMemoryChatMessageHistory:
        """Get or create a session history for the given session ID"""
        try:
            # If session not in store, initialize from database
            if session_id not in self.store:
                return self.initialize_memory_from_db(session_id)            
            return self.store[session_id]
        except Exception as e:
            # Return an empty history if there's an error
            return InMemoryChatMessageHistory()

    def format_messages(self, messages) -> List[Dict]:
        """Format messages for API response"""
        formatted_messages = []
        
        for msg in messages:
            role = "human" if isinstance(msg, HumanMessage) else "ai"
            timestamp = None
            if hasattr(msg, 'response_metadata') and msg.response_metadata:
                timestamp = msg.response_metadata.get("timestamp", None)
            
            formatted_messages.append({
                "role": role,
                "content": msg.content,
                "timestamp": timestamp
            })
                
        return formatted_messages
    
    def clear_memory(self, session_id: str):
        """Clear memory for a session by deleting messages from the database"""
        if not self.db:
            return 0
            
        try:
            # Convert session_id string to UUID
            session_uuid = uuid.UUID(session_id)
            
            # Delete all messages for this session from the database
            deleted_count = self.db.query(chatMessage).filter(
                chatMessage.sessionId == session_uuid
            ).delete()
            
            self.db.commit()
            
            # Also clear from memory store if it exists
            if session_id in self.store:
                del self.store[session_id]
                
            return deleted_count
        except Exception as e:
            self.db.rollback()
            raise Exception(f"Error clearing memory: {str(e)}")