from abc import ABC, abstractmethod
import numpy as np
from typing import List

class EmbeddingProvider(ABC):
    """
    Abstract Base Class for modular embedding providers.
    Ensures that embedding dimension is dynamically discovered from the model
    rather than hardcoded.
    """

    @property
    @abstractmethod
    def dimension(self) -> int:
        """Returns the dynamic vector dimension of the loaded embedding model."""
        pass

    @property
    @abstractmethod
    def model_name(self) -> str:
        """Returns the model identifier string."""
        pass

    @property
    @abstractmethod
    def device(self) -> str:
        """Returns the device executing the embeddings (CPU, CUDA, MPS)."""
        pass

    @property
    @abstractmethod
    def is_normalized(self) -> bool:
        """Whether output vectors are L2-normalized."""
        pass

    @abstractmethod
    def encode_documents(self, texts: List[str]) -> np.ndarray:
        """
        Encodes a list of document chunk texts into a 2D numpy array of shape (N, dimension).
        """
        pass

    @abstractmethod
    def encode_query(self, query: str) -> np.ndarray:
        """
        Encodes a single search query into a 1D numpy array of shape (dimension,).
        """
        pass
