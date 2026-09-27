from abc import ABC, abstractmethod
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from ..models.schemas import ChunkMetadata, SearchFilters

class VectorStore(ABC):
    """
    Abstract Vector Index interface. Allows seamless substitution
    between NumPy normalized cosine store, FAISS, Chroma, or Qdrant.
    """

    @abstractmethod
    def add(self, chunks: List[ChunkMetadata], embeddings: np.ndarray) -> None:
        """Adds chunks and their corresponding dense embeddings to the index."""
        pass

    @abstractmethod
    def search(
        self,
        query_vector: np.ndarray,
        top_k: int = 5,
        threshold: Optional[float] = None,
        filters: Optional[SearchFilters] = None
    ) -> List[Tuple[ChunkMetadata, float, np.ndarray]]:
        """
        Executes vector similarity search.
        Returns list of (ChunkMetadata, similarity_score, vector).
        """
        pass

    @abstractmethod
    def count(self) -> int:
        """Returns total number of indexed vectors."""
        pass

    @abstractmethod
    def get_stats(self) -> Dict[str, Any]:
        """Returns index diagnostics, metric type, and memory footprint."""
        pass

    @abstractmethod
    def get_all_vectors_and_metadata(self) -> Tuple[np.ndarray, List[ChunkMetadata]]:
        """Returns all stored embeddings and chunk metadata for PCA/UMAP mapping."""
        pass
