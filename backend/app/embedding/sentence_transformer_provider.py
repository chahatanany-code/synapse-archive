import numpy as np
from typing import List, Optional
from .base import EmbeddingProvider

class SentenceTransformerProvider(EmbeddingProvider):
    """
    Adapter for Hugging Face Sentence Transformers (e.g. all-MiniLM-L6-v2).
    Dynamically interrogates model dimension and device.
    """
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        try:
            from sentence_transformers import SentenceTransformer
            import torch
            self._device = "cuda" if torch.cuda.is_available() else "cpu"
            self._model = SentenceTransformer(model_name, device=self._device)
            self._model_name = model_name
            # Dynamically read the dimension from the model's output configuration
            self._dimension = self._model.get_sentence_embedding_dimension()
            self._available = True
        except Exception as e:
            self._available = False
            self._error = str(e)
            self._model = None
            self._dimension = 384
            self._model_name = model_name
            self._device = "Unavailable"

    @property
    def is_available(self) -> bool:
        return self._available

    @property
    def dimension(self) -> int:
        return self._dimension

    @property
    def model_name(self) -> str:
        return self._model_name

    @property
    def device(self) -> str:
        return self._device

    @property
    def is_normalized(self) -> bool:
        return True

    def encode_documents(self, texts: List[str]) -> np.ndarray:
        if not self._available:
            raise RuntimeError(f"SentenceTransformer not available: {getattr(self, '_error', 'Import error')}")
        embeddings = self._model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
        return np.array(embeddings, dtype=np.float32)

    def encode_query(self, query: str) -> np.ndarray:
        if not self._available:
            raise RuntimeError(f"SentenceTransformer not available: {getattr(self, '_error', 'Import error')}")
        embedding = self._model.encode([query], normalize_embeddings=True, show_progress_bar=False)
        return np.array(embedding[0], dtype=np.float32)
