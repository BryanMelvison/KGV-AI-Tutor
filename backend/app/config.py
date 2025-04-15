from pydantic_settings import BaseSettings, SettingsConfigDict
import os

# I use this as reference: https://stackoverflow.com/questions/76674272/pydantic-basesettings-cant-find-env-when-running-commands-from-different-places
DOTENV = os.path.join(os.path.dirname(__file__), ".env")


class Settings(BaseSettings):
    DB_URL: str
    LLAMA_CLOUD_API_KEY: str
    MODEL_URL: str
    MODEL_NAME: str
    ENCRYPTION_KEY: str
    ENCRYPT_ALGORITHM: str

    model_config = SettingsConfigDict(env_file=DOTENV)

