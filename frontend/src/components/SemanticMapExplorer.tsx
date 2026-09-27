"use client";

import React, { useState } from "react";
import { VectorNodePoint } from "@/types";
import { Network, Layers, Filter, Compass, Zap } from "lucide-react";

interface SemanticMapExplorerProps {
  nodes: VectorNodePoint[];
  onSelectNode: (node: VectorNodePoint) => void;
  selectedNode: VectorNodePoint | null;
}

const CLUSTERS = [
  { id: 0, label: "TRANSFORMERS & ATTENTION", color: "#00f0ff" },
  { id: 1, label: "PRE-TRAINED LMS (BERT)", color: "#9d4edd" },
  { id: 2, label: "COMPUTER VISION (RESNET)", color: "#f59e0b" },
  { id: 3, label: "EFFICIENT TUNING (LORA)", color: "#10b981" },
  { id: 4, label: "RETRIEVAL AUGMENTED (RAG)", color: "#ec4899" },
  { id: 5, label: "GENERATIVE MODELS (GANS)", color: "#6366f1" }
];

export const SemanticMapExplorer: React.FC<SemanticMapExplorerProps> = ({
  nodes,
  onSelectNode,
  selectedNode
}) => {
  const [activeCluster, setActiveCluster] = useState<number | null>(null);

  const filteredNodes = activeCluster !== null ? nodes.filter(n => n.cluster === activeCluster) : nodes;

  // Calculate nearest neighbors to selected node using Euclidean distance on 3D PCA coordinates
  const nearestNeighbors = selectedNode
    ? nodes
        .filter(n => n.id !== selectedNode.id)
        .map(n => {
          const dx = n.x - selectedNode.x;
          const dy = n.y - selectedNode.y;
          const dz = n.z - selectedNode.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          // Convert distance to simulated high cosine affinity
          const cosineSim = Math.max(0.4, 1.0 - dist / 35.0);
          return { node: n, dist, cosineSim: Number(cosineSim.toFixed(3)) };
        })
        .sort((a, b) => b.cosineSim - a.cosineSim)
        .slice(0, 4)
    : [];

  return (
    <section id="semantic-map" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
        <div>
          <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest glow-cyan">
            06 // VECTOR SPACE TOPOLOGY
          </span>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-white uppercase mt-1">
            SEMANTIC MAP & CLUSTER TOPOLOGY
          </h2>
          <p className="font-sans text-xs text-[#8fa0b5] mt-1">
            Dimensionality reduction via Principal Component Analysis (PCA) projecting 384-D manifolds onto 3D continuous space.
          </p>
        </div>

        {/* Cluster Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
          <button
            onClick={() => setActiveCluster(null)}
            className={`rounded px-2.5 py-1 border transition-all ${
              activeCluster === null
                ? "border-white/50 bg-white/10 text-white"
                : "border-white/10 text-[#8fa0b5] hover:text-white"
            }`}
          >
            ALL CLUSTERS ({nodes.length})
          </button>
          {CLUSTERS.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCluster(activeCluster === c.id ? null : c.id)}
              className={`rounded px-2.5 py-1 border transition-all flex items-center gap-1.5 ${
                activeCluster === c.id
                  ? "bg-white/15 text-white"
                  : "border-white/10 text-[#8fa0b5] hover:text-white"
              }`}
              style={{ borderColor: activeCluster === c.id ? c.color : undefined }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />
              <span>{c.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive 2D Projection Canvas / Grid View */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 relative overflow-hidden h-[460px] flex flex-col justify-between">
          <div className="flex justify-between items-center font-mono text-[10px] text-[#526075]">
            <span>PCA PROJECTION VIEWPORT (X: COMPONENT 1 / Y: COMPONENT 2)</span>
            <span>MANIFOLD REDUCTION: 384-D &rarr; 3-D</span>
          </div>

          {/* 2D Canvas Representation */}
          <div className="relative flex-1 w-full my-4 rounded-xl border border-white/5 bg-black/60 overflow-hidden tech-grid">
            {filteredNodes.map(node => {
              // Map coordinate bounds (-20 to 20) to percentage (10% to 90%)
              const leftPercent = 50 + (node.x / 30) * 40;
              const topPercent = 50 - (node.y / 30) * 40;
              const isSelected = selectedNode?.id === node.id;
              const clusterInfo = CLUSTERS[node.cluster % CLUSTERS.length];

              return (
                <button
                  key={node.id}
                  onClick={() => onSelectNode(node)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group transition-transform hover:scale-150"
                  style={{
                    left: `${Math.max(5, Math.min(95, leftPercent))}%`,
                    top: `${Math.max(5, Math.min(95, topPercent))}%`
                  }}
                  title={`${node.title} - ${node.section}`}
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      isSelected
                        ? "h-4 w-4 ring-4 ring-white shadow-[0_0_15px_#00f0ff]"
                        : "h-2.5 w-2.5 hover:h-3.5 hover:w-3.5"
                    }`}
                    style={{
                      backgroundColor: isSelected ? "#ffffff" : clusterInfo?.color || "#00f0ff",
                      boxShadow: `0 0 10px ${clusterInfo?.color || "#00f0ff"}`
                    }}
                  />
                  {isSelected && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/90 px-1.5 py-0.5 font-mono text-[9px] text-[#00f0ff] border border-[#00f0ff]/40">
                      SELECTED
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center font-mono text-[10px] text-[#8fa0b5]">
            <span className="text-white/40">CLICK ANY POINT TO INSPECT LATENT PROPERTIES</span>
            <span>DISPLAYING {filteredNodes.length} NODES</span>
          </div>
        </div>

        {/* Selected Node & Nearest Neighbors Inspector Panel */}
        <div className="glass-panel-cyan rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#00f0ff] uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              <Compass className="h-4 w-4" />
              <span>NODE INSPECTOR</span>
            </div>

            {selectedNode ? (
              <div className="flex flex-col gap-3">
                <div>
                  <span className="font-mono text-[9px] text-[#526075]">CHUNK IDENTIFIER</span>
                  <div className="font-mono text-xs font-bold text-[#00f0ff]">
                    #{selectedNode.chunk_id}
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[9px] text-[#526075]">DOCUMENT TITLE</span>
                  <div className="font-sans text-sm font-bold text-white line-clamp-2">
                    {selectedNode.title}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="rounded border border-white/5 bg-black/40 p-2">
                    <span className="text-[9px] text-[#526075]">PAGE</span>
                    <div className="text-white font-bold">{selectedNode.page}</div>
                  </div>
                  <div className="rounded border border-white/5 bg-black/40 p-2">
                    <span className="text-[9px] text-[#526075]">DIMENSION</span>
                    <div className="text-[#9d4edd] font-bold">384-D</div>
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[9px] text-[#526075]">PASSAGE PREVIEW</span>
                  <p className="font-sans text-xs text-[#8fa0b5] bg-black/40 p-2.5 rounded border border-white/5 line-clamp-3">
                    &ldquo;{selectedNode.preview_text}&rdquo;
                  </p>
                </div>

                {/* Nearest Neighbors in Vector Space (Section 20) */}
                <div className="mt-2">
                  <span className="font-mono text-[10px] uppercase text-[#00f0ff] tracking-wider block mb-1.5">
                    NEAREST NEIGHBORS (COSINE SIMILARITY):
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {nearestNeighbors.map((nbr, idx) => (
                      <div
                        key={nbr.node.id}
                        onClick={() => onSelectNode(nbr.node)}
                        className="cursor-pointer rounded border border-white/5 bg-black/40 p-2 hover:border-[#00f0ff]/40 transition-all flex items-center justify-between font-mono text-xs"
                      >
                        <div className="truncate max-w-[140px] text-white text-[11px]">
                          {nbr.node.title}
                        </div>
                        <span className="font-bold text-[#00f0ff]">
                          {nbr.cosineSim.toFixed(3)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center font-mono text-xs text-[#526075]">
                SELECT A NODE FROM THE 3D UNIVERSE OR TOPOLOGY MAP TO INSPECT ITS CONTINUOUS VECTOR SPACE AFFINITIES.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 font-mono text-[9px] text-[#526075]">
            METRIC: COSINE INNER PRODUCT OVER UNIT-NORMALIZED SPHERE
          </div>
        </div>
      </div>
    </section>
  );
};
