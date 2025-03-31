from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from uuid import uuid4
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pathlib import Path

# Extract
class textbookRAG:
    def __init__(self, metadata=None, model="bge-m3", collection_name="school_collection", 
                book_dir=None, chunk_size=1300, chunk_overlap=200):
        # Set book_dir with a safer fallback
        if book_dir is None:
            self.book_dir = Path(__file__).parent.parent / "book"
        else:
            self.book_dir = Path(book_dir)
        
        # Ensure the book directory exists
        self.book_dir.mkdir(exist_ok=True, parents=True)
        
        try:
            self.embeddings = OllamaEmbeddings(model=model)
        except Exception as e:
            print(f"Error initializing embeddings model: {str(e)}")
            raise
        # Vector Store
        try:
            db_dir = Path(__file__).parent.parent.parent / "chroma_langchain_db"
            
            self.vector_store = Chroma(
                collection_name=collection_name,
                embedding_function=self.embeddings,
                persist_directory=str(db_dir),
            )
        except Exception as e:
            print(f"Error initializing vector store: {str(e)}")
            raise
        
        self.metadata = metadata
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=[
                "\n\n", "\n", " ", ".", ",", "\u200b", "\uff0c", "\u3001", "\uff0e", "\u3002", "",
            ],
        )


    def extract_from_metadata(self):
        try:
            textbook = self.metadata["textbook"]
            subject = textbook["subject"]
            totalChapters = textbook["totalChapters"]
            textbookChapters = textbook["chapters"]
            chapters = {idx + 1: chapter["title"] for idx, chapter in zip(range(totalChapters),textbookChapters)}
            
            documents = []
            
            for idx in range(1, totalChapters + 1):
                try:
                    file_path = self.book_dir / f"chapter_{idx}.txt"
                    
                    if not file_path.exists():
                        print(f"Warning: Chapter file {file_path} not found.")
                        continue
                        
                    with open(file_path, "r", encoding="utf-8") as f:
                        text = f.read()
                        
                    if not text.strip():
                        print(f"Warning: Chapter {idx} is empty.")
                        continue
                        
                    doc = Document(
                        page_content=text, 
                        metadata={
                            "subject": subject, 
                            "chapterTitle": chapters.get(idx, f"Chapter {idx}"),
                            "chapter": idx
                        }
                    )
                    chunked_text = self.text_splitter.split_documents([doc])
                    documents.extend(chunked_text)
                    
                except Exception as e:
                    print(f"Error processing chapter {idx}: {str(e)}")
            
            if not documents:
                print("Warning: No documents were created. Vector store not updated.")
                return False
                
            uuids = [str(uuid4()) for _ in range(len(documents))]
            self.vector_store.add_documents(documents=documents, ids=uuids)
            print(f"Successfully added {len(documents)} document chunks to vector store.")
            return True
            
        except KeyError as e:
            print(f"Error accessing metadata: {str(e)}")
            return False
        except Exception as e:
            print(f"Error in extract_from_metadata: {str(e)}")
            return False

    def search(self, query, k=5, subject=None, chapter=None) -> str:
        try:
            # Condition Based on Subject and Chapter:
            # No filter if only chapter provided (Chapter of Which book?? Need the subject!)
            if subject and chapter:
                filter_dict = {"$and": [{"chapter": chapter}, {"subject": subject}]}
            elif subject:
                filter_dict = {"subject": subject}
            else:
                filter_dict = None
            
            # Execute search
            results = self.vector_store.similarity_search(query, k=k, filter=filter_dict)   
            results_string = "\n".join([result.page_content for result in results])         
            return results_string
            
        except Exception as e:
            print(f"Error during search: {str(e)}")
            return []
        

    def get_all_subjects(self):
        try:
            # At the moment, our chroma instance exposes users to all kinds of data, from different textbooks. 
            metadata = self.vector_store.get()["metadatas"]
            subjects = set()
            for m in metadata:
                if "subject" in m:
                    subjects.add(m["subject"])
            return list(subjects)
        except Exception as e:
            print(f"Error getting subjects: {str(e)}")
            return []

    def get_chapters_for_subject(self, subject):
        try:
            metadata = self.vector_store.get()["metadatas"]
            chapters = {}
            for m in metadata:
                if m.get("subject") == subject and "chapter" in m and "chapterTitle" in m:
                    ch_num = m["chapter"]
                    if ch_num not in chapters:
                        chapters[ch_num] = m["chapterTitle"]
            return chapters
        except Exception as e:
            print(f"Error getting chapters: {str(e)}")
            return {}