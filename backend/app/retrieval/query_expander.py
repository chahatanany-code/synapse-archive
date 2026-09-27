import re
from typing import List, Set
from ..models.schemas import ChunkMetadata

ACADEMIC_CONCEPT_DICTIONARY = {
    "attention": ["self-attention", "multi-head attention", "query-key-value", "scaled dot-product", "context vectors", "cross-attention"],
    "transformer": ["encoder-decoder", "positional encoding", "feed-forward network", "layer normalization", "residual connections"],
    "bert": ["masked language model", "next sentence prediction", "bidirectional representations", "fine-tuning", "cls token"],
    "resnet": ["residual mapping", "identity shortcuts", "vanishing gradient", "deep residual networks", "skip connections"],
    "lora": ["low-rank adaptation", "intrinsic rank", "adapter matrices", "parameter-efficient tuning", "qlora"],
    "rag": ["dense passage retrieval", "dual-encoder", "non-parametric memory", "vector index", "grounded generation"],
    "vector": ["cosine similarity", "nearest neighbor search", "embedding space", "high-dimensional manifold", "dot product"],
    "diffusion": ["score matching", "denoising process", "latent diffusion", "reverse drift", "stochastic differential equations"],
    "gan": ["minimax game", "discriminator loss", "generator network", "adversarial training", "mode collapse"]
}

class QueryExpander:
    """
    Algorithmic query concept expander that analyzes the retrieved semantic neighborhood
    and extracts salient conceptual n-grams and domain associations.
    """
    def expand(self, query: str, retrieved_chunks: List[ChunkMetadata]) -> List[str]:
        query_words = set(re.findall(r"\b\w{3,}\b", query.lower()))
        suggested: List[str] = []

        # Check domain dictionary anchors
        for q_word in query_words:
            for key, concepts in ACADEMIC_CONCEPT_DICTIONARY.items():
                if key in q_word or q_word in key:
                    for c in concepts:
                        if c not in suggested and c not in query.lower():
                            suggested.append(c)

        # Extract salient frequent noun phrases from top retrieved chunk sections and text
        extracted_terms: Set[str] = set()
        for chunk in retrieved_chunks[:5]:
            # Inspect section titles
            if chunk.section and chunk.section not in ["Main Content", "Abstract / Introduction"]:
                clean_sec = chunk.section.lower().strip()
                if clean_sec not in query.lower() and len(clean_sec) > 3:
                    extracted_terms.add(clean_sec)

            # Look for bracketed or emphasized terms
            terms = re.findall(r"\b([a-z]+-[a-z]+|[a-z]+\s+(?:attention|encoding|projection|layer|network|matrix|embedding))\b", chunk.text.lower())
            for t in terms:
                if t not in query.lower() and len(t) > 4:
                    extracted_terms.add(t)

        for term in sorted(extracted_terms):
            if term not in suggested and len(suggested) < 8:
                suggested.append(term)

        # Return top 5-7 distinct concepts
        return suggested[:7] if suggested else ["semantic vector space", "cosine similarity", "latent representations", "dense retrieval"]

query_expander = QueryExpander()
