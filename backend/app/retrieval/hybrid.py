import re
import math
from typing import List, Dict, Set
from ..models.schemas import ChunkMetadata

class LexicalScorer:
    """
    Lightweight, fast BM25 / Lexical overlap scorer for hybrid search.
    Calculates exact keyword term matches against academic chunks.
    """
    def __init__(self, k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.corpus_size = 0
        self.avg_doc_len = 0.0
        self.doc_freqs: Dict[str, int] = {}
        self.doc_lens: List[int] = []
        self.tokenized_corpus: List[List[str]] = []

    def fit(self, chunks: List[ChunkMetadata]) -> None:
        self.corpus_size = len(chunks)
        self.doc_lens = []
        self.doc_freqs = {}
        self.tokenized_corpus = []

        total_words = 0
        for chunk in chunks:
            tokens = self._tokenize(chunk.text)
            self.tokenized_corpus.append(tokens)
            self.doc_lens.append(len(tokens))
            total_words += len(tokens)

            unique_tokens = set(tokens)
            for t in unique_tokens:
                self.doc_freqs[t] = self.doc_freqs.get(t, 0) + 1

        self.avg_doc_len = total_words / max(self.corpus_size, 1)

    def _tokenize(self, text: str) -> List[str]:
        return [w.lower() for w in re.findall(r"\b[a-zA-Z0-9_\-]{2,}\b", text)]

    def score(self, query: str, chunk_index: int) -> float:
        if self.corpus_size == 0 or chunk_index >= len(self.tokenized_corpus):
            return 0.0

        query_tokens = self._tokenize(query)
        if not query_tokens:
            return 0.0

        doc_tokens = self.tokenized_corpus[chunk_index]
        doc_len = self.doc_lens[chunk_index]
        
        # Word frequency in doc
        tf_dict: Dict[str, int] = {}
        for token in doc_tokens:
            tf_dict[token] = tf_dict.get(token, 0) + 1

        score = 0.0
        for q_token in query_tokens:
            tf = tf_dict.get(q_token, 0)
            if tf == 0:
                continue

            df = self.doc_freqs.get(q_token, 1)
            # IDF with smoothing
            idf = math.log(1.0 + (self.corpus_size - df + 0.5) / (df + 0.5))
            # BM25 numerator and denominator
            num = tf * (self.k1 + 1.0)
            denom = tf + self.k1 * (1.0 - self.b + self.b * (doc_len / max(self.avg_doc_len, 1e-6)))
            score += idf * (num / denom)

        # Normalize score to [0, 1] range using sigmoid-like scaling
        normalized_score = 1.0 - (1.0 / (1.0 + (score / 4.0)))
        return float(round(normalized_score, 4))
