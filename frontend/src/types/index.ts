export interface DocumentMetadata {
  document_id: string;
  title: string;
  authors: string[];
  source: string;
  page_count: number;
  uploaded_at: number;
  chunk_count: number;
  embedding_model: string;
  embedding_dimension: number;
  file_type: string;
  file_size_bytes?: number;
  topic?: string;
}

export interface ChunkMetadata {
  chunk_id: string;
  document_id: string;
  document_title: string;
  page: number;
  section: string;
  chunk_index: number;
  text: string;
  token_count: number;
  char_start: number;
  char_end: number;
}

export interface SearchRequest {
  query: string;
  top_k?: number;
  mode: "semantic" | "exact" | "hybrid";
  threshold?: number;
  filters?: {
    document_id?: string;
    topic?: string;
    author?: string;
    section?: string;
    min_similarity?: number;
  };
  alpha?: number;
  beta?: number;
  rerank?: boolean;
}

export interface ScoreBreakdown {
  semantic_score: number;
  keyword_score: number;
  final_score: number;
  alpha_used: number;
  beta_used: number;
  rerank_applied: boolean;
  rerank_delta: number;
}

export interface SearchResultItem {
  document_id: string;
  chunk_id: string;
  score: number;
  title: string;
  authors: string[];
  page: number;
  section: string;
  text: string;
  score_breakdown: ScoreBreakdown;
  vector_sample?: number[];
  cluster_id?: number;
  provenance: {
    document_id: string;
    document_title: string;
    page_number: number;
    section_heading: string;
    chunk_index: number;
    char_span: [number, number];
    token_count: number;
    embedding_model: string;
    vector_dimension: number;
  };
}

export interface SearchTelemetry {
  query_encoding_ms: number;
  vector_search_ms: number;
  reranking_ms: number;
  total_ms: number;
  candidates_scanned: number;
  results_returned: number;
  timestamp: number;
}

export interface SearchResponse {
  query: string;
  mode: "semantic" | "exact" | "hybrid";
  results: SearchResultItem[];
  telemetry: SearchTelemetry;
  related_concepts: string[];
  total_indexed_chunks: number;
}

export interface IndexStats {
  document_count: number;
  chunk_count: number;
  vector_nodes: number;
  embedding_model: string;
  embedding_dimension: number;
  index_size_bytes: number;
  index_type: string;
  metric: string;
  status: string;
  memory_mb: number;
  is_live: boolean;
}

export interface SystemHealth {
  api: "ONLINE" | "OFFLINE";
  vector_index: "READY" | "EMPTY" | "OFFLINE";
  embedding_model: "LOADED" | "OFFLINE";
  document_store: "READY" | "OFFLINE";
  search_engine: "READY" | "OFFLINE";
  uptime_seconds: number;
  version: string;
}

export interface BenchmarkMetrics {
  query_count: number;
  p50_ms: number;
  p95_ms: number;
  p99_ms: number;
  avg_ms: number;
  docs_per_sec: number;
  chunks_per_sec: number;
  source_type: "MEASURED" | "SIMULATED";
  benchmark_timestamp: number;
}

export interface EvaluationMetrics {
  configured: boolean;
  status_label: string;
  recall_at_5?: number | null;
  recall_at_10?: number | null;
  mrr?: number | null;
  ndcg_at_10?: number | null;
  dataset_name?: string | null;
  source_type: "CALCULATED" | "AWAITING CALCULATION";
}

export interface VectorNodePoint {
  id: string;
  chunk_id: string;
  document_id: string;
  title: string;
  section: string;
  page: number;
  x: number;
  y: number;
  z: number;
  cluster: number;
  topic: string;
  preview_text: string;
  vector_dim: number;
}

export interface SavedResearchItem {
  id: string;
  chunk_id: string;
  document_id: string;
  title: string;
  page: number;
  section: string;
  text: string;
  saved_at: number;
  tags: string[];
}
