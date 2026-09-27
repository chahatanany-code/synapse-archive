"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowUp } from "lucide-react";

export const FinalVisualMoment: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [converged, setConverged] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 400);

    const particles: Array<{
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      color: string;
      radius: number;
    }> = [];

    const colors = ["#00f0ff", "#9d4edd", "#ffffff", "#38bdf8"];
    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < 280; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: centerX,
        targetY: centerY,
        vx: 0,
        vy: 0,
        color: colors[i % colors.length],
        radius: Math.random() * 2 + 1
      });
    }

    let animationId: number;
    let step = 0;

    const render = () => {
      ctx.fillStyle = "rgba(7, 8, 11, 0.25)";
      ctx.fillRect(0, 0, width, height);

      step++;
      const shouldConverge = step > 120;
      if (shouldConverge && !converged) setConverged(true);

      particles.forEach((p) => {
        if (shouldConverge) {
          // Attract towards center
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          p.x += dx * 0.04;
          p.y += dy * 0.04;
        } else {
          // Wander subtly
          p.x += Math.sin(step * 0.05 + p.y) * 0.8;
          p.y += Math.cos(step * 0.05 + p.x) * 0.8;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [converged]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center flex flex-col items-center">
      {/* Interactive Convergence Canvas */}
      <div className="relative w-full h-[320px] rounded-3xl overflow-hidden glass-panel border border-white/10 mb-8 flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-4 p-6">
          <div className="font-mono text-2xl sm:text-4xl font-black text-white uppercase tracking-wider leading-relaxed">
            KNOWLEDGE <br />
            IS NOT A LIBRARY. <br />
            <span className="text-[#00f0ff] glow-cyan">IT IS A NETWORK.</span>
          </div>

          <p className="font-mono text-xs sm:text-sm text-[#8fa0b5] tracking-[0.2em] uppercase">
            SYNAPSE ARCHIVE // SEARCH THE SPACE BETWEEN IDEAS.
          </p>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-mono text-xs text-white/80 hover:border-[#00f0ff] hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-all duration-300"
      >
        <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
        <span>RETURN TO THE ARCHIVE SUMMIT</span>
      </button>
    </section>
  );
};
