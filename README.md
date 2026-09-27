# SYNAPSE ARCHIVE
### Semantic Vector Search & Academic Knowledge Retrieval Engine

> **"Search for concepts, not just words."**  
> *Human knowledge represented as an interconnected, continuous mathematical space.*

---

## 01 // OVERVIEW

**SYNAPSE ARCHIVE** is a production-grade information-retrieval system engineered to ingest complex academic documents—such as research papers, lecture notes, textbooks, and technical specifications—and transform their contents into a **searchable continuous vector space**.

Traditional keyword search fails when researchers ask conceptual questions (e.g., *"How do transformers preserve long-range contextual information?"*) if the author uses different terminology (e.g., *"self-attention reduces the path length between distant token positions"*). 

SYNAPSE ARCHIVE solves this fundamental lexical bottleneck by projecting queries and passages into a shared **384-dimensional continuous semantic manifold**, enabling retrieval based on conceptual proximity and dense vector geometry.

---

## 02 // MATHEMATICAL TRANSPARENCY

In SYNAPSE ARCHIVE, every vector is strictly unit-normalized ($L_2$ norm $\|v\|_2 = 1.0$) upon ingestion:

$$\|D\|_2 = \sqrt{\sum_{i=1}^{384} D_i^2} = 1.0, \quad \|Q\|_2 = \sqrt{\sum_{i=1}^{384} Q_i^2} = 1.0$$

Under this geometric constraint, the standard cosine similarity reduces directly to the **vector inner product**:

$$\text{cosine\_similarity}(Q, D) = \frac{Q \cdot D}{\|Q\|_2 \|D\|_2} = Q \cdot D = \sum_{i=1}^{384} Q_i D_i$$

### Hybrid Retrieval Formulation
The system supports a configurable hybrid search engine blending continuous dense embeddings with exact probabilistic BM25 lexical term overlap:

$$\text{Final Score} = \alpha \cdot S_{\text{semantic}} + \beta \cdot S_{\text{BM25}} + \Delta_{\text{rerank}}$$

where $\alpha$ and $\beta$ can be dynamically adjusted by researchers via the interface ($\alpha + \beta = 1.0$).

---

## 03 // ARCHITECTURAL PIPELINE

```text
                           SYNAPSE ARCHIVE
                          
   [ USER QUERY ]                                [ DOCUMENT / PDF ]
          │                                              │
          ▼                                              ▼
   QUERY EMBEDDING                                ACADEMIC PARSER
  (384-D Unit Norm)                             (Section Detection)
          │                                              │
          ▼                                              ▼
    VECTOR SEARCH                               CONTEXTUAL CHUNKER
(Normalized Dot Product)                         (Overlap & Provenance)
          │                                              │
          ▼                                              ▼
   HYBRID COMBINER                               EMBEDDING ENGINE
  (Semantic + BM25)                              (Batch Encoding)
          │                                              │
          ▼                                              ▼
   RRF RERANKER                                    VECTOR INDEX
(Passage Density Bonus)                          (In-Memory Matrix)
          │                                              │
          └───────────────────────┬──────────────────────┘
                                  ▼
                         [ 3D RESULT TRACE ]
                         [ RESEARCH VAULT  ]
```

---

## 04 // PROJECT INTEGRITY RULE

In accordance with **Project Integrity Rule 02**:
* No retrieval performance metrics are fabricated.
* All telemetry (P50, P95, P99 latency percentiles, throughput) is **MEASURED** using monotonic high-resolution clocks.
* Retrieval accuracy metrics (Recall@5, Recall@10, MRR, nDCG@10) display **AWAITING BENCHMARK** until evaluated against the active academic ground truth suite.
* When the FastAPI backend is connected, the UI shows `● LIVE INDEX`. When running locally in standalone mode, it displays `△ DEMO MODE`.

---

## 05 // DIRECTORY STRUCTURE

```text
synapse-archive/
├── backend/
│   ├── app/
│   │   ├── config.py                     # System settings & hyperparameters
│   │   ├── main.py                       # FastAPI application & WebSockets
│   │   ├── embedding/
│   │   │   ├── base.py                   # Modular EmbeddingProvider ABC
│   │   │   ├── configuration.py          # Device and model options
│   │   │   ├── semantic_projection_provider.py # 384-D calibrated LSA projector
│   │   │   ├── sentence_transformer_provider.py # Hugging Face adapter
│   │   │   └── service.py                # Embedding singleton & telemetry
│   │   ├── ingestion/
│   │   │   ├── parsers.py                # PDF, TXT, and Markdown parsers
│   │   │   ├── chunker.py                # Sentence/section-aware chunker
│   │   │   └── pipeline.py               # Ingestion pipeline & event bus
│   │   ├── vector_store/
│   │   │   ├── base.py                   # Modular VectorStore interface
│   │   │   └── numpy_store.py            # Vectorized normalized cosine store
│   │   ├── retrieval/
│   │   │   ├── engine.py                 # Core RetrievalEngine
│   │   │   ├── hybrid.py                 # BM25 Lexical Scorer
│   │   │   ├── reranker.py               # Reciprocal Rank Fusion reranker
│   │   │   └── query_expander.py         # Semantic neighborhood expander
│   │   ├── benchmark/
│   │   │   ├── latency.py                # Real P50/P95/P99 latency profiler
│   │   │   └── evaluation.py             # Ground-truth Recall/MRR/nDCG suite
│   │   ├── data/
│   │   │   └── seed_papers.py            # 6 seminal papers pre-indexed
│   │   └── models/
│   │       └── schemas.py                # Pydantic contracts & provenance
│   ├── requirements.txt
│   └── run_backend.py                    # Backend entrypoint (Port 8000)
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx                # Next.js root layout & SEO
│   │   │   ├── page.tsx                  # Main Synapse Archive experience
│   │   │   └── globals.css               # Design system & glassmorphism
│   │   ├── components/
│   │   │   ├── ThreeSemanticUniverse.tsx # Persistent 3D Three.js universe
│   │   │   ├── SearchStudio.tsx          # "ASK THE ARCHIVE" query console
│   │   │   ├── SearchResults.tsx         # Result explorer with 3D trace
│   │   │   ├── SemanticMapExplorer.tsx   # 2D/3D PCA cluster topology
│   │   │   ├── DocumentViewerModal.tsx   # Academic paper reader
│   │   │   ├── WhyThisResultModal.tsx    # Explainable retrieval breakdown
│   │   │   ├── ArchitectureVisualizer.tsx# Interactive pipeline diagram
│   │   │   ├── BenchmarkAndEvaluationSuite.tsx # Live benchmark trials
│   │   │   ├── IngestionConsoleModal.tsx # Terminal-style file monitor
│   │   │   ├── ResearchVault.tsx         # Bookmarks & history restore
│   │   │   ├── SystemDiagnosticsPanel.tsx# Health & memory telemetry
│   │   │   ├── FinalVisualMoment.tsx     # Converging particle epilogue
│   │   │   ├── DitherVeil.tsx            # React Bits WebGL dithering component
│   │   │   ├── DitherVeil.css            # DitherVeil styles
│   │   │   ├── SemanticVeilShowcase.tsx  # Interactive Dither Veil showcase
│   │   │   └── CustomCursor.tsx          # Contextual futuristic cursor
│   │   ├── lib/
│   │   │   ├── api.ts                    # Dual-mode API client (Live / Fallback)
│   │   │   └── constants.ts              # Pre-indexed seed vectors & papers
│   │   └── types/
│   │       └── index.ts                  # TypeScript contracts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## 06 // QUICKSTART & INSTALLATION

### Prerequisites
* Python 3.10+
* Node.js 18+ and npm

### 1. Launch Backend Server
```bash
cd backend
python run_backend.py
```
The FastAPI backend will initialize the seed academic corpus, verify vector normalization, and start listening on `http://127.0.0.1:8000`.

### 2. Launch Frontend Application
```bash
cd frontend
npm run dev
```
Open `http://localhost:3000` in your browser.

The frontend will automatically connect to the backend, flip its status pill to `● LIVE INDEX`, and render the real-time 3D semantic universe.

---

## 07 // CORE FEATURES

* **Interactive Dither Veil ("The Semantic Lens")**: Integrated open-source WebGL2 dithering veil from React Bits, allowing researchers to peel back dithered lexical noise (Floyd-Steinberg, Atkinson, Bayer, Blue Noise) to reveal the high-resolution continuous neural representation underneath, complete with acoustic click shockwaves and dynamic palettes.
* **Persistent 3D Semantic Universe**: Interactive Three.js WebGL visualization mapping documents, sections, and topics into 3D space with raycast picking, orbital controls, and search laser trajectory animations.
* **Futuristic Search Studio**: Natural language conceptual query input with real-time pipeline visualization (`QUERY ENCODED` &rarr; `VECTOR GENERATED` &rarr; `SEARCHING NODES` &rarr; `RANKING RESULTS`).
* **Hybrid Retrieval**: Configurable $\alpha$ and $\beta$ sliders to smoothly blend continuous semantic embeddings with BM25 lexical keyword matching.
* **Explainable Retrieval ("Why This Result?")**: Exact mathematical breakdown of cosine similarity, keyword frequency, and raw 384-D vector sample inspection.
* **Trace in 3D Space**: Smoothly pilots the camera through the continuous vector space to spotlight the retrieved chunk and its nearest semantic neighbors.
* **Integrated Document Viewer**: Academic paper reading interface with page navigation, highlighted relevant passages, and BibTeX citation export.
* **Empirical Benchmarking**: Measures authentic P50, P95, and P99 query latency percentiles and computes Recall@5, Recall@10, MRR, and nDCG@10 against labeled ground truth.
* **Terminal-Style Ingestion Console**: Drag-and-drop file upload (PDF, TXT, MD) with live streaming progress logs and adjustable chunking window parameters.
* **Dual-Mode Resiliency**: Gracefully operates in `● LIVE INDEX` when the backend is active, or `△ DEMO MODE` with authentic client-side vector search if offline.
