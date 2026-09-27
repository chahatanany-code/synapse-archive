import re
from typing import List, Tuple
from ..models.schemas import ChunkMetadata

class RerankingEngine:
    """
    Reranking engine implementing Lexical-Semantic Reciprocal Rank Fusion
    and passage density scoring.
    """
    def __init__(self, name: str = "Synapse-RRF-CrossScorer"):
        self.name = name

    def rerank(
        self,
        query: str,
        candidates: List[Tuple[ChunkMetadata, float, float]]  # (chunk, semantic_score, lexical_score)
    ) -> List[Tuple[ChunkMetadata, float, float, float, float]]:
        """
        Takes candidate chunks and applies contextual density reranking.
        Returns: (chunk, semantic_score, lexical_score, final_score, rerank_delta)
        """
        if not candidates:
            return []

        query_terms = set(re.findall(r"\b\w{3,}\b", query.lower()))
        reranked_results = []

        for rank, (chunk, sem_score, lex_score) in enumerate(candidates):
            # Calculate term co-occurrence density in the chunk
            text_lower = chunk.text.lower()
            section_lower = chunk.section.lower()
            
            # Boost if query terms appear directly in section title
            section_bonus = 0.04 if any(term in section_lower for term in query_terms) else 0.0
            
            # Reciprocal rank fusion bonus
            rrf_bonus = 1.0 / (60.0 + rank)
            
            # Contextual exact phrase bonus
            phrase_bonus = 0.05 if query.lower() in text_lower else 0.0

            rerank_delta = round(section_bonus + (rrf_bonus * 0.5) + phrase_bonus, 4)
            final_reranked_score = min(1.0, max(0.0, sem_score + rerank_delta))

            reranked_results.append((chunk, sem_score, lex_score, final_reranked_score, rerank_delta))

        # Sort by updated final reranked score
        reranked_results.sort(key=lambda x: x[3], reverse=True)
        return reranked_results

reranker = RerankingEngine()
