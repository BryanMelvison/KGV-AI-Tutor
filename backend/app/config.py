# ini semacam .env tpi buat dev ya begini dulu aja, ntar dihapus kalo udh production

class Config:
    CHROMA_DB_PATH: str = "./chroma_db"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.2"
    DATABASE_URL: str = "postgresql://localhost/kgv-ai-tutor"

config = Config()