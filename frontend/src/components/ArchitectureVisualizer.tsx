"use client";

import React, { useState } from "react";
import { ARCHITECTURE_NODES } from "@/lib/constants";
import { ArrowDown, Cpu, Layers, Sparkles, X, CheckCircle, Info } from "lucide-react";

export const ArchitectureVisualizer: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("query_embedding");

  const activeNode = ARCHITECTURE_NODES.find(n => n.id === selectedNodeId) || ARCHITECTURE_NODES[0];

  const retrievalNodes = ARCHITECTURE_NODES.filter(n => n.category === "Retrieval Pipeline");
  const ingestionNodes = ARCHITECTURE_NODES.filter(n => n.category === "Ingestion Pipeline");

  return (
    <section id="architecture" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest glow-cyan">
          07 // SYSTEM DESIGN
        </span>
        <h2 className="font-mono text-3xl sm:text-4xl font-bold text-white uppercase mt-1">
          END-TO-END SYSTEM ARCHITECTURE
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#8fa0b5] mt-2 max-w-xl mx-auto">
          Dual asynchronous pipeline architecture: Continuous offline academic ingestion coupled with sub-millisecond online retrieval. Click any node to inspect engineering contracts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Flow Diagram */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Query & Retrieval Pipeline */}
          <div className="glass-panel-cyan rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-[#00f0ff]/20 pb-2">
              <span className="font-mono text-xs font-bold uppercase text-[#00f0ff]">
                ONLINE RETRIEVAL PIPELINE
              </span>
              <span className="font-mono text-[9px] text-[#8fa0b5]">SYNCHRONOUS // LOW LATENCY</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              {retrievalNodes.map((node, i) => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <React.Fragment key={node.id}>
                    <button
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`w-full rounded-xl p-3 border text-left transition-all duration-200 flex items-center justify-between ${
                        isSelected
                          ? "border-[#00f0ff] bg-[#00f0ff]/20 shadow-[0_0_20px_rgba(0,240,255,0.25)] text-white"
                          : "border-white/10 bg-black/40 text-[#8fa0b5] hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-white/10 font-mono text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <div>
                          <div className="font-mono text-xs font-bold text-white">{node.name}</div>
                          <div className="font-mono text-[9px] text-[#526075]">{node.tech}</div>
                        </div>
                      </div>
                      <span className="rounded bg-black/60 px-2 py-0.5 font-mono text-[9px] text-[#00f0ff] border border-white/5">
                        {node.status}
                      </span>
                    </button>
                    {i < retrievalNodes.length - 1 && (
                      <ArrowDown className="h-4 w-4 text-[#00f0ff]/60" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Offline Ingestion Pipeline */}
          <div className="glass-panel-violet rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-[#9d4edd]/20 pb-2">
              <span className="font-mono text-xs font-bold uppercase text-[#9d4edd]">
                OFFLINE INGESTION &amp; INDEXING PIPELINE
              </span>
              <span className="font-mono text-[9px] text-[#8fa0b5]">ASYNCHRONOUS BATCH</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              {ingestionNodes.map((node, i) => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <React.Fragment key={node.id}>
                    <button
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`w-full rounded-xl p-3 border text-left transition-all duration-200 flex items-center justify-between ${
                        isSelected
                          ? "border-[#9d4edd] bg-[#9d4edd]/20 shadow-[0_0_20px_rgba(157,78,221,0.25)] text-white"
                          : "border-white/10 bg-black/40 text-[#8fa0b5] hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-white/10 font-mono text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <div>
                          <div className="font-mono text-xs font-bold text-white">{node.name}</div>
                          <div className="font-mono text-[9px] text-[#526075]">{node.tech}</div>
                        </div>
                      </div>
                      <span className="rounded bg-black/60 px-2 py-0.5 font-mono text-[9px] text-[#9d4edd] border border-white/5">
                        {node.status}
                      </span>
                    </button>
                    {i < ingestionNodes.length - 1 && (
                      <ArrowDown className="h-4 w-4 text-[#9d4edd]/60" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Component Specification Inspector */}
        <div className="lg:col-span-5 sticky top-24 glass-panel rounded-2xl p-6 border-l-4 border-l-[#00f0ff]">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <span className="font-mono text-xs font-bold text-[#00f0ff] uppercase tracking-wider">
              COMPONENT SPECIFICATION
            </span>
            <span className="font-mono text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              {activeNode.status}
            </span>
          </div>

          <h3 className="font-mono text-xl font-bold text-white mb-1">
            {activeNode.name}
          </h3>
          <span className="font-mono text-[10px] text-[#9d4edd] block mb-4">
            CATEGORY: {activeNode.category.toUpperCase()}
          </span>

          <div className="flex flex-col gap-4 font-mono text-xs">
            <div>
              <span className="text-[10px] text-[#526075] uppercase block mb-1">PURPOSE</span>
              <p className="font-sans text-xs text-[#cbd5e1] leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5">
                {activeNode.purpose}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-[#526075] uppercase block mb-1">INPUT CONTRACT</span>
              <p className="text-[11px] text-white/90 bg-black/40 p-2.5 rounded-lg border border-white/5">
                {activeNode.input}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-[#526075] uppercase block mb-1">OUTPUT CONTRACT</span>
              <p className="text-[11px] text-[#00f0ff] bg-black/40 p-2.5 rounded-lg border border-white/5">
                {activeNode.output}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-[#526075] uppercase block mb-1">UNDERLYING TECHNOLOGY</span>
              <p className="text-[11px] text-[#9d4edd] font-bold bg-black/40 p-2.5 rounded-lg border border-white/5">
                {activeNode.tech}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
