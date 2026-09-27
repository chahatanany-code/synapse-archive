import time
import numpy as np
from typing import List, Optional
from ..models.schemas import (
    SearchRequest,
    SearchResponse,
    SearchResultItem,
    ScoreBreakdown,
    SearchTelemetry
)
from ..embedding.service import embedding_service
from ..vector_store.numpy_store import vector_store
from .hybrid import LexicalScorer
from .reranker import reranker
from .query_expander import query_expander

class RetrievalEngine:
    """
    End-to-End Academic Information Retrieval Engine.
    Executes semantic query encoding, dense vector retrieval, lexical BM25 matching,
    optional contextual reranking, provenance tracking, and millisecond telemetry.
    """
    def __init__(self):
        self.lexical_scorer = LexicalScorer()
        self._fitted_chunk_count = 0

    def _ensure_lexical_fitted(self):
        chunks = vector_store.chunks
        if len(chunks) != self._fitted_chunk_count:
            self.lexical_scorer.fit(chunks)
            self._fitted_chunk_count = len(chunks)

    def search(self, request: SearchRequest) -> SearchResponse:
        t_start = time.perf_counter()
        
        # 1. Query Encoding
        t_enc_start = time.perf_counter()
        query_vector = embedding_service.encode_query(request.query)
        t_enc_end = time.perf_counter()
        query_encoding_ms = round((t_enc_end - t_enc_start) * 1000, 2)

        # 2. Vector Similarity Search
        t_vec_start = time.perf_counter()
        # Retrieve more candidates if hybrid or rerank requested
        scan_k = max(request.top_k * 3, 20) if (request.mode == "hybrid" or request.rerank) else request.top_k
        raw_candidates = vector_store.search(
            query_vector=query_vector,
            top_k=scan_k,
            threshold=request.threshold,
            filters=request.filters
        )
        t_vec_end = time.perf_counter()
        vector_search_ms = round((t_vec_end - t_vec_start) * 1000, 2)

        self._ensure_lexical_fitted()

        # 3. Mode scoring (Semantic, Exact/Lexical, or Hybrid)
        scored_candidates = []
        for chunk, sem_score, vec in raw_candidates:
            lex_score = self.lexical_scorer.score(request.query, chunk.chunk_index)
            
            if request.mode == "exact":
                final_score = lex_score
            elif request.mode == "hybrid":
                final_score = (request.alpha * sem_score) + (request.beta * lex_score)
            else:  # semantic
                final_score = sem_score
                
            scored_candidates.append((chunk, sem_score, lex_score, final_score, vec))

        # 4. Optional Reranking
        t_rerank_start = time.perf_counter()
        reranking_ms = 0.0
        final_results_tuples = []

        if request.rerank and scored_candidates:
            rerank_inputs = [(c[0], c[1], c[2]) for c in scored_candidates]
            reranked_tuples = reranker.rerank(request.query, rerank_inputs)
            
            # Reattach vector and package
            chunk_to_vec = {c[0].chunk_id: c[4] for c in scored_candidates}
            for chunk, sem_sc, lex_sc, fin_sc, delta in reranked_tuples:
                final_results_tuples.append((
                    chunk, sem_sc, lex_sc, fin_sc, delta, True, chunk_to_vec[chunk.chunk_id]
                ))
            reranking_ms = round((time.perf_counter() - t_rerank_start) * 1000, 2)
        else:
            # Sort by final score
            scored_candidates.sort(key=lambda x: x[3], reverse=True)
            for c in scored_candidates:
                final_results_tuples.append((
                    c[0], c[1], c[2], c[3], 0.0, False, c[4]
                ))

        # Trim to top_k
        top_results = final_results_tuples[:request.top_k]

        # 5. Format Search Result Items with Provenance
        items: List[SearchResultItem] = []
        retrieved_chunk_metas = []

        for chunk, sem_score, lex_score, fin_score, delta, rerank_applied, vec in top_results:
            retrieved_chunk_metas.append(chunk)
            # Sample first 8 float dimensions for the raw vector inspector
            vec_sample = [float(round(v, 4)) for v in vec[:8].tolist()] if len(vec) > 0 else []

            breakdown = ScoreBreakdown(
                semantic_score=round(float(sem_score), 4),
                keyword_score=round(float(lex_score), 4),
                final_score=round(float(fin_score), 4),
                alpha_used=request.alpha if request.mode == "hybrid" else (1.0 if request.mode == "semantic" else 0.0),
                beta_used=request.beta if request.mode == "hybrid" else (1.0 if request.mode == "exact" else 0.0),
                rerank_applied=rerank_applied,
                rerank_delta=round(float(delta), 4)
            )

            provenance_dict = {
                "document_id": chunk.document_id,
                "document_title": chunk.document_title,
                "page_number": chunk.page,
                "section_heading": chunk.section,
                "chunk_index": chunk.chunk_index,
                "char_span": [chunk.char_start, chunk.char_end],
                "token_count": chunk.token_count,
                "embedding_model": embedding_service.model_name,
                "vector_dimension": embedding_service.dimension
            }

            items.append(
                SearchResultItem(
                    document_id=chunk.document_id,
                    chunk_id=chunk.chunk_id,
                    score=round(float(fin_score), 4),
                    title=chunk.document_title,
                    authors=[],
                    page=chunk.page,
                    section=chunk.section,
                    text=chunk.text,
                    score_breakdown=breakdown,
                    vector_sample=vec_sample,
                    cluster_id=0,
                    provenance=provenance_dict
                )
            )

        # 6. Algorithmic Query Expansion
        related = query_expander.expand(request.query, retrieved_chunk_metas)

        total_ms = round((time.perf_counter() - t_start) * 1000, 2)

        telemetry = SearchTelemetry(
            query_encoding_ms=query_encoding_ms,
            vector_search_ms=vector_search_ms,
            reranking_ms=reranking_ms,
            total_ms=total_ms,
            candidates_scanned=vector_store.count(),
            results_returned=len(items),
            timestamp=time.time()
        )

        return SearchResponse(
            query=request.query,
            mode=request.mode,
            results=items,
            telemetry=telemetry,
            related_concepts=related,
            total_indexed_chunks=vector_store.count()
        )

retrieval_engine = RetrievalEngine()
