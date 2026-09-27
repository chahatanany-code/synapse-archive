"use client";

import React, { useState, useRef } from "react";
import { X, Terminal, UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { uploadDocument } from "@/lib/api";

interface IngestionConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentIngested?: () => void;
}

interface IngestionLogItem {
  timestamp: string;
  step: string;
  message: string;
  status: "START" | "PROGRESS" | "SUCCESS" | "ERROR" | "INFO";
}

export const IngestionConsoleModal: React.FC<IngestionConsoleModalProps> = ({
  isOpen,
  onClose,
  onDocumentIngested
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [chunkSize, setChunkSize] = useState(450);
  const [chunkOverlap, setChunkOverlap] = useState(80);
  const [isUploading, setIsUploading] = useState(false);
  const [logs, setLogs] = useState<IngestionLogItem[]>([
    { timestamp: "19:50:01.104", step: "SYSTEM_BOOT", message: "Synapse Ingestion Subsystem online", status: "INFO" },
    { timestamp: "19:50:01.420", step: "INDEX_READY", message: "Inverted cosine vector store mounted", status: "SUCCESS" }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const addLog = (step: string, message: string, status: IngestionLogItem["status"]) => {
    const now = new Date();
    const ts = now.toTimeString().split(" ")[0] + "." + String(now.getMilliseconds()).padStart(3, "0");
    setLogs(prev => [...prev, { timestamp: ts, step, message, status }]);
  };

  const handleStartIngestion = async () => {
    if (!file) return;
    setIsUploading(true);

    addLog("UPLOAD_START", `Submitting '${file.name}' (${(file.size / 1024).toFixed(1)} KB)...`, "START");
    
    try {
      addLog("PARSER_INIT", "Extracting text pages & detecting section headings...", "PROGRESS");
      const res = await uploadDocument(file, chunkSize, chunkOverlap);
      addLog("CHUNKING_DONE", `Generated ${res.chunk_count} semantic chunks with overlap=${chunkOverlap}`, "PROGRESS");
      addLog("EMBEDDING", `Encoded vectors via ${res.embedding_model} (${res.embedding_dimension}-D)`, "PROGRESS");
      addLog("INDEX_UPDATE", `Normalized dot-product index updated successfully`, "SUCCESS");
      addLog("COMPLETE", `Document '${res.title}' indexed into live archive!`, "SUCCESS");
      
      setFile(null);
      if (onDocumentIngested) onDocumentIngested();
    } catch (err: any) {
      addLog("ERROR", `Ingestion failure: ${err?.message || "Connection error"}`, "ERROR");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative flex flex-col w-full max-w-3xl h-[80vh] rounded-2xl border border-white/15 bg-[#080a0f] shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-black/60 px-6 py-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-[#00f0ff]" />
            <span className="font-mono text-xs uppercase tracking-widest text-white font-bold">
              INGESTION TERMINAL // LIVE EVENT TELEMETRY
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Ingestion Config & File Dropzone */}
        <div className="p-6 border-b border-white/10 bg-black/40 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File Picker */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-xl border border-dashed border-[#00f0ff]/40 bg-[#00f0ff]/5 p-4 flex flex-col items-center justify-center gap-2 text-center hover:bg-[#00f0ff]/10 transition-all"
          >
            <UploadCloud className="h-6 w-6 text-[#00f0ff]" />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="font-mono text-xs text-white">
                <span className="text-[#00f0ff] font-bold">{file.name}</span>
                <span className="block text-[10px] text-[#8fa0b5]">
                  {(file.size / 1024).toFixed(1)} KB • CLICK TO CHANGE
                </span>
              </div>
            ) : (
              <div className="font-mono text-xs text-[#8fa0b5]">
                <span className="text-white font-bold">SELECT ACADEMIC FILE</span>
                <span className="block text-[10px] text-[#526075]">SUPPORT: PDF, TXT, MD (MAX 25MB)</span>
              </div>
            )}
          </div>

          {/* Chunk Parameters & Run */}
          <div className="flex flex-col justify-between gap-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-[#8fa0b5] mb-1">
                <span>CHUNK SIZE: <strong className="text-white">{chunkSize} chars</strong></span>
                <span>OVERLAP: <strong className="text-[#9d4edd]">{chunkOverlap} chars</strong></span>
              </div>
              <input
                type="range"
                min="200"
                max="800"
                step="50"
                value={chunkSize}
                onChange={(e) => setChunkSize(parseInt(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-black/60 accent-[#00f0ff] mb-2"
              />
              <input
                type="range"
                min="20"
                max="150"
                step="10"
                value={chunkOverlap}
                onChange={(e) => setChunkOverlap(parseInt(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-black/60 accent-[#9d4edd]"
              />
            </div>

            <button
              onClick={handleStartIngestion}
              disabled={!file || isUploading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#00f0ff] py-2.5 font-mono text-xs font-bold text-black uppercase tracking-wider hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>PARSING &amp; VECTORIZING...</span>
                </>
              ) : (
                <span>INGEST INTO VECTOR SPACE &rarr;</span>
              )}
            </button>
          </div>
        </div>

        {/* Live Terminal Output Console */}
        <div className="flex-1 bg-[#050608] p-4 font-mono text-xs overflow-y-auto flex flex-col gap-1.5 select-text">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-[#526075] whitespace-nowrap">[{log.timestamp}]</span>
              <span
                className={`font-bold whitespace-nowrap ${
                  log.status === "SUCCESS"
                    ? "text-emerald-400"
                    : log.status === "ERROR"
                    ? "text-rose-400"
                    : log.status === "START"
                    ? "text-[#00f0ff]"
                    : "text-[#9d4edd]"
                }`}
              >
                {log.step}:
              </span>
              <span className="text-[#cbd5e1]">{log.message}</span>
            </div>
          ))}
          {isUploading && (
            <div className="flex items-center gap-2 text-[#00f0ff] animate-pulse">
              <span className="h-2 w-2 rounded-full bg-[#00f0ff]" />
              <span>Awaiting worker stream...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
