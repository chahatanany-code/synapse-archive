import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
UPLOADS_DIR = DATA_DIR / "uploads"
STORAGE_DIR = DATA_DIR / "storage"

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
STORAGE_DIR.mkdir(parents=True, exist_ok=True)

class Settings(BaseModel):
    app_name: str = "SYNAPSE ARCHIVE"
    app_version: str = "1.0.0"
    api_prefix: str = "/api"
    host: str = "127.0.0.1"
    port: int = 8000
    
    # Embedding Configuration
    embedding_provider: str = "auto"  # 'sentence_transformer' or 'semantic_projection'
    preferred_model_name: str = "all-MiniLM-L6-v2"
    fallback_dimension: int = 384
    batch_size: int = 32
    normalize_embeddings: bool = True
    
    # Chunking Configuration
    default_chunk_size: int = 450
    default_chunk_overlap: int = 80
    min_chunk_size: int = 60
    max_chunk_size: int = 1000
    
    # Search Configuration
    default_top_k: int = 5
    default_alpha: float = 0.75  # Semantic weight
    default_beta: float = 0.25   # Lexical weight
    similarity_threshold: float = 0.35
    reranking_enabled_by_default: bool = False

settings = Settings()
