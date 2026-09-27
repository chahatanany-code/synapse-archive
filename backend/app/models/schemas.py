from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

class DocumentMetadata(BaseModel):
    document_id: str
    title: str
    authors: List[str] = Field(default_factory=list)
    source: str = "SYNAPSE_INGESTION"
    page_count: int = 1
    uploaded_at: float
    chunk_count: int = 0
    embedding_model: str
    embedding_dimension: int
    file_type: str = "PDF"
    file_size_bytes: int = 0
    topic: Optional[str] = "Machine Learning"

class ChunkMetadata(BaseModel):
    chunk_id: str
    document_id: str
    document_title: str
    page: int = 1
    section: str = "Main"
    chunk_index: int = 0
    text: str
    token_count: int = 0
    char_start: int = 0
    char_end: int = 0

class SearchFilters(BaseModel):
    document_id: Optional[str] = None
    topic: Optional[str] = None
    author: Optional[str] = None
    section: Optional[str] = None
    min_similarity: Optional[float] = None

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5
    mode: Literal["semantic", "exact", "hybrid"] = "semantic"
    threshold: Optional[float] = None
    filters: Optional[SearchFilters] = None
    alpha: float = 0.75  # Semantic weight in hybrid mode
    beta: float = 0.25   # Keyword weight in hybrid mode
    rerank: bool = False

class ScoreBreakdown(BaseModel):
    semantic_score: float
    keyword_score: float
    final_score: float
    alpha_used: float
    beta_used: float
    rerank_applied: bool = False
    rerank_delta: float = 0.0

class SearchResultItem(BaseModel):
    document_id: str
    chunk_id: str
    score: float
    title: str
    authors: List[str]
    page: int
    section: str
    text: str
    score_breakdown: ScoreBreakdown
    vector_sample: List[float] = Field(default_factory=list)
    cluster_id: int = 0
    provenance: Dict[str, Any] = Field(default_factory=dict)

class SearchTelemetry(BaseModel):
    query_encoding_ms: float
    vector_search_ms: float
    reranking_ms: float
    total_ms: float
    candidates_scanned: int
    results_returned: int
    timestamp: float

class SearchResponse(BaseModel):
    query: str
    mode: str
    results: List[SearchResultItem]
    telemetry: SearchTelemetry
    related_concepts: List[str] = Field(default_factory=list)
    total_indexed_chunks: int = 0

class IndexStats(BaseModel):
    document_count: int
    chunk_count: int
    vector_nodes: int
    embedding_model: str
    embedding_dimension: int
    index_size_bytes: int
    index_type: str = "Normalized Dot Product (Cosine)"
    metric: str = "Cosine Similarity"
    status: str = "READY"
    memory_mb: float = 0.0
    is_live: bool = True

class SystemHealth(BaseModel):
    api: str = "ONLINE"
    vector_index: str = "READY"
    embedding_model: str = "LOADED"
    document_store: str = "READY"
    search_engine: str = "READY"
    uptime_seconds: float = 0.0
    version: str = "1.0.0"

class BenchmarkMetrics(BaseModel):
    query_count: int
    p50_ms: float
    p95_ms: float
    p99_ms: float
    avg_ms: float
    docs_per_sec: float
    chunks_per_sec: float
    source_type: str = "MEASURED"
    benchmark_timestamp: float

class EvaluationMetrics(BaseModel):
    configured: bool
    status_label: str = "EVALUATION DATASET NOT CONFIGURED"
    recall_at_5: Optional[float] = None
    recall_at_10: Optional[float] = None
    mrr: Optional[float] = None
    ndcg_at_10: Optional[float] = None
    dataset_name: Optional[str] = None
    source_type: str = "CALCULATED"

class VectorNodePoint(BaseModel):
    id: str
    chunk_id: str
    document_id: str
    title: str
    section: str
    page: int
    x: float
    y: float
    z: float
    cluster: int
    topic: str
    preview_text: str
    vector_dim: int
