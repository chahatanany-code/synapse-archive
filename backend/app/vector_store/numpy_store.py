import time
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from sklearn.decomposition import PCA
from .base import VectorStore
from ..models.schemas import ChunkMetadata, SearchFilters, VectorNodePoint

class NumPyVectorStore(VectorStore):
    """
    High-performance in-memory vector store using vectorized normalized dot products.
    Since embeddings are L2-normalized upon ingestion, inner product is identical to cosine similarity:
        cos(theta) = (A . B) / (||A|| ||B||) = A . B
    """
    def __init__(self):
        self.chunks: List[ChunkMetadata] = []
        self.embeddings: Optional[np.ndarray] = None
        self._dim: int = 0
        self.index_type: str = "Inverted Matrix Vector Index (Cosine Dot Product)"
        self.metric: str = "Cosine Similarity"
        self._pca_cache: Optional[List[VectorNodePoint]] = None
        self._cache_dirty: bool = True

    def add(self, chunks: List[ChunkMetadata], embeddings: np.ndarray) -> None:
        if not chunks or len(embeddings) == 0:
            return

        assert len(chunks) == len(embeddings), "Chunks and embeddings count mismatch"
        embeddings = embeddings.astype(np.float32)

        if self.embeddings is None or len(self.embeddings) == 0:
            self.embeddings = embeddings
            self.chunks = list(chunks)
            self._dim = embeddings.shape[1]
        else:
            self.embeddings = np.vstack([self.embeddings, embeddings])
            self.chunks.extend(chunks)

        self._cache_dirty = True

    def count(self) -> int:
        return len(self.chunks) if self.embeddings is not None else 0

    def search(
        self,
        query_vector: np.ndarray,
        top_k: int = 5,
        threshold: Optional[float] = None,
        filters: Optional[SearchFilters] = None
    ) -> List[Tuple[ChunkMetadata, float, np.ndarray]]:
        if self.embeddings is None or len(self.embeddings) == 0:
            return []

        # Vectorized dot product
        raw_scores = np.dot(self.embeddings, query_vector.astype(np.float32))

        # Apply metadata filters if provided
        valid_indices = []
        for idx, chunk in enumerate(self.chunks):
            if filters:
                if filters.document_id and chunk.document_id != filters.document_id:
                    continue
                if filters.section and filters.section.lower() not in chunk.section.lower():
                    continue
                if filters.min_similarity and raw_scores[idx] < filters.min_similarity:
                    continue
            if threshold is not None and raw_scores[idx] < threshold:
                continue
            valid_indices.append(idx)

        if not valid_indices:
            # Fallback to unfiltered top-k if threshold was too aggressive
            valid_indices = list(range(len(self.chunks)))

        valid_indices = np.array(valid_indices)
        filtered_scores = raw_scores[valid_indices]

        # Top-K selection using partition for efficiency
        k = min(top_k, len(valid_indices))
        if k == 0:
            return []

        partition_idx = np.argpartition(-filtered_scores, k - 1)[:k]
        sorted_top_k_indices = partition_idx[np.argsort(-filtered_scores[partition_idx])]

        results = []
        for rank_idx in sorted_top_k_indices:
            orig_idx = valid_indices[rank_idx]
            chunk = self.chunks[orig_idx]
            score = float(filtered_scores[rank_idx])
            vector = self.embeddings[orig_idx]
            results.append((chunk, score, vector))

        return results

    def get_stats(self) -> Dict[str, Any]:
        count = self.count()
        dim = self._dim if self.embeddings is not None else 0
        size_bytes = self.embeddings.nbytes if self.embeddings is not None else 0
        memory_mb = round(size_bytes / (1024 * 1024), 3)

        return {
            "vector_nodes": count,
            "dimensions": dim,
            "index_size_bytes": size_bytes,
            "memory_mb": memory_mb,
            "index_type": self.index_type,
            "metric": self.metric,
            "status": "READY" if count > 0 else "EMPTY"
        }

    def get_all_vectors_and_metadata(self) -> Tuple[np.ndarray, List[ChunkMetadata]]:
        if self.embeddings is None or len(self.embeddings) == 0:
            return np.empty((0, self._dim)), []
        return self.embeddings, self.chunks

    def get_3d_projection(self) -> List[VectorNodePoint]:
        """
        Calculates PCA 3D projection coordinates for the Three.js Semantic Universe.
        Clusters are derived from document IDs and topics.
        """
        if self.embeddings is None or len(self.embeddings) == 0:
            return []

        if not self._cache_dirty and self._pca_cache is not None:
            return self._pca_cache

        n_samples = len(self.embeddings)
        if n_samples < 3:
            # Create synthetic 3D points
            coords = np.zeros((n_samples, 3))
            for i in range(n_samples):
                coords[i] = [i * 2.0, (i % 2) * 1.5, 0.0]
        else:
            pca = PCA(n_components=3, random_state=42)
            coords = pca.fit_transform(self.embeddings)
            # Scale coordinates into viewing volume (-25 to 25)
            scale = 28.0 / (np.max(np.abs(coords)) + 1e-6)
            coords = coords * scale

        # Group by document for consistent cluster assignment
        doc_cluster_map = {}
        curr_cluster = 0
        points: List[VectorNodePoint] = []

        for idx, (coord, chunk) in enumerate(zip(coords, self.chunks)):
            if chunk.document_id not in doc_cluster_map:
                doc_cluster_map[chunk.document_id] = curr_cluster
                curr_cluster += 1

            cluster_id = doc_cluster_map[chunk.document_id]
            points.append(
                VectorNodePoint(
                    id=chunk.chunk_id,
                    chunk_id=chunk.chunk_id,
                    document_id=chunk.document_id,
                    title=chunk.document_title,
                    section=chunk.section,
                    page=chunk.page,
                    x=float(round(coord[0], 3)),
                    y=float(round(coord[1], 3)),
                    z=float(round(coord[2], 3)),
                    cluster=cluster_id,
                    topic=chunk.document_title.split(":")[0],
                    preview_text=chunk.text[:120] + "...",
                    vector_dim=self._dim
                )
            )

        self._pca_cache = points
        self._cache_dirty = False
        return points

vector_store = NumPyVectorStore()
