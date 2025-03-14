from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from uuid import uuid4
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pathlib import Path

# Extract
class textbookRAG:
    def __init__(self, metadata=None, model="bge-m3", collection_name="school_collection"):
        self.embeddings = OllamaEmbeddings(model=model)

        # directory of langchain_db:
        db_dir = str(Path(__file__).parent.parent.parent / "chroma_langchain_db")
        print(db_dir)
        self.vector_store = Chroma(
            collection_name=collection_name,
            embedding_function=self.embeddings,
            persist_directory=db_dir,  # Where to save data locally, remove if not necessary
        )
        self.metadata = metadata or None
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,           # Adjust chunk size as needed
            chunk_overlap=100,         # Adjust overlap as needed
            length_function=len,
            separators=[
                "\n\n", "\n", " ", ".", ",", "\u200b", "\uff0c", "\u3001", "\uff0e", "\u3002", "",
            ],
        )

    def extract_from_metadata(self):
        textbook = self.metadata["textbook"]
        subject = textbook["subject"]
        totalChapters = textbook["totalChapters"]
        textbookChapters = textbook["chapters"]
        chapters = {idx + 1: chapter["title"] for idx, chapter in zip(range(totalChapters),textbookChapters)}
        # Since chapters are all stored under folder "../book/chapter_{idx}.txt"
        # We can extract the text from the files
        # and store them in the vector store
        documents = []
        # Book dir:
        book_dir = Path(__file__).parent.parent / "book"
        for idx in range(1, totalChapters + 1):
            with open(f"{book_dir}/chapter_{idx}.txt", "r") as f:
                text = f.read()
                doc = Document(page_content=text, metadata={"subject": subject, "chapterTitle": chapters[idx], "chapter": idx})
                chunked_text = self.text_splitter.split_documents([doc])
                documents.extend(chunked_text)

        uuids = [str(uuid4()) for _ in range(len(documents))]
        self.vector_store.add_documents(documents=documents, ids=uuids)

    def search(self, query, k=5, subject=None, chapter=None):
        # Condition Based on Subject and Chapter:
        if subject and chapter:
            filter = {"$and": [{"chapter": chapter}, {"subject": subject}]}
        elif subject:
            filter = {"subject": subject}
        else:
            filter = None
        return self.vector_store.similarity_search(query, k=k, filter=filter)
