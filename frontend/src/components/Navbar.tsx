"use client";

import React from "react";
import { Terminal, Database, Bookmark, Activity, Sparkles } from "lucide-react";
import { SystemHealth } from "@/types";

interface NavbarProps {
  isLive: boolean;
  systemHealth?: SystemHealth;
  embeddingModel: string;
  vectorNodesCount: number;
  onOpenIngestion: () => void;
  onOpenVault: () => void;
  onOpenDiagnostics: () => void;
  vaultCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  isLive,
  systemHealth,
  embeddingModel,
  vectorNodesCount,
  onOpenIngestion,
  onOpenVault,
  onOpenDiagnostics,
  vaultCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#07080b]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#00f0ff]/40 bg-[#00f0ff]/10 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="h-4 w-4 text-[#00f0ff]" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#00f0ff] animate-ping" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-black tracking-widest text-white group-hover:text-[#00f0ff] transition-colors">
                SYNAPSE<span className="text-[#00f0ff]">.</span>ARCHIVE
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#8fa0b5]">
                SEMANTIC VECTOR RETRIEVAL
              </span>
            </div>
          </a>

          {/* Live vs Demo Badge */}
          <div className="hidden sm:flex items-center ml-4">
            {isLive ? (
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE INDEX ({vectorNodesCount} NODES)
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                △ DEMO MODE ({vectorNodesCount} NODES)
              </div>
            )}
          </div>
        </div>

        {/* Center Nav Anchors */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs text-[#8fa0b5]">
          <a href="#dither-veil" className="hover:text-[#00f0ff] transition-colors text-[#00f0ff]">
            00 // DITHER VEIL
          </a>
          <a href="#search-studio" className="hover:text-[#00f0ff] transition-colors">
            01 // SEARCH
          </a>
          <a href="#semantic-universe" className="hover:text-[#00f0ff] transition-colors">
            02 // 3D UNIVERSE
          </a>
          <a href="#semantic-map" className="hover:text-[#00f0ff] transition-colors">
            03 // SEMANTIC MAP
          </a>
          <a href="#architecture" className="hover:text-[#00f0ff] transition-colors">
            04 // ARCHITECTURE
          </a>
          <a href="#benchmarks" className="hover:text-[#00f0ff] transition-colors">
            05 // BENCHMARKS
          </a>
        </nav>

        {/* Right Tools & Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Ingestion Console Button */}
          <button
            onClick={onOpenIngestion}
            className="flex items-center gap-1.5 rounded border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-white/80 hover:border-[#00f0ff]/40 hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] transition-all"
            title="Open Document Ingestion Console"
          >
            <Terminal className="h-3.5 w-3.5 text-[#00f0ff]" />
            <span className="hidden sm:inline">INGESTION</span>
          </button>

          {/* Research Vault Button */}
          <button
            onClick={onOpenVault}
            className="relative flex items-center gap-1.5 rounded border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-white/80 hover:border-[#9d4edd]/50 hover:bg-[#9d4edd]/10 hover:text-[#9d4edd] transition-all"
            title="Open Research Vault"
          >
            <Bookmark className="h-3.5 w-3.5 text-[#9d4edd]" />
            <span className="hidden sm:inline">VAULT</span>
            {vaultCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#9d4edd] font-mono text-[9px] font-bold text-white">
                {vaultCount}
              </span>
            )}
          </button>

          {/* Diagnostics Button */}
          <button
            onClick={onOpenDiagnostics}
            className="flex items-center gap-1.5 rounded border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-white/80 hover:border-[#00f0ff]/40 hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] transition-all"
            title="System Diagnostics & Telemetry"
          >
            <Activity className="h-3.5 w-3.5 text-[#00f0ff]" />
            <span className="hidden lg:inline">SYSTEM</span>
          </button>
        </div>
      </div>
    </header>
  );
};
