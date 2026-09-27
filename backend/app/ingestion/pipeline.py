import time
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional, Callable
from ..models.schemas import DocumentMetadata, ChunkMetadata
from .parsers import parse_pdf, parse_markdown, parse_txt
from .chunker import DocumentChunker
from ..embedding.service import embedding_service
from ..vector_store.numpy_store import vector_store
from ..data.seed_papers import SEED_DOCUMENTS

class IngestionEvent:
    def __init__(self, step: str, message: str, status: str = "INFO", details: Optional[Dict[str, Any]] = None):
        self.timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3]
        self.step = step
        self.message = message
        self.status = status
        self.details = details or {}

    def to_dict(self):
        return {
            "timestamp": self.timestamp,
            "step": self.step,
            "message": self.message,
            "status": self.status,
            "details": self.details
        }

class IngestionPipeline:
    """
    Academic Document Ingestion & Vector Indexing Pipeline.
    Manages parsing, section extraction, chunking, dense embedding encoding,
    and event telemetry streaming.
    """
    def __init__(self):
        self.documents: Dict[str, DocumentMetadata] = {}
        self.raw_pages: Dict[str, List[Dict[str, Any]]] = {}
        self.event_subscribers: List[Callable[[Dict[str, Any]], None]] = []
        self.event_log: List[Dict[str, Any]] = []

    def subscribe_events(self, callback: Callable[[Dict[str, Any]], None]):
        self.event_subscribers.append(callback)

    def _emit(self, step: str, message: str, status: str = "INFO", details: Optional[Dict[str, Any]] = None):
        event = IngestionEvent(step, message, status, details)
        payload = event.to_dict()
        self.event_log.append(payload)
        # Keep log size bounded
        if len(self.event_log) > 200:
            self.event_log.pop(0)
        for sub in self.event_subscribers:
            try:
                sub(payload)
            except Exception:
                pass

    def ingest_raw_document(
        self,
        doc_id: str,
        title: str,
        authors: List[str],
        source: str,
        pages_data: List[Dict[str, Any]],
        topic: str = "General Academic",
        chunk_size: int = 450,
        chunk_overlap: int = 80
    ) -> DocumentMetadata:
        t0 = time.perf_counter()
        self._emit("RECEIVE", f"Ingesting: '{title}' ({len(pages_data)} pages)", "START")

        chunker = DocumentChunker(chunk_size=chunk_size, chunk_overlap=chunk_overlap, strategy="sentence_aware")
        
        self._emit("CHUNKING", f"Segmenting text into semantic chunks with overlap={chunk_overlap}...", "PROGRESS")
        chunks = chunker.chunk_document(doc_id, title, pages_data)
        self._emit("CHUNKING_DONE", f"Generated {len(chunks)} contextual chunks across {len(pages_data)} pages", "SUCCESS")

        # Encode chunk texts
        self._emit("EMBEDDING", f"Generating {embedding_service.dimension}-D embeddings via {embedding_service.model_name}...", "PROGRESS")
        texts = [c.text for c in chunks]
        embeddings = embedding_service.encode_documents(texts)
        self._emit("EMBEDDING_DONE", f"Encoded {len(embeddings)} dense vectors ({embedding_service.dimension} dimensions)", "SUCCESS")

        # Add to vector store
        self._emit("INDEXING", f"Indexing vectors into normalized cosine matrix...", "PROGRESS")
        vector_store.add(chunks, embeddings)
        self._emit("INDEXING_DONE", f"Vector index updated. Total nodes: {vector_store.count()}", "SUCCESS")

        doc_meta = DocumentMetadata(
            document_id=doc_id,
            title=title,
            authors=authors,
            source=source,
            page_count=len(pages_data),
            uploaded_at=time.time(),
            chunk_count=len(chunks),
            embedding_model=embedding_service.model_name,
            embedding_dimension=embedding_service.dimension,
            file_type="PDF" if len(pages_data) > 1 else "TXT",
            topic=topic
        )

        self.documents[doc_id] = doc_meta
        self.raw_pages[doc_id] = pages_data
        
        elapsed = round((time.perf_counter() - t0) * 1000, 2)
        self._emit("COMPLETE", f"Document '{title}' fully indexed in {elapsed} ms", "SUCCESS", {"elapsed_ms": elapsed})
        return doc_meta

    def ingest_file_bytes(
        self,
        filename: str,
        file_bytes: bytes,
        chunk_size: int = 450,
        chunk_overlap: int = 80
    ) -> DocumentMetadata:
        doc_id = f"doc_{uuid.uuid4().hex[:10]}"
        self._emit("UPLOAD", f"Received file '{filename}' ({len(file_bytes)} bytes)", "INFO")

        ext = filename.split(".")[-1].lower()
        if ext == "pdf":
            parsed = parse_pdf(file_bytes, filename)
        elif ext in ["md", "markdown"]:
            text = file_bytes.decode("utf-8", errors="replace")
            parsed = parse_markdown(text, filename)
        else:
            text = file_bytes.decode("utf-8", errors="replace")
            parsed = parse_txt(text, filename)

        return self.ingest_raw_document(
            doc_id=doc_id,
            title=parsed["title"],
            authors=parsed["authors"],
            source=f"Uploaded: {filename}",
            pages_data=parsed["pages"],
            topic="User Ingestion",
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )

    def load_seed_corpus(self):
        if self.documents:
            return
        self._emit("SYSTEM_BOOT", "Initializing SYNAPSE ARCHIVE Academic Corpus...", "START")
        for item in SEED_DOCUMENTS:
            self.ingest_raw_document(
                doc_id=item["document_id"],
                title=item["title"],
                authors=item["authors"],
                source=item["source"],
                pages_data=item["pages"],
                topic=item.get("topic", "Computer Science")
            )
        self._emit("SYSTEM_READY", f"Seed corpus ready: {len(self.documents)} papers, {vector_store.count()} chunks indexed.", "SUCCESS")

pipeline = IngestionPipeline()
