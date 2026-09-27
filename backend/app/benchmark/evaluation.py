import math
from typing import Dict, List, Optional
from ..models.schemas import EvaluationMetrics, SearchRequest
from ..retrieval.engine import retrieval_engine

LABELED_EVALUATION_SUITE = [
    {
        "query": "How does self-attention compute representation vectors for sequence positions?",
        "target_doc_id": "doc_attention_is_all_you_need"
    },
    {
        "query": "What is the masked language model training objective in bidirectional transformers?",
        "target_doc_id": "doc_bert_pretraining"
    },
    {
        "query": "How do residual connections solve degradation in deep feed-forward convolutional networks?",
        "target_doc_id": "doc_deep_residual_learning"
    },
    {
        "query": "How does low-rank matrix decomposition reduce trainable parameters during LLM fine-tuning?",
        "target_doc_id": "doc_lora_adaptation"
    },
    {
        "query": "How does dense passage retrieval interact with seq2seq generator in RAG models?",
        "target_doc_id": "doc_retrieval_augmented_generation"
    }
]

class EvaluationSuite:
    """
    Academic Retrieval Evaluation Suite.
    Calculates actual Recall@5, Recall@10, Mean Reciprocal Rank (MRR),
    and normalized Discounted Cumulative Gain (nDCG@10).
    Honors Project Integrity Rule 02: Never fabricates retrieval performance.
    """
    def __init__(self):
        self._cached_metrics: Optional[EvaluationMetrics] = None

    def get_status(self) -> EvaluationMetrics:
        if self._cached_metrics is None:
            return EvaluationMetrics(
                configured=False,
                status_label="AWAITING BENCHMARK",
                source_type="AWAITING CALCULATION"
            )
        return self._cached_metrics

    def run_evaluation(self) -> EvaluationMetrics:
        if not LABELED_EVALUATION_SUITE:
            return EvaluationMetrics(
                configured=False,
                status_label="EVALUATION DATASET NOT CONFIGURED",
                source_type="NONE"
            )

        hits_at_5 = 0
        hits_at_10 = 0
        reciprocal_ranks = []
        dcg_list = []
        idcg_10 = 1.0  # Ideal DCG for 1 relevant target item at rank 1

        for item in LABELED_EVALUATION_SUITE:
            query = item["query"]
            target_id = item["target_doc_id"]

            req = SearchRequest(query=query, top_k=10, mode="semantic")
            res = retrieval_engine.search(req)

            doc_ranks = [r.document_id for r in res.results]
            
            # Check Recall@5 and Recall@10
            rank = None
            for idx, d_id in enumerate(doc_ranks):
                if target_id in d_id or d_id in target_id:
                    rank = idx + 1
                    break

            if rank is not None:
                if rank <= 5:
                    hits_at_5 += 1
                if rank <= 10:
                    hits_at_10 += 1
                reciprocal_ranks.append(1.0 / rank)
                dcg = 1.0 / math.log2(rank + 1)
                dcg_list.append(dcg / idcg_10)
            else:
                reciprocal_ranks.append(0.0)
                dcg_list.append(0.0)

        n_queries = len(LABELED_EVALUATION_SUITE)
        recall_5 = round((hits_at_5 / n_queries) * 100, 1)
        recall_10 = round((hits_at_10 / n_queries) * 100, 1)
        mrr = round(sum(reciprocal_ranks) / n_queries, 3)
        ndcg = round(sum(dcg_list) / n_queries, 3)

        self._cached_metrics = EvaluationMetrics(
            configured=True,
            status_label="CALCULATED LIVE",
            recall_at_5=recall_5,
            recall_at_10=recall_10,
            mrr=mrr,
            ndcg_at_10=ndcg,
            dataset_name="Synapse-Academic-Bench-v1",
            source_type="CALCULATED"
        )
        return self._cached_metrics

evaluation_suite = EvaluationSuite()
