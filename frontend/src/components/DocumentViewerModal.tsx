"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, Check, Copy } from "lucide-react";
import { fetchDocumentDetails } from "@/lib/api";

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string | null;
  initialPage: number;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentId,
  initialPage = 1
}) => {
  const [docData, setDocData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && documentId) {
      setCurrentPage(initialPage);
      fetchDocumentDetails(documentId).then(setDocData);
    }
  }, [isOpen, documentId, initialPage]);

  if (!isOpen || !docData) return null;

  const metadata = docData.metadata || {};
  const pages = docData.pages || [];
  const totalPages = pages.length || metadata.page_count || 1;
  const pageIndex = Math.min(Math.max(0, currentPage - 1), pages.length - 1);
  const currentPageData = pages[pageIndex] || { sections: [] };

  const handleCopyCitation = () => {
    const citation = `${metadata.authors?.join(", ") || "Authors"}. "${metadata.title}." ${metadata.source || "Academic Archive"} (2024).`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative flex flex-col w-full max-w-5xl h-[88vh] rounded-2xl border border-white/15 bg-[#080a0f] shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header Strip */}
        <div className="flex items-center justify-between border-b border-white/10 bg-black/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/10">
              <FileText className="h-5 w-5 text-[#00f0ff]" />
            </div>
            <div>
              <h2 className="font-sans text-base font-bold text-white line-clamp-1">
                {metadata.title}
              </h2>
              <div className="flex items-center gap-2 font-mono text-[10px] text-[#8fa0b5]">
                <span>VENUE: {metadata.source || "RESEARCH PAPER"}</span>
                <span>•</span>
                <span>AUTHORS: {metadata.authors?.slice(0, 3).join(", ") || "Academic Research Group"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyCitation}
              className="flex items-center gap-1.5 rounded border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-[#8fa0b5] hover:border-white/30 hover:text-white transition-all"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "COPIED" : "CITATION"}</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Sidebar + Main Reading Document Page */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Reading Pane */}
          <div className="flex-1 flex flex-col bg-[#050608] overflow-y-auto p-8 border-r border-white/10">
            {/* Academic Paper Page Sheet Mockup */}
            <div
              className="mx-auto max-w-2xl w-full rounded-lg border border-white/10 bg-[#0c1017] p-8 shadow-2xl transition-all"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
            >
              <div className="border-b border-white/10 pb-4 mb-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#00f0ff]">
                  ACADEMIC RETRIEVAL // DOCUMENT GROUNDING
                </span>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                  {metadata.title}
                </h1>
                <p className="font-sans text-xs text-[#8fa0b5] mt-2 italic">
                  {metadata.authors?.join(", ") || "Research Authors"}
                </p>
              </div>

              {/* Sections on Page */}
              <div className="flex flex-col gap-6 font-serif text-sm text-[#cbd5e1] leading-relaxed">
                {currentPageData.sections && currentPageData.sections.length > 0 ? (
                  currentPageData.sections.map((sec: [string, string], idx: number) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#9d4edd] border-l-2 border-[#9d4edd] pl-2">
                        {sec[0]}
                      </h3>
                      <p className="text-justify font-sans text-sm text-[#94a3b8] leading-relaxed bg-white/[0.02] p-3 rounded border border-white/5">
                        {sec[1]}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="font-sans text-sm text-[#8fa0b5]">
                    No parsed text available on this page index.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Metadata & Provenance Sidebar */}
          <div className="hidden lg:flex w-72 flex-col gap-4 border-l border-white/10 bg-[#090b10] p-6 font-mono text-xs text-[#8fa0b5] overflow-y-auto">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#00f0ff]">DOCUMENT PROVENANCE</span>
              <div className="mt-3 flex flex-col gap-2.5">
                <div className="rounded border border-white/5 bg-black/40 p-2.5">
                  <div className="text-[9px] text-[#526075]">DOCUMENT ID</div>
                  <div className="text-white text-[11px] truncate">{metadata.document_id}</div>
                </div>
                <div className="rounded border border-white/5 bg-black/40 p-2.5">
                  <div className="text-[9px] text-[#526075]">TOTAL PAGES</div>
                  <div className="text-white font-bold">{totalPages} PAGES</div>
                </div>
                <div className="rounded border border-white/5 bg-black/40 p-2.5">
                  <div className="text-[9px] text-[#526075]">CHUNKS GENERATED</div>
                  <div className="text-white font-bold">{metadata.chunk_count || 8} CHUNKS</div>
                </div>
                <div className="rounded border border-white/5 bg-black/40 p-2.5">
                  <div className="text-[9px] text-[#526075]">EMBEDDING MODEL</div>
                  <div className="text-[#00f0ff] font-bold text-[11px] truncate">{metadata.embedding_model}</div>
                </div>
                <div className="rounded border border-white/5 bg-black/40 p-2.5">
                  <div className="text-[9px] text-[#526075]">REPRESENTATION DIM</div>
                  <div className="text-[#9d4edd] font-bold">{metadata.embedding_dimension || 384}-D DENSE</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between border-t border-white/10 bg-black/60 px-6 py-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2.5 py-1 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>PREV PAGE</span>
            </button>

            <span className="text-[#8fa0b5]">
              PAGE <strong className="text-white">{currentPage}</strong> OF <strong className="text-white">{totalPages}</strong>
            </span>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2.5 py-1 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
            >
              <span>NEXT PAGE</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#526075]">ZOOM:</span>
            <button
              onClick={() => setZoomLevel(Math.max(70, zoomLevel - 10))}
              className="rounded border border-white/10 bg-white/5 p-1 text-white hover:bg-white/10"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="text-white">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(140, zoomLevel + 10))}
              className="rounded border border-white/10 bg-white/5 p-1 text-white hover:bg-white/10"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
