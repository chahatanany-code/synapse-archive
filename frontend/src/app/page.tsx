"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ThreeSemanticUniverse } from "@/components/ThreeSemanticUniverse";
import { SearchStudio } from "@/components/SearchStudio";
import { SearchResults } from "@/components/SearchResults";
import { SemanticMapExplorer } from "@/components/SemanticMapExplorer";
import { ArchitectureVisualizer } from "@/components/ArchitectureVisualizer";
import { StorytellingSections } from "@/components/StorytellingSections";
import { BenchmarkAndEvaluationSuite } from "@/components/BenchmarkAndEvaluationSuite";
import { FinalVisualMoment } from "@/components/FinalVisualMoment";
import { Footer } from "@/components/Footer";
import { CustomCursor, CursorState } from "@/components/CustomCursor";
import { DocumentViewerModal } from "@/components/DocumentViewerModal";
import { WhyThisResultModal } from "@/components/WhyThisResultModal";
import { IngestionConsoleModal } from "@/components/IngestionConsoleModal";
import { ResearchVault } from "@/components/ResearchVault";
import { SystemDiagnosticsPanel } from "@/components/SystemDiagnosticsPanel";
import { SemanticVeilShowcase } from "@/components/SemanticVeilShowcase";

import {
  SearchRequest,
  SearchResponse,
  SearchResultItem,
  IndexStats,
  SystemHealth,
  VectorNodePoint,
  SavedResearchItem
} from "@/types";
import {
  checkBackendHealth,
  fetchIndexStats,
  fetchSemanticMap,
  searchArchive
} from "@/lib/api";
import { DEMO_DOCUMENTS, DEMO_VECTOR_POINTS } from "@/lib/constants";

export default function SynapseArchivePage() {
  // System Connection State
  const [isLive, setIsLive] = useState(false);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | undefined>(undefined);
  const [indexStats, setIndexStats] = useState<IndexStats>({
    document_count: DEMO_DOCUMENTS.length,
    chunk_count: DEMO_VECTOR_POINTS.length,
    vector_nodes: DEMO_VECTOR_POINTS.length,
    embedding_model: "synapse-lsa-384-academic",
    embedding_dimension: 384,
    index_size_bytes: DEMO_VECTOR_POINTS.length * 384 * 4,
    index_type: "Cosine Dot Product Index",
    metric: "Cosine Similarity",
    status: "READY",
    memory_mb: 0.12,
    is_live: false
  });

  // Vector Space & 3D Universe State
  const [nodes, setNodes] = useState<VectorNodePoint[]>(DEMO_VECTOR_POINTS);
  const [selectedNode, setSelectedNode] = useState<VectorNodePoint | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);
  const [searchTriggerPulse, setSearchTriggerPulse] = useState(0);

  // Search & Retrieval State
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [relatedConcepts, setRelatedConcepts] = useState<string[]>([]);
  const [searchTelemetry, setSearchTelemetry] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);

  // Custom Cursor
  const [cursorState, setCursorState] = useState<CursorState>("DEFAULT");
  const [cursorLabel, setCursorLabel] = useState<string | undefined>(undefined);

  // Modals & Panels
  const [docModal, setDocModal] = useState<{ isOpen: boolean; docId: string | null; page: number }>({
    isOpen: false,
    docId: null,
    page: 1
  });
  const [whyModal, setWhyModal] = useState<{ isOpen: boolean; item: SearchResultItem | null }>({
    isOpen: false,
    item: null
  });
  const [isIngestionOpen, setIsIngestionOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  // Research Vault & Query History (localStorage backed)
  const [savedItems, setSavedItems] = useState<SavedResearchItem[]>([]);
  const [queryHistory, setQueryHistory] = useState<string[]>([
    "How do transformers preserve long-range contextual information?",
    "Why do identity shortcut mappings ease training in deep residual networks?",
    "How does low-rank adaptation constrain weight updates during LLM fine-tuning?"
  ]);

  // Initial Boot: Check Backend & Load Initial Index Data
  useEffect(() => {
    checkBackendHealth().then(({ isOnline, health }) => {
      setIsLive(isOnline);
      if (health) setSystemHealth(health);
    });

    fetchIndexStats().then(setIndexStats);
    fetchSemanticMap().then(setNodes);

    // Load saved vault items from localStorage if available
    try {
      const saved = localStorage.getItem("synapse_vault");
      if (saved) setSavedItems(JSON.parse(saved));
      const hist = localStorage.getItem("synapse_history");
      if (hist) setQueryHistory(JSON.parse(hist));
    } catch {
      // LocalStorage not available or SSR
    }
  }, []);

  // Update localStorage when savedItems change
  useEffect(() => {
    try {
      localStorage.setItem("synapse_vault", JSON.stringify(savedItems));
    } catch {
      //
    }
  }, [savedItems]);

  const handleCursorChange = (state: CursorState, label?: string) => {
    setCursorState(state);
    setCursorLabel(label);
  };

  // Search Execution Handler
  const handleExecuteSearch = async (req: SearchRequest) => {
    setIsSearching(true);
    setPipelineStep(0);

    // Simulate animated pipeline step increments
    const stepInterval = setInterval(() => {
      setPipelineStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 180);

    try {
      const res: SearchResponse = await searchArchive(req);
      clearInterval(stepInterval);
      setPipelineStep(5);

      setSearchResults(res.results);
      setSearchTelemetry(res.telemetry);
      setRelatedConcepts(res.related_concepts);

      // Highlight matching nodes in 3D universe
      const matchingIds = res.results.map(r => r.chunk_id);
      setHighlightedNodeIds(matchingIds);
      setSearchTriggerPulse(prev => prev + 1);

      // Record query in history
      if (!queryHistory.includes(req.query)) {
        const updated = [req.query, ...queryHistory].slice(0, 20);
        setQueryHistory(updated);
        try {
          localStorage.setItem("synapse_history", JSON.stringify(updated));
        } catch {
          //
        }
      }

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById("search-results-anchor");
        if (resultsEl) resultsEl.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      console.error("Search failure", err);
      clearInterval(stepInterval);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTraceInVectorSpace = (chunkId: string) => {
    const node = nodes.find(n => n.chunk_id === chunkId || n.id === chunkId);
    if (node) {
      setSelectedNode(node);
      const univ = document.getElementById("semantic-universe");
      if (univ) univ.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSaveToVault = (item: SearchResultItem) => {
    if (savedItems.some(s => s.chunk_id === item.chunk_id)) return;
    const newItem: SavedResearchItem = {
      id: `vault_${Date.now()}`,
      chunk_id: item.chunk_id,
      document_id: item.document_id,
      title: item.title,
      page: item.page,
      section: item.section,
      text: item.text,
      saved_at: Date.now(),
      tags: [item.section]
    };
    setSavedItems([newItem, ...savedItems]);
  };

  const handleRemoveVaultItem = (id: string) => {
    setSavedItems(savedItems.filter(s => s.id !== id));
  };

  return (
    <div className="relative min-h-screen bg-[#07080b] text-[#f0f4f8] selection:bg-[#00f0ff]/30 selection:text-white">
      {/* Custom Dynamic Cursor */}
      <CustomCursor cursorState={cursorState} activeLabel={cursorLabel} />

      {/* Navigation Header */}
      <Navbar
        isLive={isLive}
        systemHealth={systemHealth}
        embeddingModel={indexStats.embedding_model}
        vectorNodesCount={indexStats.vector_nodes}
        onOpenIngestion={() => setIsIngestionOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        vaultCount={savedItems.length}
      />

      <main className="relative z-10 flex flex-col">
        {/* 01: Hero Section */}
        <HeroSection
          vectorNodesCount={indexStats.vector_nodes}
          dimension={indexStats.embedding_dimension}
          embeddingModel={indexStats.embedding_model}
          isLive={isLive}
          onEnterArchive={() => {
            document.getElementById("search-studio")?.scrollIntoView({ behavior: "smooth" });
          }}
          onExploreArchitecture={() => {
            document.getElementById("architecture")?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* 00: Interactive Semantic Dither Veil */}
        <div id="dither-veil">
          <SemanticVeilShowcase />
        </div>

        {/* 02: 3D Persistent Semantic Universe */}
        <section
          id="semantic-universe"
          className="relative w-full h-[620px] sm:h-[720px] border-y border-white/10 overflow-hidden bg-[#07080b]"
        >
          <ThreeSemanticUniverse
            nodes={nodes}
            selectedNodeId={selectedNode?.id}
            highlightedNodeIds={highlightedNodeIds}
            onSelectNode={setSelectedNode}
            setCursorState={handleCursorChange}
            searchTriggerPulse={searchTriggerPulse}
          />
        </section>

        {/* 03: Search Studio */}
        <SearchStudio
          onExecuteSearch={handleExecuteSearch}
          isSearching={isSearching}
          searchTelemetry={searchTelemetry}
          pipelineStep={pipelineStep}
          totalNodes={indexStats.vector_nodes}
        />

        {/* 04: Search Results Explorer Anchor */}
        <div id="search-results-anchor">
          <SearchResults
            results={searchResults}
            relatedConcepts={relatedConcepts}
            onOpenDocument={(docId, page) => setDocModal({ isOpen: true, docId, page })}
            onTraceInVectorSpace={handleTraceInVectorSpace}
            onWhyThisResult={(item) => setWhyModal({ isOpen: true, item })}
            onSaveToVault={handleSaveToVault}
            onSelectConcept={(concept) => {
              handleExecuteSearch({
                query: concept,
                top_k: 5,
                mode: "semantic"
              });
            }}
            onHoverResult={(chunkId) => {
              if (chunkId) setHighlightedNodeIds([chunkId]);
              else if (searchResults.length > 0) setHighlightedNodeIds(searchResults.map(r => r.chunk_id));
            }}
          />
        </div>

        {/* 05: Semantic Map & Cluster Topology */}
        <SemanticMapExplorer
          nodes={nodes}
          onSelectNode={setSelectedNode}
          selectedNode={selectedNode}
        />

        {/* 06: Storytelling: Bottleneck vs Solution & Engineering Challenges */}
        <StorytellingSections />

        {/* 07: System Architecture Visualizer */}
        <ArchitectureVisualizer />

        {/* 08 & 09: Empirical Benchmarking & Evaluation Suite */}
        <BenchmarkAndEvaluationSuite />

        {/* 10: Final Epilogue Visual Moment */}
        <FinalVisualMoment />
      </main>

      {/* Footer */}
      <Footer />

      {/* ---------------- MODALS & OVERLAYS ---------------- */}
      <DocumentViewerModal
        isOpen={docModal.isOpen}
        onClose={() => setDocModal({ isOpen: false, docId: null, page: 1 })}
        documentId={docModal.docId}
        initialPage={docModal.page}
      />

      <WhyThisResultModal
        item={whyModal.item}
        onClose={() => setWhyModal({ isOpen: false, item: null })}
      />

      <IngestionConsoleModal
        isOpen={isIngestionOpen}
        onClose={() => setIsIngestionOpen(false)}
        onDocumentIngested={() => {
          fetchIndexStats().then(setIndexStats);
          fetchSemanticMap().then(setNodes);
        }}
      />

      <ResearchVault
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        savedItems={savedItems}
        onRemoveItem={handleRemoveVaultItem}
        queryHistory={queryHistory}
        onSelectHistoricalQuery={(q) => {
          handleExecuteSearch({
            query: q,
            top_k: 5,
            mode: "semantic"
          });
        }}
      />

      <SystemDiagnosticsPanel
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        systemHealth={systemHealth}
        indexStats={indexStats}
      />
    </div>
  );
}
