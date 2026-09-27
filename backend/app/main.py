import time
import asyncio
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import settings
from .models.schemas import (
    DocumentMetadata,
    SearchRequest,
    SearchResponse,
    IndexStats,
    SystemHealth,
    BenchmarkMetrics,
    EvaluationMetrics,
    VectorNodePoint
)
from .embedding.service import embedding_service
from .vector_store.numpy_store import vector_store
from .ingestion.pipeline import pipeline
from .retrieval.engine import retrieval_engine
from .benchmark.latency import run_latency_benchmark
from .benchmark.evaluation import evaluation_suite

START_TIME = time.time()
SEARCH_HISTORY = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load seed academic corpus on startup
    pipeline.load_seed_corpus()
    yield

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="SYNAPSE ARCHIVE: Semantic Vector Search & Academic Knowledge Retrieval Engine",
    lifespan=lifespan
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- SYSTEM & TELEMETRY -----------------

@app.get("/api/system/health", response_model=SystemHealth)
def get_system_health():
    return SystemHealth(
        api="ONLINE",
        vector_index="READY" if vector_store.count() > 0 else "EMPTY",
        embedding_model="LOADED",
        document_store="READY",
        search_engine="READY",
        uptime_seconds=round(time.time() - START_TIME, 1),
        version=settings.app_version
    )

@app.get("/api/index/stats", response_model=IndexStats)
def get_index_stats():
    stats = vector_store.get_stats()
    return IndexStats(
        document_count=len(pipeline.documents),
        chunk_count=vector_store.count(),
        vector_nodes=vector_store.count(),
        embedding_model=embedding_service.model_name,
        embedding_dimension=embedding_service.dimension,
        index_size_bytes=stats["index_size_bytes"],
        index_type=stats["index_type"],
        metric=stats["metric"],
        status=stats["status"],
        memory_mb=stats["memory_mb"],
        is_live=True
    )

@app.get("/api/system/map", response_model=List[VectorNodePoint])
def get_semantic_map():
    """Returns 3D PCA projection points for the Three.js Semantic Universe."""
    return vector_store.get_3d_projection()

# ----------------- SEARCH & RETRIEVAL -----------------

@app.post("/api/search", response_model=SearchResponse)
def execute_search(request: SearchRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    response = retrieval_engine.search(request)
    
    # Record query history (deduplicated)
    q_clean = request.query.strip()
    if q_clean not in SEARCH_HISTORY:
        SEARCH_HISTORY.insert(0, q_clean)
        if len(SEARCH_HISTORY) > 30:
            SEARCH_HISTORY.pop()

    return response

@app.get("/api/search/history", response_model=List[str])
def get_search_history():
    return SEARCH_HISTORY

# ----------------- DOCUMENTS & INGESTION -----------------

@app.get("/api/documents", response_model=List[DocumentMetadata])
def list_documents():
    return list(pipeline.documents.values())

@app.get("/api/documents/{doc_id}")
def get_document(doc_id: str):
    if doc_id not in pipeline.documents:
        raise HTTPException(status_code=404, detail="Document not found")
    meta = pipeline.documents[doc_id]
    pages = pipeline.raw_pages.get(doc_id, [])
    return {
        "metadata": meta,
        "pages": pages
    }

@app.get("/api/documents/{doc_id}/chunks")
def get_document_chunks(doc_id: str):
    chunks = [c for c in vector_store.chunks if c.document_id == doc_id]
    return chunks

@app.post("/api/documents/upload", response_model=DocumentMetadata)
async def upload_document(
    file: UploadFile = File(...),
    chunk_size: int = Form(450),
    chunk_overlap: int = Form(80)
):
    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(content) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File exceeds 25MB limit.")

    meta = pipeline.ingest_file_bytes(
        filename=file.filename,
        file_bytes=content,
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    return meta

@app.get("/api/ingestion/logs")
def get_ingestion_logs():
    return pipeline.event_log

# ----------------- BENCHMARK & EVALUATION -----------------

@app.post("/api/benchmark/run", response_model=BenchmarkMetrics)
def run_benchmark():
    metrics = run_latency_benchmark(trials_per_query=3)
    return metrics

@app.get("/api/benchmark/evaluation", response_model=EvaluationMetrics)
def get_or_run_evaluation(trigger_run: bool = False):
    if trigger_run:
        return evaluation_suite.run_evaluation()
    return evaluation_suite.get_status()

# ----------------- WEBSOCKET INGESTION TELEMETRY -----------------

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()

# Hook pipeline events into WebSocket broadcast
def on_pipeline_event(event_dict):
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.create_task(manager.broadcast(event_dict))
    except Exception:
        pass

pipeline.subscribe_events(on_pipeline_event)

@app.websocket("/ws/ingestion")
async def websocket_ingestion_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep-alive ping/pong
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
