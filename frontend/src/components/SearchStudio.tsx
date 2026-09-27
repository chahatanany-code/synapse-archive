"use client";

import React, { useState } from "react";
import { Search, Sliders, ArrowUpRight, Cpu, Layers, Sparkles, Filter, CheckCircle2, Loader2 } from "lucide-react";
import { SearchRequest, SearchResponse, SearchTelemetry } from "@/types";
import { SAMPLE_QUERIES } from "@/lib/constants";

interface SearchStudioProps {
  onExecuteSearch: (req: SearchRequest) => void;
  isSearching: boolean;
  searchTelemetry?: SearchTelemetry;
  pipelineStep: number; // 0 to 5
  totalNodes: number;
}

export const SearchStudio: React.FC<SearchStudioProps> = ({
  onExecuteSearch,
  isSearching,
  searchTelemetry,
  pipelineStep,
  totalNodes
}) => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"semantic" | "exact" | "hybrid">("semantic");
  const [alpha, setAlpha] = useState(0.75); // Semantic weight
  const [beta, setBeta] = useState(0.25);  // Lexical weight
  const [rerank, setRerank] = useState(false);
  const [topK, setTopK] = useState(5);
  const [threshold, setThreshold] = useState(0.25);
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onExecuteSearch({
      query: query.trim(),
      top_k: topK,
      mode,
      alpha,
      beta: 1.0 - alpha,
      threshold,
      rerank
    });
  };

  const handleSelectSample = (sample: string) => {
    setQuery(sample);
    onExecuteSearch({
      query: sample,
      top_k: topK,
      mode,
      alpha,
      beta: 1.0 - alpha,
      threshold,
      rerank
    });
  };

  const PIPELINE_STAGES = [
    { label: "QUERY ENCODED", sub: "384-D Vector Projection" },
    { label: "VECTOR GENERATED", sub: "Unit Norm L2 Calibrated" },
    { label: `SEARCHING ${totalNodes} NODES`, sub: "Max Inner Product (Cosine)" },
    { label: "CALCULATING SIMILARITY", sub: mode === "hybrid" ? "Alpha/Beta Fused" : "Cosine Dot Product" },
    { label: "RANKING RESULTS", sub: rerank ? "RRF Reranker Applied" : "Sorted Top-K Candidates" },
    { label: "RESULTS READY", sub: "Provenance Verified" }
  ];

  return (
    <section id="search-studio" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Studio Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest glow-cyan">
            05 // LIVE SEARCH CONSOLE
          </span>
          <span className="text-white/20">|</span>
          <span className="font-mono text-xs text-[#8fa0b5]">QUERY KNOWLEDGE ENGINE</span>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 rounded border px-3 py-1 font-mono text-xs transition-colors ${
            showFilters
              ? "border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]"
              : "border-white/10 bg-white/5 text-[#8fa0b5] hover:text-white"
          }`}
        >
          <Filter className="h-3 w-3" />
          <span>PARAMETRIC FILTERS</span>
        </button>
      </div>

      {/* Main Knowledge Query Box */}
      <div className="glass-panel-cyan rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.06)] relative overflow-hidden">
        {/* Subtle accent border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-80" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-xs text-[#8fa0b5]">
              <span className="uppercase tracking-wider">ASK THE ARCHIVE</span>
              <span>NATURAL LANGUAGE OR CONCEPTUAL SPECIFICATION</span>
            </div>

            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={3}
                placeholder="How do attention mechanisms allow transformers to retain contextual dependencies across long sequence horizons?"
                className="w-full resize-none rounded-xl border border-white/10 bg-black/60 p-4 font-sans text-base sm:text-lg text-white placeholder-white/20 outline-none focus:border-[#00f0ff]/80 focus:ring-1 focus:ring-[#00f0ff] transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-[#00f0ff] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_#00f0ff]"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>ENCODING...</span>
                  </>
                ) : (
                  <>
                    <span>SEARCH ARCHIVE</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search Modes & Reranking Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
            {/* Mode selection */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#8fa0b5] mr-1">MODE:</span>
              <div className="inline-flex rounded-lg border border-white/10 bg-black/40 p-1 font-mono text-xs">
                {(["semantic", "exact", "hybrid"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`rounded px-3 py-1 uppercase tracking-wider transition-all ${
                      mode === m
                        ? "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]"
                        : "text-[#8fa0b5] hover:text-white"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Reranking switch */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#8fa0b5]">RERANKING:</span>
              <button
                type="button"
                onClick={() => setRerank(!rerank)}
                className={`font-mono text-xs px-2.5 py-1 rounded border transition-all ${
                  rerank
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                    : "border-white/10 bg-white/5 text-[#8fa0b5] hover:text-white"
                }`}
              >
                {rerank ? "● ENABLED (RRF)" : "○ DISABLED"}
              </button>
            </div>
          </div>

          {/* Hybrid Alpha/Beta Slider when Mode is Hybrid */}
          {mode === "hybrid" && (
            <div className="rounded-lg border border-[#00f0ff]/20 bg-[#00f0ff]/5 p-4 flex flex-col gap-2 transition-all">
              <div className="flex justify-between font-mono text-xs text-[#8fa0b5]">
                <span>
                  SEMANTIC RATIO (&alpha;): <strong className="text-[#00f0ff]">{(alpha * 100).toFixed(0)}%</strong>
                </span>
                <span>
                  KEYWORD RATIO (&beta;): <strong className="text-[#9d4edd]">{((1 - alpha) * 100).toFixed(0)}%</strong>
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.05"
                value={alpha}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setAlpha(val);
                  setBeta(1.0 - val);
                }}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-black/60 accent-[#00f0ff]"
              />
              <div className="flex justify-between font-mono text-[9px] text-[#526075]">
                <span>EXACT KEYWORDS ONLY</span>
                <span>BALANCED HYBRID (RECOMMENDED)</span>
                <span>PURE CONCEPTUAL VECTOR</span>
              </div>
            </div>
          )}

          {/* Expandable Parametric Filter Drawer */}
          {showFilters && (
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-[#8fa0b5] mb-1">
                  TOP-K CANDIDATES: <span className="text-white font-bold">{topK}</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={topK}
                  onChange={(e) => setTopK(parseInt(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-black/60 accent-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#8fa0b5] mb-1">
                  MIN SIMILARITY THRESHOLD: <span className="text-white font-bold">{threshold}</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-black/60 accent-[#00f0ff]"
                />
              </div>
            </div>
          )}
        </form>

        {/* Sample Academic Prompts */}
        <div className="mt-6 flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8fa0b5]">
            SAMPLE CONCEPTUAL INQUIRIES:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUERIES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample)}
                className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1.5 text-left font-sans text-xs text-[#8fa0b5] hover:border-[#00f0ff]/40 hover:bg-[#00f0ff]/5 hover:text-white transition-all"
              >
                &ldquo;{sample}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Pipeline Visualizer */}
      <div className="mt-8 rounded-xl border border-white/10 bg-[#0c1018]/60 p-4">
        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
          <span className="font-mono text-xs text-[#8fa0b5] uppercase tracking-wider">
            RETRIEVAL PIPELINE EXECUTION
          </span>
          {isSearching && (
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#00f0ff]">
              <Loader2 className="h-3 w-3 animate-spin" /> RUNNING PIPELINE
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PIPELINE_STAGES.map((stg, i) => {
            const isCompleted = !isSearching ? true : pipelineStep > i;
            const isCurrent = isSearching && pipelineStep === i;

            return (
              <div
                key={i}
                className={`rounded border p-2 flex flex-col gap-1 transition-all ${
                  isCurrent
                    ? "border-[#00f0ff] bg-[#00f0ff]/15 shadow-[0_0_12px_rgba(0,240,255,0.3)] animate-pulse"
                    : isCompleted
                    ? "border-white/10 bg-black/40 text-white"
                    : "border-white/5 bg-black/20 opacity-40 text-[#526075]"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[9px]">
                  <span>STEP 0{i + 1}</span>
                  {isCompleted && <CheckCircle2 className="h-3 w-3 text-[#00f0ff]" />}
                </div>
                <div className="font-mono text-[10px] font-bold leading-tight">
                  {stg.label}
                </div>
                <div className="font-mono text-[9px] text-[#8fa0b5] line-clamp-1">
                  {stg.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search Telemetry Bar (Section 23) */}
      {searchTelemetry && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/5 bg-black/60 px-4 py-2.5 font-mono text-xs text-[#8fa0b5]">
          <div className="flex items-center gap-1">
            <span className="text-[#00f0ff]">QUERY ENCODING:</span>
            <span className="text-white font-bold">{searchTelemetry.query_encoding_ms} ms</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#00f0ff]">VECTOR SEARCH:</span>
            <span className="text-white font-bold">{searchTelemetry.vector_search_ms} ms</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#9d4edd]">RERANKING:</span>
            <span className="text-white font-bold">{searchTelemetry.reranking_ms} ms</span>
          </div>
          <div className="flex items-center gap-1 border-l border-white/10 pl-3">
            <span className="text-emerald-400">TOTAL:</span>
            <span className="text-emerald-400 font-bold">{searchTelemetry.total_ms} ms</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#526075]">
            <span>SCANNED: {searchTelemetry.candidates_scanned} NODES</span>
          </div>
        </div>
      )}
    </section>
  );
};
