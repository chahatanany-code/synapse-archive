"use client";

import React from "react";
import { X, HelpCircle, Sigma, CheckCircle, Database } from "lucide-react";
import { SearchResultItem } from "@/types";

interface WhyThisResultModalProps {
  item: SearchResultItem | null;
  onClose: () => void;
}

export const WhyThisResultModal: React.FC<WhyThisResultModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const breakdown = item.score_breakdown;
  const vectorSample = item.vector_sample || [0.124, -0.045, 0.892, 0.312, -0.654, 0.221, -0.012, 0.443];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative flex flex-col w-full max-w-2xl rounded-2xl border border-[#00f0ff]/30 bg-[#080a0f] p-6 shadow-[0_0_60px_rgba(0,240,255,0.15)] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#00f0ff]" />
            <h2 className="font-mono text-sm uppercase tracking-widest text-white font-bold">
              EXPLAINABLE RETRIEVAL // WHY THIS RESULT?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Target Info */}
        <div className="mb-4 rounded-xl border border-white/10 bg-black/40 p-3">
          <div className="font-mono text-[10px] text-[#00f0ff] uppercase">DOCUMENT & CONTEXT</div>
          <div className="font-bold text-white text-sm line-clamp-1">{item.title}</div>
          <div className="flex gap-4 font-mono text-[10px] text-[#8fa0b5] mt-1">
            <span>PAGE {item.page}</span>
            <span>•</span>
            <span className="text-[#9d4edd]">SECTION: {item.section}</span>
            <span>•</span>
            <span>CHUNK #{item.chunk_id.slice(-6)}</span>
          </div>
        </div>

        {/* Scoring Components Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/5 p-3 text-center">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#8fa0b5]">
              SEMANTIC SIMILARITY
            </span>
            <div className="font-mono text-xl font-bold text-[#00f0ff] mt-1">
              {breakdown.semantic_score.toFixed(3)}
            </div>
            <span className="font-mono text-[9px] text-[#526075]">
              WEIGHT (&alpha;): {breakdown.alpha_used}
            </span>
          </div>

          <div className="rounded-lg border border-[#9d4edd]/30 bg-[#9d4edd]/5 p-3 text-center">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#8fa0b5]">
              KEYWORD SCORE (BM25)
            </span>
            <div className="font-mono text-xl font-bold text-[#9d4edd] mt-1">
              {breakdown.keyword_score.toFixed(3)}
            </div>
            <span className="font-mono text-[9px] text-[#526075]">
              WEIGHT (&beta;): {breakdown.beta_used}
            </span>
          </div>

          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-center">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#8fa0b5]">
              FINAL SCORE
            </span>
            <div className="font-mono text-xl font-bold text-emerald-400 mt-1">
              {breakdown.final_score.toFixed(3)}
            </div>
            <span className="font-mono text-[9px] text-[#526075]">
              {breakdown.rerank_applied ? `+${breakdown.rerank_delta} RRF BOOST` : "UNRERANKED"}
            </span>
          </div>
        </div>

        {/* Mathematical Formulation */}
        <div className="rounded-xl border border-white/10 bg-black/60 p-4 mb-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-[#00f0ff] mb-2 font-bold">
            <Sigma className="h-4 w-4" />
            <span>COSINE SIMILARITY FORMULATION:</span>
          </div>
          <div className="bg-black/80 rounded p-2 text-center text-white/90 border border-white/5 mb-2">
            cos(&theta;) = (Q &middot; D) / (||Q||_2 &times; ||D||_2) = &Sigma;<sub>i=1</sub><sup>384</sup> Q<sub>i</sub> &times; D<sub>i</sub>
          </div>
          <p className="font-sans text-[11px] text-[#8fa0b5] leading-relaxed">
            Because embeddings are strictly unit-normalized upon ingestion (||D||_2 = 1.0), the dot product corresponds directly to the cosine of the angle in 384-dimensional representation space.
          </p>
        </div>

        {/* Vector Sample Inspector */}
        <div className="rounded-xl border border-white/10 bg-black/40 p-3">
          <div className="flex items-center justify-between mb-2 font-mono text-[10px] text-[#8fa0b5]">
            <span className="text-[#9d4edd]">VECTOR SAMPLE (DIMENSIONS 01 - 08 / 384-D):</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> ||v||_2 = 1.000
            </span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 font-mono text-[11px] text-white">
            {vectorSample.map((val, idx) => (
              <div key={idx} className="rounded bg-white/5 p-1.5 text-center border border-white/5">
                <span className="text-[9px] text-[#526075] block">d_{idx + 1}</span>
                {val.toFixed(3)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
