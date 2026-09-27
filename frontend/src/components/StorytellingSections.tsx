"use client";

import React, { useState } from "react";
import { ROADMAP_ITEMS } from "@/lib/constants";
import { XCircle, CheckCircle2, AlertTriangle, Cpu, Database, BookOpen, Layers, Terminal, Sparkles } from "lucide-react";

export const StorytellingSections: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"bottleneck" | "solution">("bottleneck");

  return (
    <div className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col gap-24">
      {/* ---------------- 02 & 03: THE BOTTLENECK VS THE SOLUTION ---------------- */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
          <div>
            <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest glow-cyan">
              02 &amp; 03 // THE CORE BOTTLENECK &amp; THE SOLUTION
            </span>
            <h2 className="font-mono text-2xl sm:text-3xl font-bold text-white uppercase mt-1">
              LEXICAL FRAGILITY VS. CONTINUOUS REPRESENTATIONS
            </h2>
          </div>

          <div className="inline-flex rounded-lg border border-white/10 bg-black/40 p-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab("bottleneck")}
              className={`rounded px-4 py-1.5 uppercase transition-all ${
                activeTab === "bottleneck"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  : "text-[#8fa0b5] hover:text-white"
              }`}
            >
              THE BOTTLENECK
            </button>
            <button
              onClick={() => setActiveTab("solution")}
              className={`rounded px-4 py-1.5 uppercase transition-all ${
                activeTab === "solution"
                  ? "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40"
                  : "text-[#8fa0b5] hover:text-white"
              }`}
            >
              THE SOLUTION
            </button>
          </div>
        </div>

        {activeTab === "bottleneck" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col gap-4 font-sans text-sm text-[#cbd5e1] leading-relaxed">
              <h3 className="font-mono text-lg font-bold text-white">
                Traditional Keyword Search Relies on Lexical Overlap
              </h3>
              <p>
                When researchers ask conceptual questions such as:
              </p>
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 font-mono text-xs text-rose-300">
                &ldquo;Why does attention help models preserve long-range sequence context?&rdquo;
              </div>
              <p>
                Seminal academic papers frequently express the answer using completely different vocabulary:
              </p>
              <div className="rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-xs text-[#8fa0b5]">
                &ldquo;...self-attention connects all positions with a constant number of sequentially executed operations, reducing path length between distant tokens...&rdquo;
              </div>
              <p className="text-[#8fa0b5]">
                Because exact keywords do not intersect, lexical inverted indexes (BM25 alone) return <strong className="text-rose-400">NO RELEVANT MATCH</strong> or bury the true insight under superficial keyword noise.
              </p>
            </div>

            {/* Visual Diagram */}
            <div className="rounded-2xl border border-rose-500/30 bg-black/60 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between font-mono text-xs text-rose-400 border-b border-rose-500/20 pb-2">
                <span>LEXICAL INVERTED INDEX FAILURE</span>
                <XCircle className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-3 font-mono text-xs text-center">
                <div className="rounded border border-white/10 bg-white/5 p-2 text-white">
                  QUERY: &ldquo;preserve long-range sequence context&rdquo;
                </div>
                <div className="text-rose-400 font-bold">&darr; [TOKEN INTERSECTION = &empty;] &darr;</div>
                <div className="rounded border border-white/10 bg-white/5 p-2 text-white">
                  DOC: &ldquo;reducing path length between distant tokens&rdquo;
                </div>
                <div className="rounded border border-rose-500/40 bg-rose-500/15 p-2 text-rose-300 font-bold">
                  RESULT: MISSED OR REJECTED (ZERO LEXICAL OVERLAP)
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col gap-4 font-sans text-sm text-[#cbd5e1] leading-relaxed">
              <h3 className="font-mono text-lg font-bold text-white">
                Dense Semantic Representations in Continuous Vector Space
              </h3>
              <p>
                SYNAPSE ARCHIVE encodes both queries and academic document passages into a unified high-dimensional manifold (384-D).
              </p>
              <p>
                Even when words do not share a single character, their conceptual proximity is captured by the inner product of their normalized vectors:
              </p>
              <div className="rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/10 p-3 font-mono text-xs text-[#00f0ff]">
                similarity(q, d) = &Sigma;<sub>i</sub> q<sub>i</sub> &times; d<sub>i</sub> = 0.892 (HIGH AFFINITY)
              </div>
              <p className="text-[#8fa0b5]">
                By combining dense vector geometry with optional reciprocal rank lexical fusion, the system retrieves what you <em>mean</em>, not just what you <em>type</em>.
              </p>
            </div>

            {/* Visual Diagram */}
            <div className="rounded-2xl border border-[#00f0ff]/30 bg-black/60 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between font-mono text-xs text-[#00f0ff] border-b border-[#00f0ff]/20 pb-2">
                <span>SEMANTIC VECTOR PROJECTION SUCCESS</span>
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-3 font-mono text-xs text-center">
                <div className="rounded border border-[#00f0ff]/30 bg-[#00f0ff]/10 p-2 text-[#00f0ff]">
                  QUERY &rarr; 384-D UNIT VECTOR [0.124, -0.451, ...]
                </div>
                <div className="text-[#00f0ff] font-bold">&darr; [COSINE PROXIMITY SEARCH] &darr;</div>
                <div className="rounded border border-[#9d4edd]/30 bg-[#9d4edd]/10 p-2 text-[#9d4edd]">
                  DOC CHUNK &rarr; 384-D UNIT VECTOR [0.118, -0.442, ...]
                </div>
                <div className="rounded border border-emerald-500/40 bg-emerald-500/15 p-2 text-emerald-300 font-bold">
                  RESULT: TOP-RANKED MATCH (SIMILARITY: 0.892)
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ---------------- 10: ENGINEERING CHALLENGES OVERCOME ---------------- */}
      <section className="flex flex-col gap-6">
        <div>
          <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest glow-cyan">
            10 // PRODUCTION RIGOR
          </span>
          <h2 className="font-mono text-3xl font-bold text-white uppercase mt-1">
            ENGINEERING CHALLENGES OVERCOME
          </h2>
          <p className="font-sans text-xs text-[#8fa0b5] mt-1">
            Real academic document processing requires tackling edge cases that generic toy tutorials ignore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel rounded-xl p-5 border-l-2 border-l-[#00f0ff]">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-white mb-2">
              <BookOpen className="h-4 w-4 text-[#00f0ff]" />
              <span>ACADEMIC PDF PARSING &amp; SECTION RECOVERY</span>
            </div>
            <p className="font-sans text-xs text-[#8fa0b5] leading-relaxed">
              Academic two-column PDFs break reading order and inject hyphenated line breaks. Our ingestion pipeline cleans hyphenations, isolates running headers, and detects academic section boundaries (e.g. &ldquo;3.1 Scaled Dot-Product&rdquo;) to anchor chunk provenance.
            </p>
          </div>

          <div className="glass-panel rounded-xl p-5 border-l-2 border-l-[#9d4edd]">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-white mb-2">
              <Layers className="h-4 w-4 text-[#9d4edd]" />
              <span>CONTEXT DEGRADATION IN CHUNKING</span>
            </div>
            <p className="font-sans text-xs text-[#8fa0b5] leading-relaxed">
              Fixed-token slicing destroys semantic context when sentences are severed mid-clause. We implemented sentence-aware and section-aware chunkers with calibrated overlap windows, guaranteeing that propositions remain grammatically complete.
            </p>
          </div>

          <div className="glass-panel rounded-xl p-5 border-l-2 border-l-amber-500">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-white mb-2">
              <Cpu className="h-4 w-4 text-amber-400" />
              <span>EMBEDDING DIMENSION DISCOVERY</span>
            </div>
            <p className="font-sans text-xs text-[#8fa0b5] leading-relaxed">
              Never hardcoding dimensions: our modular EmbeddingProvider dynamically queries the active model&apos;s output layer at runtime, whether using 384-D MiniLM, 768-D BGE, or calibrated LSA subspace projectors, ensuring zero dimension mismatches.
            </p>
          </div>

          <div className="glass-panel rounded-xl p-5 border-l-2 border-l-emerald-500">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-white mb-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>RETRIEVAL QUALITY &amp; HYBRID RANKING</span>
            </div>
            <p className="font-sans text-xs text-[#8fa0b5] leading-relaxed">
              Nearest vector isn&apos;t automatically the best answer. We designed a dual scoring pipeline with configurable &alpha; and &beta; weights to seamlessly combine dense semantic embeddings with exact BM25 keyword matching and optional reciprocal rank reranking.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- 12: EVOLUTION & ROADMAP ---------------- */}
      <section className="flex flex-col gap-6">
        <div>
          <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest glow-cyan">
            12 // FUTURE HORIZONS
          </span>
          <h2 className="font-mono text-3xl font-bold text-white uppercase mt-1">
            SYSTEM EVOLUTION &amp; ROADMAP
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROADMAP_ITEMS.map((item) => {
            const isComplete = item.status === "COMPLETE";
            const isInProgress = item.status === "IN PROGRESS";

            return (
              <div
                key={item.id}
                className="glass-panel rounded-xl p-5 flex flex-col justify-between border-t-2"
                style={{
                  borderTopColor: isComplete ? "#00f0ff" : isInProgress ? "#9d4edd" : "#526075"
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 font-mono text-[10px]">
                    <span className="text-[#526075]">PHASE {item.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        isComplete
                          ? "bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30"
                          : isInProgress
                          ? "bg-[#9d4edd]/10 text-[#9d4edd] border border-[#9d4edd]/30"
                          : "bg-white/5 text-[#526075] border border-white/5"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h4 className="font-mono text-xs font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="font-sans text-xs text-[#8fa0b5] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
