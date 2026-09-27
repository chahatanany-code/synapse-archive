"use client";

import React from "react";
import { Sparkles, Terminal, Code2, Globe } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#050608] py-12 px-4 sm:px-6 lg:px-8 font-mono text-xs text-[#526075]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2 text-white font-bold tracking-wider">
            <Sparkles className="h-4 w-4 text-[#00f0ff]" />
            <span>SYNAPSE ARCHIVE // ACADEMIC RETRIEVAL ENGINE</span>
          </div>
          <p className="text-[11px] text-[#8fa0b5]">
            Engineered as an advanced portfolio system for intelligent semantic document navigation.
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px]">
          <span className="rounded bg-white/5 border border-white/5 px-2 py-1 text-white/70">
            FASTAPI / PYTHON 3.12
          </span>
          <span className="rounded bg-white/5 border border-white/5 px-2 py-1 text-white/70">
            384-D UNIT VECTORS
          </span>
          <span className="rounded bg-white/5 border border-white/5 px-2 py-1 text-[#00f0ff]">
            COSINE DOT PRODUCT
          </span>
          <span className="rounded bg-white/5 border border-white/5 px-2 py-1 text-[#9d4edd]">
            THREE.JS WEBGL
          </span>
          <span className="rounded bg-white/5 border border-white/5 px-2 py-1 text-white/70">
            NEXT.JS / TYPESCRIPT
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px]">
        <span>&copy; {new Date().getFullYear()} SYNAPSE ARCHIVE. ALL MATHEMATICAL RETRIEVAL RIGHTS RESERVED.</span>
        <span className="text-[#00f0ff]">SEARCH FOR CONCEPTS, NOT JUST WORDS.</span>
      </div>
    </footer>
  );
};
