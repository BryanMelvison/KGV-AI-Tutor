from llama_parse import LlamaParse
from llama_index.core import SimpleDirectoryReader

class PDFParser():
    def __init__(self, url):
        self.url = url
