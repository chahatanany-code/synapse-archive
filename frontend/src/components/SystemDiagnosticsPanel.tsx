"use client";

import React from "react";
import { X, Activity, Cpu, Database, HardDrive, CheckCircle2, AlertCircle } from "lucide-react";
import { SystemHealth, IndexStats } from "@/types";

interface SystemDiagnosticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  systemHealth?: SystemHealth;
  indexStats: IndexStats;
}

export const SystemDiagnosticsPanel: React.FC<SystemDiagnosticsPanelProps> = ({
  isOpen,
  onClose,
  systemHealth,
  indexStats
}) => {
  if (!isOpen) return null;

  const healthItems = [
    { name: "FASTAPI REST / WS SERVICE", status: systemHealth?.api || "ONLINE", icon: Activity },
    { name: "VECTOR SEARCH ENGINE", status: systemHealth?.vector_index || "READY", icon: Database },
    { name: "EMBEDDING ENGINE", status: systemHealth?.embedding_model || "LOADED", icon: Cpu },
    { name: "ACADEMIC DOCUMENT STORE", status: systemHealth?.document_store || "READY", icon: HardDrive }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative flex flex-col w-full max-w-2xl rounded-2xl border border-white/15 bg-[#080a0f] p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#00f0ff]" />
            <h2 className="font-mono text-sm uppercase tracking-widest text-white font-bold">
              SYNAPSE SYSTEM HEALTH &amp; TELEMETRY
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Health Indicators List */}
        <div className="mb-6 flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8fa0b5]">
            SUBSYSTEM STATUS INDICATORS
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {healthItems.map((item, idx) => {
              const isOk = item.status === "ONLINE" || item.status === "READY" || item.status === "LOADED";
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-white/5 bg-black/40 p-3 flex items-center justify-between font-mono text-xs"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-[#8fa0b5]" />
                    <span className="text-white text-[11px]">{item.name}</span>
                  </div>
                  <span
                    className={`flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded ${
                      isOk
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${isOk ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Index Diagnostics Grid (Section 24) */}
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#00f0ff] block mb-2">
            ARCHIVE INDEX DIAGNOSTICS
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="rounded-lg border border-white/5 bg-black/40 p-3">
              <span className="text-[9px] text-[#526075]">INDEXED PAPERS</span>
              <div className="text-white font-bold text-base mt-1">{indexStats.document_count} PAPERS</div>
            </div>

            <div className="rounded-lg border border-white/5 bg-black/40 p-3">
              <span className="text-[9px] text-[#526075]">CHUNKS &amp; NODES</span>
              <div className="text-[#00f0ff] font-bold text-base mt-1">{indexStats.vector_nodes} NODES</div>
            </div>

            <div className="rounded-lg border border-white/5 bg-black/40 p-3">
              <span className="text-[9px] text-[#526075]">EMBEDDING DIMENSION</span>
              <div className="text-[#9d4edd] font-bold text-base mt-1">{indexStats.embedding_dimension}-D</div>
            </div>

            <div className="rounded-lg border border-white/5 bg-black/40 p-3">
              <span className="text-[9px] text-[#526075]">INDEX SIZE</span>
              <div className="text-white font-bold text-base mt-1">{(indexStats.index_size_bytes / 1024).toFixed(1)} KB</div>
            </div>

            <div className="rounded-lg border border-white/5 bg-black/40 p-3">
              <span className="text-[9px] text-[#526075]">MEMORY RESIDENT</span>
              <div className="text-emerald-400 font-bold text-base mt-1">{indexStats.memory_mb} MB</div>
            </div>

            <div className="rounded-lg border border-white/5 bg-black/40 p-3">
              <span className="text-[9px] text-[#526075]">SIMILARITY METRIC</span>
              <div className="text-white font-bold text-xs mt-1">COSINE DOT PROD</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-white/10 flex justify-between font-mono text-[9px] text-[#526075]">
          <span>UPTIME: {systemHealth?.uptime_seconds || 120}s</span>
          <span>VERSION: 1.0.0-PROD</span>
        </div>
      </div>
    </div>
  );
};
