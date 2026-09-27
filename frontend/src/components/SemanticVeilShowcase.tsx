"use client";

import React, { useState } from "react";
import DitherVeil from "./DitherVeil";
import { Sparkles, Sliders, Eye, RefreshCw, Zap } from "lucide-react";

const VEIL_IMAGES = [
  {
    id: "transformer",
    title: "Transformer Attention Topology",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop"
  },
  {
    id: "neural_space",
    title: "Continuous Latent Representation Manifold",
    src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1400&auto=format&fit=crop"
  },
  {
    id: "academic_network",
    title: "Semantic Citation Network",
    src: "https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop"
  }
];

export const SemanticVeilShowcase: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(VEIL_IMAGES[0]);
  const [pattern, setPattern] = useState<"floyd" | "bayer" | "noise" | "atkinson" | "lines">("floyd");
  const [palette, setPalette] = useState<"duotone" | "rgb">("duotone");
  const [pixelSize, setPixelSize] = useState(2);
  const [revealRadius, setRevealRadius] = useState(220);
  const [rimColor, setRimColor] = useState("#00f0ff");
  const [paperColor, setPaperColor] = useState("#00f0ff");
  const [inkColor, setInkColor] = useState("#07080b");

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest glow-cyan">
              00 // INTERACTIVE SEMANTIC LENS
            </span>
            <span className="rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-2 py-0.5 font-mono text-[9px] text-[#00f0ff]">
              REACT BITS &times; OGL WEBGL
            </span>
          </div>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-white uppercase mt-1">
            THE DITHER VEIL: REVEALING LATENT TRUTHS
          </h2>
          <p className="font-sans text-xs text-[#8fa0b5] mt-1 max-w-2xl">
            Move your cursor across the dithered surface to dissolve the noise and reveal the high-resolution continuous representation underneath. Click anywhere to trigger an acoustic shockwave.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#526075]">SUBJECT:</span>
          <div className="flex rounded-lg border border-white/10 bg-black/40 p-1">
            {VEIL_IMAGES.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`rounded px-2.5 py-1 text-[11px] transition-all ${
                  selectedImage.id === img.id
                    ? "bg-[#00f0ff]/20 text-[#00f0ff] font-bold border border-[#00f0ff]/40"
                    : "text-[#8fa0b5] hover:text-white"
                }`}
              >
                {img.title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Veil Container */}
      <div className="relative w-full h-[520px] rounded-3xl overflow-hidden glass-panel border border-[#00f0ff]/30 shadow-[0_0_60px_rgba(0,240,255,0.15)] group">
        <DitherVeil
          src={selectedImage.src}
          fit="cover"
          pattern={pattern}
          palette={palette}
          pixelSize={pixelSize}
          levels={3}
          inkColor={inkColor}
          paperColor={paperColor}
          contrast={1.25}
          brightness={0.05}
          revealRadius={revealRadius}
          softness={0.65}
          linger={1.2}
          rimColor={rimColor}
          rim={0.15}
          reverse={false}
          wander={true}
          clickBurst={true}
          className="w-full h-full cursor-crosshair"
        />

        {/* Floating HUD Overlay on the canvas */}
        <div className="pointer-events-none absolute top-4 left-6 z-10 flex flex-col gap-1 rounded-lg bg-black/60 p-3 border border-white/10 backdrop-blur-md font-mono text-[10px]">
          <div className="flex items-center gap-2 text-[#00f0ff] font-bold">
            <Sparkles className="h-3 w-3" />
            <span>{selectedImage.title.toUpperCase()}</span>
          </div>
          <span className="text-[#8fa0b5]">
            DIFFUSION: {pattern.toUpperCase()} | CELL: {pixelSize}px | SHOCKWAVE: ACTIVE
          </span>
        </div>

        {/* Interaction Hint */}
        <div className="pointer-events-none absolute bottom-4 right-6 z-10 rounded border border-white/10 bg-black/60 px-3 py-1 font-mono text-[10px] text-white/50 backdrop-blur-md">
          HOVER TO DISSOLVE VEIL &bull; CLICK TO RIPPLE
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0c1018]/80 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs text-[#8fa0b5]">
        {/* Pattern Control */}
        <div>
          <span className="text-[10px] uppercase text-[#00f0ff] block mb-1.5 font-bold">
            DITHER ALGORITHM:
          </span>
          <div className="flex flex-wrap gap-1">
            {(["floyd", "atkinson", "bayer", "noise", "lines"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPattern(p)}
                className={`rounded px-2 py-0.5 text-[10px] uppercase border transition-all ${
                  pattern === p
                    ? "border-[#00f0ff] bg-[#00f0ff]/20 text-white font-bold"
                    : "border-white/10 text-[#8fa0b5] hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Palette Mode */}
        <div>
          <span className="text-[10px] uppercase text-[#9d4edd] block mb-1.5 font-bold">
            COLOR PALETTE:
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setPalette("duotone");
                setPaperColor("#00f0ff");
                setRimColor("#9d4edd");
              }}
              className={`rounded px-2.5 py-1 text-[10px] border uppercase transition-all ${
                palette === "duotone"
                  ? "border-[#00f0ff] bg-[#00f0ff]/20 text-[#00f0ff] font-bold"
                  : "border-white/10 text-[#8fa0b5]"
              }`}
            >
              DUOTONE (CYAN)
            </button>
            <button
              onClick={() => {
                setPalette("rgb");
                setPaperColor("#ffffff");
                setRimColor("#00f0ff");
              }}
              className={`rounded px-2.5 py-1 text-[10px] border uppercase transition-all ${
                palette === "rgb"
                  ? "border-[#9d4edd] bg-[#9d4edd]/20 text-[#9d4edd] font-bold"
                  : "border-white/10 text-[#8fa0b5]"
              }`}
            >
              RGB RETRO
            </button>
          </div>
        </div>

        {/* Pixel Size Slider */}
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-white">DITHER CELL:</span>
            <span className="text-[#00f0ff] font-bold">{pixelSize}px</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={pixelSize}
            onChange={(e) => setPixelSize(parseInt(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-black/60 accent-[#00f0ff]"
          />
        </div>

        {/* Reveal Window Radius */}
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-white">REVEAL RADIUS:</span>
            <span className="text-[#9d4edd] font-bold">{revealRadius}px</span>
          </div>
          <input
            type="range"
            min="100"
            max="380"
            step="20"
            value={revealRadius}
            onChange={(e) => setRevealRadius(parseInt(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-black/60 accent-[#9d4edd]"
          />
        </div>
      </div>
    </section>
  );
};
