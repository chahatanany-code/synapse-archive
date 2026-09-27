import { DocumentMetadata, SearchResultItem, VectorNodePoint } from "@/types";

export const SAMPLE_QUERIES = [
  "How do transformers preserve long-range contextual information?",
  "Why do identity shortcut mappings ease training in deep residual networks?",
  "What is the masked language model pre-training objective in BERT?",
  "How does low-rank adaptation constrain weight updates during LLM fine-tuning?",
  "How does dense passage retrieval interact with seq2seq generation in RAG?",
  "What is the minimax two-player game formulation in Generative Adversarial Networks?"
];

export const DEMO_DOCUMENTS: DocumentMetadata[] = [
  {
    document_id: "doc_attention_is_all_you_need",
    title: "Attention Is All You Need",
    authors: ["A. Vaswani", "N. Shazeer", "N. Parmar", "J. Uszkoreit", "L. Jones", "A. Gomez", "L. Kaiser", "I. Polosukhin"],
    source: "NeurIPS 2017",
    page_count: 11,
    uploaded_at: 1711500000,
    chunk_count: 8,
    embedding_model: "synapse-lsa-384-academic",
    embedding_dimension: 384,
    file_type: "PDF",
    topic: "Transformers & Attention"
  },
  {
    document_id: "doc_bert_pretraining",
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: ["J. Devlin", "M. Chang", "K. Lee", "K. Toutanova"],
    source: "NAACL-HLT 2019",
    page_count: 16,
    uploaded_at: 1711501000,
    chunk_count: 7,
    embedding_model: "synapse-lsa-384-academic",
    embedding_dimension: 384,
    file_type: "PDF",
    topic: "Pre-trained Language Models"
  },
  {
    document_id: "doc_deep_residual_learning",
    title: "Deep Residual Learning for Image Recognition",
    authors: ["K. He", "X. Zhang", "S. Ren", "J. Sun"],
    source: "CVPR 2016",
    page_count: 12,
    uploaded_at: 1711502000,
    chunk_count: 6,
    embedding_model: "synapse-lsa-384-academic",
    embedding_dimension: 384,
    file_type: "PDF",
    topic: "Computer Vision & ResNet"
  },
  {
    document_id: "doc_lora_adaptation",
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    authors: ["E. Hu", "Y. Shen", "P. Wallis", "Z. Allen-Zhu", "Y. Li", "S. Wang", "L. Wang", "W. Chen"],
    source: "ICLR 2022",
    page_count: 14,
    uploaded_at: 1711503000,
    chunk_count: 7,
    embedding_model: "synapse-lsa-384-academic",
    embedding_dimension: 384,
    file_type: "PDF",
    topic: "Parameter-Efficient Fine-Tuning"
  },
  {
    document_id: "doc_retrieval_augmented_generation",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    authors: ["P. Lewis", "E. Perez", "A. Piktus", "F. Petroni", "V. Karpukhin", "N. Goyal", "H. Küttler", "M. Lewis"],
    source: "NeurIPS 2020",
    page_count: 19,
    uploaded_at: 1711504000,
    chunk_count: 7,
    embedding_model: "synapse-lsa-384-academic",
    embedding_dimension: 384,
    file_type: "PDF",
    topic: "Information Retrieval & RAG"
  },
  {
    document_id: "doc_generative_adversarial_nets",
    title: "Generative Adversarial Nets",
    authors: ["I. Goodfellow", "J. Pouget-Abadie", "M. Mirza", "B. Xu", "D. Warde-Farley", "S. Ozair", "Y. Bengio"],
    source: "NeurIPS 2014",
    page_count: 9,
    uploaded_at: 1711505000,
    chunk_count: 6,
    embedding_model: "synapse-lsa-384-academic",
    embedding_dimension: 384,
    file_type: "PDF",
    topic: "Generative Modeling & Game Theory"
  }
];

export const DEMO_VECTOR_POINTS: VectorNodePoint[] = [
  // Cluster 0: Transformers
  { id: "node_att_01", chunk_id: "chunk_att_0001", document_id: "doc_attention_is_all_you_need", title: "Attention Is All You Need", section: "Scaled Dot-Product Attention", page: 3, x: 12.4, y: 8.2, z: -5.1, cluster: 0, topic: "Transformers", preview_text: "Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V. Scales queries and keys to prevent vanishing softmax gradients...", vector_dim: 384 },
  { id: "node_att_02", chunk_id: "chunk_att_0002", document_id: "doc_attention_is_all_you_need", title: "Attention Is All You Need", section: "Multi-Head Attention", page: 3, x: 14.1, y: 9.6, z: -4.3, cluster: 0, topic: "Transformers", preview_text: "MultiHead(Q,K,V) allows the model to jointly attend to information from different representation subspaces at different positions...", vector_dim: 384 },
  { id: "node_att_03", chunk_id: "chunk_att_0003", document_id: "doc_attention_is_all_you_need", title: "Attention Is All You Need", section: "Positional Encoding", page: 5, x: 11.2, y: 11.4, z: -6.8, cluster: 0, topic: "Transformers", preview_text: "Sinusoidal positional encodings inject absolute and relative token positions without recurrence or convolutions...", vector_dim: 384 },
  { id: "node_att_04", chunk_id: "chunk_att_0004", document_id: "doc_attention_is_all_you_need", title: "Attention Is All You Need", section: "Abstract", page: 1, x: 13.5, y: 7.1, z: -3.2, cluster: 0, topic: "Transformers", preview_text: "The dominant sequence models rely on recurrent neural networks; Transformer dispenses with recurrence completely...", vector_dim: 384 },

  // Cluster 1: BERT
  { id: "node_bert_01", chunk_id: "chunk_bert_0001", document_id: "doc_bert_pretraining", title: "BERT: Bidirectional Transformers", section: "Masked Language Model", page: 3, x: 8.6, y: 14.2, z: 2.1, cluster: 1, topic: "Pre-trained LMs", preview_text: "Masked LM pre-training randomly masks 15% of tokens to train deep bidirectional representations from unlabeled text...", vector_dim: 384 },
  { id: "node_bert_02", chunk_id: "chunk_bert_0002", document_id: "doc_bert_pretraining", title: "BERT: Bidirectional Transformers", section: "Next Sentence Prediction", page: 4, x: 9.9, y: 15.8, z: 1.4, cluster: 1, topic: "Pre-trained LMs", preview_text: "Binarized task predicting whether sentence B follows A, capturing inter-sentence coherence for QA and NLI tasks...", vector_dim: 384 },
  { id: "node_bert_03", chunk_id: "chunk_bert_0003", document_id: "doc_bert_pretraining", title: "BERT: Bidirectional Transformers", section: "Fine-Tuning Procedure", page: 6, x: 7.2, y: 13.1, z: 3.5, cluster: 1, topic: "Pre-trained LMs", preview_text: "Adding a single task-specific output layer enables state-of-the-art results without extensive architecture modifications...", vector_dim: 384 },

  // Cluster 2: ResNet
  { id: "node_res_01", chunk_id: "chunk_res_0001", document_id: "doc_deep_residual_learning", title: "Deep Residual Learning", section: "Identity Shortcuts", page: 3, x: -14.2, y: -6.4, z: 8.9, cluster: 2, topic: "Computer Vision", preview_text: "Layers explicitly fit residual mapping F(x) := H(x) - x, recast into F(x) + x via parameter-free identity skip shortcuts...", vector_dim: 384 },
  { id: "node_res_02", chunk_id: "chunk_res_0002", document_id: "doc_deep_residual_learning", title: "Deep Residual Learning", section: "The Degradation Problem", page: 2, x: -15.8, y: -8.1, z: 7.2, cluster: 2, topic: "Computer Vision", preview_text: "Deeper models lead to higher training error, exposed not as overfitting but optimization degradation...", vector_dim: 384 },
  { id: "node_res_03", chunk_id: "chunk_res_0003", document_id: "doc_deep_residual_learning", title: "Deep Residual Learning", section: "152-Layer ImageNet Architecture", page: 5, x: -12.9, y: -5.0, z: 10.1, cluster: 2, topic: "Computer Vision", preview_text: "Residual nets with depth up to 152 layers achieve superior accuracy while maintaining lower complexity than VGG...", vector_dim: 384 },

  // Cluster 3: LoRA
  { id: "node_lora_01", chunk_id: "chunk_lora_0001", document_id: "doc_lora_adaptation", title: "LoRA: Low-Rank Adaptation", section: "Rank Decomposition Matrices", page: 3, x: -4.5, y: 12.1, z: -12.4, cluster: 3, topic: "Efficient Tuning", preview_text: "Constraining weight updates via W_0 + Delta W = W_0 + B A, where rank r << min(d, k), freezing base weights...", vector_dim: 384 },
  { id: "node_lora_02", chunk_id: "chunk_lora_0002", document_id: "doc_lora_adaptation", title: "LoRA: Low-Rank Adaptation", section: "Intrinsic Rank Hypothesis", page: 2, x: -3.1, y: 13.8, z: -11.0, cluster: 3, topic: "Efficient Tuning", preview_text: "Over-parametrized language models reside on low intrinsic dimensions, allowing lightweight low-rank parameter updates...", vector_dim: 384 },
  { id: "node_lora_03", chunk_id: "chunk_lora_0003", document_id: "doc_lora_adaptation", title: "LoRA: Low-Rank Adaptation", section: "10,000x Parameter Reduction", page: 4, x: -6.2, y: 10.9, z: -13.9, cluster: 3, topic: "Efficient Tuning", preview_text: "Reduces trainable parameters by 10,000x and GPU memory by 3x when adapting 175B parameter models...", vector_dim: 384 },

  // Cluster 4: RAG
  { id: "node_rag_01", chunk_id: "chunk_rag_0001", document_id: "doc_retrieval_augmented_generation", title: "Retrieval-Augmented Generation", section: "Dense Passage Retrieval", page: 4, x: 1.5, y: -12.4, z: -7.6, cluster: 4, topic: "Retrieval Augmented", preview_text: "Dual-encoder architecture produces d-dimensional vectors; similarity is defined by dot product score(x, z) = q(x)^T d(z)...", vector_dim: 384 },
  { id: "node_rag_02", chunk_id: "chunk_rag_0002", document_id: "doc_retrieval_augmented_generation", title: "Retrieval-Augmented Generation", section: "Parametric + Non-Parametric Memory", page: 1, x: 3.2, y: -14.1, z: -6.2, cluster: 4, topic: "Retrieval Augmented", preview_text: "Combines pre-trained seq2seq generator (parametric) with dense vector index of passages (non-parametric memory)...", vector_dim: 384 },
  { id: "node_rag_03", chunk_id: "chunk_rag_0003", document_id: "doc_retrieval_augmented_generation", title: "Retrieval-Augmented Generation", section: "Provenance and Inspection", page: 2, x: 0.1, y: -11.0, z: -9.1, cluster: 4, topic: "Retrieval Augmented", preview_text: "Accessed knowledge can be explicitly inspected and updated without retraining the entire parametric neural network...", vector_dim: 384 },

  // Cluster 5: GANs
  { id: "node_gan_01", chunk_id: "chunk_gan_0001", document_id: "doc_generative_adversarial_nets", title: "Generative Adversarial Nets", section: "Minimax Objective Formulation", page: 3, x: -11.5, y: -13.6, z: -4.8, cluster: 5, topic: "Generative Models", preview_text: "Two-player minimax game: min_G max_D V(D, G) = E[log D(x)] + E[log(1 - D(G(z)))], recovering data distribution...", vector_dim: 384 },
  { id: "node_gan_02", chunk_id: "chunk_gan_0002", document_id: "doc_generative_adversarial_nets", title: "Generative Adversarial Nets", section: "Theoretical Global Optimum", page: 4, x: -13.0, y: -15.1, z: -3.5, cluster: 5, topic: "Generative Models", preview_text: "Unique solution exists where generator distribution p_g matches data distribution p_data and D(x) = 1/2 everywhere...", vector_dim: 384 }
];

export const ARCHITECTURE_NODES = [
  {
    id: "query",
    name: "User Query",
    category: "Retrieval Pipeline",
    purpose: "Ingests natural language conceptual questions from researchers.",
    input: "Natural language query string (e.g. 'How do attention mechanisms preserve context?')",
    output: "Cleaned query string with special characters normalized",
    tech: "FastAPI / Pydantic validation",
    status: "PRODUCTION LIVE"
  },
  {
    id: "query_embedding",
    name: "Query Embedding Engine",
    category: "Retrieval Pipeline",
    purpose: "Projects user question into the shared 384-D semantic vector space.",
    input: "Clean query string",
    output: "Normalized 384-dimensional dense vector (||v||_2 = 1.0)",
    tech: "Modular EmbeddingProvider (SentenceTransformers / Calibrated LSA)",
    status: "PRODUCTION LIVE"
  },
  {
    id: "vector_search",
    name: "Vector Similarity Engine",
    category: "Retrieval Pipeline",
    purpose: "Executes maximum inner product search against all indexed document vectors.",
    input: "Query vector + top_k threshold + metadata filters",
    output: "Ranked candidate chunks with exact cosine similarity scores",
    tech: "NumPy Vectorized Matrix Dot Product / Inverted Index",
    status: "PRODUCTION LIVE"
  },
  {
    id: "hybrid_scorer",
    name: "Hybrid Lexical Combiner",
    category: "Retrieval Pipeline",
    purpose: "Blends semantic proximity with BM25 lexical term overlap.",
    input: "Cosine similarity + BM25 score + alpha/beta coefficients",
    output: "Fused relevance score: alpha * Semantic + beta * BM25",
    tech: "BM25 Probabilistic Relevance Model + Sigmoid Normalizer",
    status: "PRODUCTION LIVE"
  },
  {
    id: "reranker",
    name: "Reciprocal Rank Reranker",
    category: "Retrieval Pipeline",
    purpose: "Refines top candidate ordering using passage density and section alignment.",
    input: "Top 20-50 candidates from vector search",
    output: "Re-ordered Top-K results with provenance scores",
    tech: "Lexical-Semantic Reciprocal Rank Fusion",
    status: "OPTIONAL / TOGGLEABLE"
  },
  {
    id: "result_explorer",
    name: "Academic Result Explorer",
    category: "Retrieval Pipeline",
    purpose: "Renders retrieved passages with exact academic provenance and 3D visual trace.",
    input: "Top-K SearchResultItems with score breakdown",
    output: "Interactive cards, passage highlights, and 3D space navigation",
    tech: "React 19 / Three.js Raycaster / GSAP",
    status: "PRODUCTION LIVE"
  },
  {
    id: "document",
    name: "Document Ingestion",
    category: "Ingestion Pipeline",
    purpose: "Accepts academic PDFs, research reports, Markdown, and TXT files.",
    input: "Multipart form upload / raw byte buffer",
    output: "Validated file stream with size bounds verification",
    tech: "python-multipart / Async Stream Reader",
    status: "PRODUCTION LIVE"
  },
  {
    id: "parser",
    name: "Academic Parser",
    category: "Ingestion Pipeline",
    purpose: "Extracts text page-by-page and detects structural academic section headings.",
    input: "Raw PDF or document bytes",
    output: "Structured pages with (Section Heading, Text Body) tuples",
    tech: "pypdf / Regex Academic Section Heading Classifier",
    status: "PRODUCTION LIVE"
  },
  {
    id: "chunker",
    name: "Contextual Chunker",
    category: "Ingestion Pipeline",
    purpose: "Divides text into semantic chunks while strictly maintaining page and char provenance.",
    input: "Structured page sections, chunk size, overlap window",
    output: "List of ChunkMetadata with exact char_start, char_end, page, section",
    tech: "Sentence-Aware / Section-Aware Sliding Window Chunker",
    status: "PRODUCTION LIVE"
  },
  {
    id: "embedding_model",
    name: "Dense Embedding Model",
    category: "Ingestion Pipeline",
    purpose: "Encodes chunk texts into 384-D continuous semantic representations.",
    input: "Batched chunk texts",
    output: "Float32 embedding matrix (N, 384) with L2 normalization",
    tech: "SentenceTransformer / Latent Semantic Subspace Projector",
    status: "PRODUCTION LIVE"
  },
  {
    id: "vector_index",
    name: "Vector Index Store",
    category: "Ingestion Pipeline",
    purpose: "Stores dense representations and computes 3D PCA coordinates for visualization.",
    input: "Chunks metadata + dense embeddings",
    output: "Persisted vector index, memory profiling, 3D PCA coordinates",
    tech: "In-Memory Normalized Dot Product / Scikit-learn PCA",
    status: "PRODUCTION LIVE"
  }
];

export const ROADMAP_ITEMS = [
  { id: "01", title: "SEMANTIC VECTOR SEARCH", desc: "Dense embedding retrieval with unit-normalized cosine similarity and provenance.", status: "COMPLETE" },
  { id: "02", title: "HYBRID RETRIEVAL", desc: "Configurable alpha/beta blending between dense semantic embeddings and BM25 lexical overlap.", status: "COMPLETE" },
  { id: "03", title: "CROSS-ENCODER RERANKING", desc: "Contextual density and reciprocal rank fusion scoring for candidate refinement.", status: "COMPLETE" },
  { id: "04", title: "MULTI-MODAL DOCUMENTS", desc: "Dual vision-language embeddings for academic figures, charts, and mathematical notation.", status: "IN PROGRESS" },
  { id: "05", title: "TABLE & EQUATION RETRIEVAL", desc: "Specialized LaTeX equation parsers and structured table tensor indexing.", status: "IN PROGRESS" },
  { id: "06", title: "CITATION & REFERENCE GRAPH", desc: "Bidirectional citation tree extraction mapping cross-paper scholarly lineage.", status: "PLANNED" },
  { id: "07", title: "DISTRIBUTED VECTOR INDEX", desc: "HNSW sharding with Qdrant/Milvus clusters for million-scale paper archives.", status: "PLANNED" },
  { id: "08", title: "LOCAL + CLOUD HYBRID SYNC", desc: "WASM client-side vector search with background cloud cluster synchronization.", status: "PLANNED" }
];
