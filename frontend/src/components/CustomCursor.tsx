"use client";

import React, { useEffect, useState } from "react";

export type CursorState = "DEFAULT" | "SEARCH" | "NODE" | "DOCUMENT" | "OPEN" | "DRAG";

interface CustomCursorProps {
  cursorState: CursorState;
  activeLabel?: string;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ cursorState, activeLabel }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  useEffect(() => {
    if (isTouch) return;
    let animationFrameId: number;

    const animateTrail = () => {
      setTrailingPos(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.22,
        y: prev.y + (pos.y - prev.y) * 0.22
      }));
      animationFrameId = requestAnimationFrame(animateTrail);
    };

    animationFrameId = requestAnimationFrame(animateTrail);
    return () => cancelAnimationFrame(animationFrameId);
  }, [pos, isTouch]);

  if (isTouch || !visible) return null;

  const isSpecial = cursorState !== "DEFAULT";

  return (
    <>
      {/* Central pointer dot */}
      <div
        className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`
        }}
      >
        <div
          className={`rounded-full transition-all duration-200 ${
            isSpecial
              ? "h-2 w-2 bg-[#00f0ff] shadow-[0_0_12px_#00f0ff]"
              : "h-1.5 w-1.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          }`}
        />
      </div>

      {/* Outer interactive ring */}
      <div
        className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`
        }}
      >
        <div
          className={`flex items-center justify-center rounded-full border transition-all duration-300 ${
            cursorState === "NODE"
              ? "h-16 w-16 border-[#00f0ff] bg-[rgba(0,240,255,0.1)] shadow-[0_0_20px_rgba(0,240,255,0.3)] backdrop-blur-[2px]"
              : cursorState === "DOCUMENT"
              ? "h-14 w-14 border-[#9d4edd] bg-[rgba(157,78,221,0.12)] shadow-[0_0_20px_rgba(157,78,221,0.3)]"
              : cursorState === "SEARCH"
              ? "h-12 w-12 border-[#00f0ff]/60 bg-[rgba(0,240,255,0.06)]"
              : "h-8 w-8 border-white/20"
          }`}
        >
          {activeLabel && (
            <span className="absolute -top-6 whitespace-nowrap rounded bg-black/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#00f0ff] border border-[#00f0ff]/30">
              {activeLabel}
            </span>
          )}
        </div>
      </div>
    </>
  );
};
