"use client";

import React from "react";
import { ArrowDown, Cpu, Layers, Network, Zap } from "lucide-react";

interface HeroSectionProps {
  vectorNodesCount: number;
  dimension: number;
  embeddingModel: string;
  isLive: boolean;
  onEnterArchive: () => void;
  onExploreArchitecture: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  vectorNodesCount,
  dimension,
  embeddingModel,
  isLive,
  onEnterArchive,
  onExploreArchitecture
}) => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-center pt-16 pb-12 overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.08)_0%,rgba(157,78,221,0.04)_50%,transparent_75%)] blur-3xl" />

      {/* Narrative Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/5 px-3.5 py-1 mb-6 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-[#00f0ff] animate-ping" />
        <span className="font-mono text-[11px] uppercase tracking-widest text-[#00f0ff] glow-cyan">
          01 // INFORMATION RETRIEVAL ENGINE
        </span>
      </div>

      {/* Main Hero Title */}
      <h1 className="max-w-5xl font-mono text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase mb-4 leading-none">
        SYNAPSE <br className="sm:hidden" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00f0ff] to-[#9d4edd]">
          ARCHIVE
        </span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl font-mono text-xs sm:text-sm tracking-[0.25em] text-[#00f0ff] uppercase mb-6 glow-cyan">
        SEMANTIC VECTOR SEARCH FOR HUMAN KNOWLEDGE
      </p>

      {/* Supporting Text */}
      <p className="max-w-2xl text-base sm:text-lg text-[#8fa0b5] font-light leading-relaxed mb-10">
        Search academic knowledge by meaning, context, and conceptual relationships rather than exact keywords alone.
        Navigating beyond the lexical bottleneck into continuous representation space.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 z-10">
        <button
          onClick={onEnterArchive}
          className="group relative inline-flex items-center justify-center rounded-lg border border-[#00f0ff] bg-[#00f0ff]/10 px-8 py-3.5 font-mono text-xs font-bold tracking-widest text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:bg-[#00f0ff] hover:text-black transition-all duration-300"
        >
          <span>ENTER ARCHIVE</span>
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>

        <button
          onClick={onExploreArchitecture}
          className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-7 py-3.5 font-mono text-xs tracking-widest text-white/80 hover:border-white/30 hover:bg-white/10 transition-all duration-200"
        >
          EXPLORE ARCHITECTURE
        </button>
      </div>

      {/* Real Live Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl w-full">
        <div className="glass-panel rounded-lg p-3 text-left border-l-2 border-l-[#00f0ff]">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#8fa0b5] mb-1">
            <Network className="h-3 w-3 text-[#00f0ff]" />
            <span>INDEXED NODES</span>
          </div>
          <div className="font-mono text-lg font-bold text-white">
            {vectorNodesCount} <span className="text-[10px] font-normal text-[#8fa0b5]">CHUNKS</span>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-3 text-left border-l-2 border-l-[#9d4edd]">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#8fa0b5] mb-1">
            <Cpu className="h-3 w-3 text-[#9d4edd]" />
            <span>REPRESENTATION</span>
          </div>
          <div className="font-mono text-lg font-bold text-white">
            {dimension}-D <span className="text-[10px] font-normal text-[#8fa0b5]">DENSE</span>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-3 text-left border-l-2 border-l-[#00f0ff]">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#8fa0b5] mb-1">
            <Layers className="h-3 w-3 text-[#00f0ff]" />
            <span>SIMILARITY METRIC</span>
          </div>
          <div className="font-mono text-lg font-bold text-white">
            COSINE <span className="text-[10px] font-normal text-[#8fa0b5]">INNER PROD</span>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-3 text-left border-l-2 border-l-emerald-500">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#8fa0b5] mb-1">
            <Zap className="h-3 w-3 text-emerald-400" />
            <span>SYSTEM STATE</span>
          </div>
          <div className="font-mono text-lg font-bold text-emerald-400">
            {isLive ? "LIVE CONNECTED" : "LOCAL DEMO"}
          </div>
        </div>
      </div>

      {/* Down indicator */}
      <div className="mt-12 flex flex-col items-center gap-1 animate-bounce opacity-60">
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#8fa0b5]">SCROLL TO QUERY</span>
        <ArrowDown className="h-3.5 w-3.5 text-[#00f0ff]" />
      </div>
    </section>
  );
};
