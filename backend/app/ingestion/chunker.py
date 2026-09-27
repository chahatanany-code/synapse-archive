import re
import uuid
from typing import List, Dict, Any, Literal
from ..models.schemas import ChunkMetadata

ChunkStrategy = Literal["sentence_aware", "paragraph_aware", "section_aware", "fixed_length"]

class DocumentChunker:
    """
    Academic chunking engine preserving exact page, section, and character provenance.
    Supports sentence, paragraph, section-aware, and sliding window boundaries.
    """
    def __init__(
        self,
        chunk_size: int = 450,
        chunk_overlap: int = 80,
        min_chunk_size: int = 60,
        max_chunk_size: int = 1000,
        strategy: ChunkStrategy = "sentence_aware"
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.min_chunk_size = min_chunk_size
        self.max_chunk_size = max_chunk_size
        self.strategy = strategy

    def _split_into_sentences(self, text: str) -> List[str]:
        # Split on sentence terminals while keeping punctuation
        sentences = re.split(r"(?<=[.!?])\s+", text)
        return [s.strip() for s in sentences if s.strip()]

    def _split_into_paragraphs(self, text: str) -> List[str]:
        paragraphs = re.split(r"\n\s*\n+", text)
        return [p.strip() for p in paragraphs if p.strip()]

    def chunk_document(
        self,
        document_id: str,
        document_title: str,
        pages_data: List[Dict[str, Any]]
    ) -> List[ChunkMetadata]:
        chunks: List[ChunkMetadata] = []
        global_chunk_idx = 0

        for page_info in pages_data:
            page_num = page_info.get("page_number", 1)
            sections = page_info.get("sections", [("Main Content", page_info.get("text", ""))])

            for section_title, section_body in sections:
                if not section_body.strip():
                    continue

                if self.strategy == "section_aware":
                    # Keep whole section or split if over max_chunk_size
                    sec_chunks = self._chunk_text_sliding(section_body, self.chunk_size, self.chunk_overlap)
                elif self.strategy == "paragraph_aware":
                    sec_chunks = self._chunk_by_paragraphs(section_body)
                elif self.strategy == "fixed_length":
                    sec_chunks = self._chunk_fixed(section_body)
                else:  # sentence_aware (default)
                    sec_chunks = self._chunk_by_sentences(section_body)

                for chunk_text, start_char, end_char in sec_chunks:
                    if len(chunk_text.strip()) < self.min_chunk_size:
                        continue
                    
                    chunk_id = f"chunk_{document_id[:8]}_{global_chunk_idx:04d}"
                    token_count = len(chunk_text.split())
                    
                    chunks.append(
                        ChunkMetadata(
                            chunk_id=chunk_id,
                            document_id=document_id,
                            document_title=document_title,
                            page=page_num,
                            section=section_title,
                            chunk_index=global_chunk_idx,
                            text=chunk_text.strip(),
                            token_count=token_count,
                            char_start=start_char,
                            char_end=end_char
                        )
                    )
                    global_chunk_idx += 1

        return chunks

    def _chunk_by_sentences(self, text: str) -> List[tuple[str, int, int]]:
        sentences = self._split_into_sentences(text)
        result = []
        current_chunk: List[str] = []
        current_len = 0
        char_pointer = 0

        for sentence in sentences:
            sentence_len = len(sentence)
            if current_len + sentence_len > self.chunk_size and current_chunk:
                combined = " ".join(current_chunk)
                start_c = text.find(combined, max(0, char_pointer - 200))
                if start_c == -1:
                    start_c = char_pointer
                end_c = start_c + len(combined)
                result.append((combined, start_c, end_c))
                char_pointer = end_c
                
                # Overlap: keep the last sentence if under overlap threshold
                if len(current_chunk[-1]) <= self.chunk_overlap:
                    current_chunk = [current_chunk[-1], sentence]
                    current_len = len(current_chunk[0]) + 1 + sentence_len
                else:
                    current_chunk = [sentence]
                    current_len = sentence_len
            else:
                current_chunk.append(sentence)
                current_len += sentence_len + 1

        if current_chunk:
            combined = " ".join(current_chunk)
            start_c = text.find(combined, max(0, char_pointer - 200))
            if start_c == -1:
                start_c = char_pointer
            result.append((combined, start_c, start_c + len(combined)))

        return result

    def _chunk_by_paragraphs(self, text: str) -> List[tuple[str, int, int]]:
        paras = self._split_into_paragraphs(text)
        result = []
        for p in paras:
            if len(p) <= self.max_chunk_size:
                start = text.find(p)
                result.append((p, start, start + len(p)))
            else:
                # Fallback to sentence chunking for large paragraphs
                result.extend(self._chunk_by_sentences(p))
        return result

    def _chunk_text_sliding(self, text: str, size: int, overlap: int) -> List[tuple[str, int, int]]:
        result = []
        start = 0
        text_len = len(text)
        while start < text_len:
            end = min(start + size, text_len)
            chunk = text[start:end]
            result.append((chunk, start, end))
            if end >= text_len:
                break
            start += size - overlap
        return result

    def _chunk_fixed(self, text: str) -> List[tuple[str, int, int]]:
        return self._chunk_text_sliding(text, self.chunk_size, self.chunk_overlap)
