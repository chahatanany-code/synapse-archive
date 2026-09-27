"use client";

import React, { useState } from "react";
import { SavedResearchItem } from "@/types";
import { Bookmark, Clock, Folder, Trash2, Download, Copy, Check, X, ArrowUpRight } from "lucide-react";

interface ResearchVaultProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedResearchItem[];
  onRemoveItem: (id: string) => void;
  queryHistory: string[];
  onSelectHistoricalQuery: (query: string) => void;
}

export const ResearchVault: React.FC<ResearchVaultProps> = ({
  isOpen,
  onClose,
  savedItems,
  onRemoveItem,
  queryHistory,
  onSelectHistoricalQuery
}) => {
  const [activeTab, setActiveTab] = useState<"passages" | "history">("passages");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExportBibtex = () => {
    const bibtex = savedItems
      .map((item, idx) => `@article{synapse_${item.chunk_id.replace(/\W/g, "")},\n  title={${item.title}},\n  note={Passage: ${item.text.slice(0, 100)}...},\n  page={${item.page}},\n  year={2024}\n}`)
      .join("\n\n");
    navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-md">
      <div className="relative flex flex-col w-full max-w-md h-full bg-[#080a0f] border-l border-white/10 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-[#9d4edd]" />
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
              RESEARCH VAULT &amp; MEMORY
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg border border-white/10 bg-black/40 p-1 mb-4 font-mono text-xs">
          <button
            onClick={() => setActiveTab("passages")}
            className={`flex-1 rounded py-1.5 transition-all ${
              activeTab === "passages"
                ? "bg-[#9d4edd]/20 text-[#9d4edd] font-bold border border-[#9d4edd]/40"
                : "text-[#8fa0b5] hover:text-white"
            }`}
          >
            SAVED PASSAGES ({savedItems.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 rounded py-1.5 transition-all ${
              activeTab === "history"
                ? "bg-[#00f0ff]/20 text-[#00f0ff] font-bold border border-[#00f0ff]/40"
                : "text-[#8fa0b5] hover:text-white"
            }`}
          >
            QUERY HISTORY ({queryHistory.length})
          </button>
        </div>

        {/* Tab 1: Saved Passages */}
        {activeTab === "passages" ? (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
              {savedItems.length === 0 ? (
                <div className="py-20 text-center font-mono text-xs text-[#526075]">
                  NO RESEARCH PASSAGES BOOKMARKED YET. CLICK THE BOOKMARK ICON ON ANY RETRIEVAL RESULT.
                </div>
              ) : (
                savedItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/10 bg-black/40 p-3.5 flex flex-col gap-2 relative group hover:border-[#9d4edd]/40 transition-all"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#8fa0b5]">
                      <span className="text-[#9d4edd] font-bold">PAGE {item.page}</span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#526075] hover:text-rose-400 p-1 transition-colors"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="font-sans text-xs font-bold text-white line-clamp-1">
                      {item.title}
                    </div>

                    <p className="font-sans text-xs text-[#8fa0b5] line-clamp-3 bg-white/[0.02] p-2 rounded">
                      &ldquo;{item.text}&rdquo;
                    </p>

                    <div className="font-mono text-[9px] text-[#526075]">
                      CHUNK #{item.chunk_id.slice(-6)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {savedItems.length > 0 && (
              <div className="pt-4 border-t border-white/10 mt-2">
                <button
                  onClick={handleExportBibtex}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#9d4edd]/40 bg-[#9d4edd]/10 py-2.5 font-mono text-xs text-[#9d4edd] hover:bg-[#9d4edd] hover:text-white transition-all"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? "COPIED BIBTEX CITATIONS" : "EXPORT CITATIONS (BIBTEX)"}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Tab 2: Historical Queries */
          <div className="flex-1 overflow-y-auto flex flex-col gap-2">
            {queryHistory.length === 0 ? (
              <div className="py-20 text-center font-mono text-xs text-[#526075]">
                NO SEARCH QUERIES EXECUTED YET.
              </div>
            ) : (
              queryHistory.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectHistoricalQuery(q);
                    onClose();
                  }}
                  className="w-full text-left rounded-lg border border-white/5 bg-black/40 p-3 hover:border-[#00f0ff]/40 hover:bg-[#00f0ff]/5 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 font-sans text-xs text-[#cbd5e1] group-hover:text-[#00f0ff]">
                    <Clock className="h-3.5 w-3.5 text-[#526075] group-hover:text-[#00f0ff]" />
                    <span className="line-clamp-2">{q}</span>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#526075] group-hover:text-[#00f0ff] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
