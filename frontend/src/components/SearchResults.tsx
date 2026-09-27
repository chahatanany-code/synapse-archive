"use client";

import React from "react";
import { SearchResultItem } from "@/types";
import { BookOpen, Compass, HelpCircle, Bookmark, Sparkles, ExternalLink, Hash } from "lucide-react";

interface SearchResultsProps {
  results: SearchResultItem[];
  relatedConcepts: string[];
  onOpenDocument: (docId: string, page: number) => void;
  onTraceInVectorSpace: (chunkId: string) => void;
  onWhyThisResult: (item: SearchResultItem) => void;
  onSaveToVault: (item: SearchResultItem) => void;
  onSelectConcept: (concept: string) => void;
  onHoverResult: (chunkId: string | null) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  relatedConcepts,
  onOpenDocument,
  onTraceInVectorSpace,
  onWhyThisResult,
  onSaveToVault,
  onSelectConcept,
  onHoverResult
}) => {
  if (results.length === 0) return null;

  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Query Expansion Bar (Section 22) */}
      {relatedConcepts.length > 0 && (
        <div className="mb-8 rounded-xl border border-[#9d4edd]/30 bg-[#9d4edd]/5 p-4 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#9d4edd]">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wider font-bold">QUERY EXPLORER // CONCEPTUAL NEIGHBORHOOD:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedConcepts.map((concept, idx) => (
              <button
                key={idx}
                onClick={() => onSelectConcept(concept)}
                className="rounded-full border border-[#9d4edd]/40 bg-black/40 px-3 py-1 font-mono text-xs text-white/90 hover:border-[#00f0ff] hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-all"
              >
                + {concept}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest glow-cyan">
            01 / RETRIEVAL CANDIDATES
          </span>
          <span className="text-white/20">|</span>
          <span className="font-mono text-xs text-[#8fa0b5]">{results.length} EVIDENCE PASSAGES</span>
        </div>
        <span className="font-mono text-[10px] text-[#526075]">SORTED BY CONTINUOUS DENSE AFFINITY</span>
      </div>

      {/* Results Cards List */}
      <div className="flex flex-col gap-4">
        {results.map((item, index) => {
          const scorePercent = (item.score * 100).toFixed(1);
          const isHighConfidence = item.score > 0.75;

          return (
            <div
              key={item.chunk_id}
              onMouseEnter={() => onHoverResult(item.chunk_id)}
              onMouseLeave={() => onHoverResult(null)}
              className="glass-panel group rounded-xl p-6 transition-all duration-200 hover:border-[#00f0ff]/40 hover:bg-[#0c1422]/90 relative overflow-hidden"
            >
              {/* Card Index & Score Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#00f0ff]">
                    {String(index + 1).padStart(2, "0")} // RETRIEVAL
                  </span>
                  <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-[#8fa0b5]">
                    PAGE {item.page}
                  </span>
                  <span className="rounded bg-[#9d4edd]/10 border border-[#9d4edd]/30 px-2 py-0.5 font-mono text-[10px] text-[#9d4edd]">
                    {item.section}
                  </span>
                </div>

                {/* Score Pill */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#8fa0b5]">
                      SIMILARITY
                    </span>
                    <span className={`font-mono text-sm font-bold ${isHighConfidence ? "text-[#00f0ff] glow-cyan" : "text-white"}`}>
                      {item.score.toFixed(3)}
                    </span>
                  </div>
                  <div className="h-8 w-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="w-full bg-[#00f0ff] rounded-full transition-all duration-500"
                      style={{ height: `${scorePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Document Title */}
              <h3 className="font-sans text-lg font-bold text-white group-hover:text-[#00f0ff] transition-colors mb-2 leading-snug">
                {item.title}
              </h3>

              {/* Passage Body */}
              <div className="relative rounded-lg bg-black/40 p-4 border border-white/5 font-sans text-sm text-[#cbd5e1] leading-relaxed mb-4">
                &ldquo;{item.text}&rdquo;
              </div>

              {/* Provenance & Action Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-3">
                <div className="flex items-center gap-3 font-mono text-[10px] text-[#526075]">
                  <span>CHUNK: #{item.chunk_id.slice(-6)}</span>
                  <span>DIM: 384-D</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <button
                    onClick={() => onWhyThisResult(item)}
                    className="flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2.5 py-1 text-[#8fa0b5] hover:border-white/30 hover:text-white transition-all"
                  >
                    <HelpCircle className="h-3 w-3 text-[#00f0ff]" />
                    <span>WHY THIS RESULT?</span>
                  </button>

                  <button
                    onClick={() => onTraceInVectorSpace(item.chunk_id)}
                    className="flex items-center gap-1 rounded border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-2.5 py-1 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all"
                  >
                    <Compass className="h-3 w-3" />
                    <span>TRACE IN 3D SPACE →</span>
                  </button>

                  <button
                    onClick={() => onOpenDocument(item.document_id, item.page)}
                    className="flex items-center gap-1 rounded border border-[#9d4edd]/30 bg-[#9d4edd]/10 px-2.5 py-1 text-[#9d4edd] hover:bg-[#9d4edd] hover:text-white transition-all"
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>OPEN DOCUMENT →</span>
                  </button>

                  <button
                    onClick={() => onSaveToVault(item)}
                    className="flex items-center gap-1 rounded border border-white/10 bg-white/5 p-1.5 text-[#8fa0b5] hover:text-[#00f0ff] hover:border-[#00f0ff]/40 transition-all"
                    title="Save to Research Vault"
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
