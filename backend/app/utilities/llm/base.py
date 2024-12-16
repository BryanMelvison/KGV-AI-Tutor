from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseLLM(ABC):
    @abstractmethod
    def generate_response(self, context: str, question: str) -> str:
        pass