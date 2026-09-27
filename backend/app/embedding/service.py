import time
import numpy as np
from typing import List, Dict, Any
from .base import EmbeddingProvider
from .sentence_transformer_provider import SentenceTransformerProvider
from .semantic_projection_provider import SemanticProjectionProvider
from ..config import settings

class EmbeddingService:
    """
    Centralized Embedding Service.
    Selects the active provider, performs warm-up, interrogates vector dimensions dynamically,
    and measures latency telemetry.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if getattr(self, "_initialized", False):
            return
            
        self.provider: EmbeddingProvider = None
        self.warmup_latency_ms: float = 0.0
        self.status: str = "INITIALIZING"
        self._init_provider()
        self._initialized = True

    def _init_provider(self):
        start = time.perf_counter()
        
        # Check if sentence_transformer requested and available
        if settings.embedding_provider in ["auto", "sentence_transformer"]:
            st_provider = SentenceTransformerProvider(settings.preferred_model_name)
            if st_provider.is_available:
                self.provider = st_provider
                self.status = "ONLINE (Sentence Transformers)"
            else:
                self.provider = SemanticProjectionProvider(dimension=settings.fallback_dimension)
                self.status = "ONLINE (Calibrated Semantic LSA Projector)"
        else:
            self.provider = SemanticProjectionProvider(dimension=settings.fallback_dimension)
            self.status = "ONLINE (Calibrated Semantic LSA Projector)"

        # Warm-up call
        test_vec = self.provider.encode_query("Warmup query: semantic vector space and attention mechanism.")
        elapsed = (time.perf_counter() - start) * 1000
        self.warmup_latency_ms = round(elapsed, 2)
        assert len(test_vec) == self.provider.dimension, "Dimension mismatch in warm-up"

    @property
    def dimension(self) -> int:
        return self.provider.dimension

    @property
    def model_name(self) -> str:
        return self.provider.model_name

    @property
    def device(self) -> str:
        return self.provider.device

    @property
    def is_normalized(self) -> bool:
        return self.provider.is_normalized

    def encode_documents(self, texts: List[str]) -> np.ndarray:
        return self.provider.encode_documents(texts)

    def encode_query(self, query: str) -> np.ndarray:
        return self.provider.encode_query(query)

    def get_info(self) -> Dict[str, Any]:
        return {
            "model_name": self.model_name,
            "dimension": self.dimension,
            "device": self.device,
            "normalized": self.is_normalized,
            "batch_size": settings.batch_size,
            "warmup_latency_ms": self.warmup_latency_ms,
            "status": self.status
        }

embedding_service = EmbeddingService()
