"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { track } from "@/lib/analytics";

/**
 * Interactieve before/after-slider.
 *
 * - Pointer events (muis + touch + pen) via één handler, met pointer capture.
 * - Toetsenbord: ←/→ (1%), Shift+←/→ (10%), Home/End. role="slider" met aria-waarden.
 * - Geen layout-shift: beide afbeeldingen vullen dezelfde container; de
 *   "after"-laag wordt geclipt met clip-path (GPU-vriendelijk, geen re-layout).
 * - Werkt zonder JS: standaard staat de slider op 50%.
 */
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeLabel = "Voor",
  afterLabel = "Na",
  initial = 50,
  aspect = "aspect-[4/3]",
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  className,
  trackId,
  rounded = "rounded-3xl",
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  initial?: number;
  aspect?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  trackId?: string;
  rounded?: string;
}) {
  const [pos, setPos] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tracked = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPos((x / rect.width) * 100);
  }, []);

  const markInteraction = useCallback(() => {
    if (tracked.current) return;
    tracked.current = true;
    track({ name: "before_after_interaction", project: trackId });
  }, [trackId]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    updateFromClientX(e.clientX);
    markInteraction();
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    let next: number | null = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = pos - step;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = pos + step;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = 100;
    if (next !== null) {
      e.preventDefault();
      setPos(Math.min(100, Math.max(0, next)));
      markInteraction();
    }
  };

  // Voorkom dat de pagina scrollt tijdens horizontaal slepen op touch (touch-action: none op de handle-zone)
  useEffect(() => {
    if (!dragging) return;
    const prevent = (ev: TouchEvent) => ev.preventDefault();
    document.addEventListener("touchmove", prevent, { passive: false });
    return () => document.removeEventListener("touchmove", prevent);
  }, [dragging]);

  return (
    <div
      ref={containerRef}
      className={cn("group relative w-full select-none overflow-hidden bg-navy-100 shadow-lift", aspect, rounded, className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{ touchAction: "pan-y" }}
    >
      {/* AFTER — volledige onderlaag (rechts zichtbaar) */}
      <Image src={afterSrc} alt={afterAlt} fill priority={priority} sizes={sizes} draggable={false} className="object-cover" />

      {/* BEFORE — bovenlaag, geclipt vanaf links tot de sliderpositie */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} aria-hidden>
        <Image src={beforeSrc} alt="" fill priority={priority} sizes={sizes} draggable={false} className="object-cover" />
      </div>
      {/* Verborgen alt-tekst voor de "voor"-foto (screenreaders) */}
      <span className="sr-only">{beforeAlt}</span>

      {/* Labels: links VOOR, rechts NA */}
      <span
        className={cn(
          "pointer-events-none absolute left-4 top-4 rounded-full bg-navy-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur transition-opacity duration-300",
          pos < 15 && "opacity-0",
        )}
      >
        {beforeLabel}
      </span>
      <span
        className={cn(
          "pointer-events-none absolute right-4 top-4 rounded-full bg-aqua-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-soft transition-opacity duration-300",
          pos > 85 && "opacity-0",
        )}
      >
        {afterLabel}
      </span>

      {/* Handle */}
      <div
        role="slider"
        tabIndex={0}
        aria-label="Vergelijk voor en na — sleep of gebruik de pijltjestoetsen"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% voor-foto, ${100 - Math.round(pos)}% na-foto zichtbaar`}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="absolute inset-y-0 z-10 w-12 -translate-x-1/2 cursor-ew-resize outline-none"
        style={{ left: `${pos}%`, touchAction: "none" }}
      >
        <span className="ba-handle-line absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 shadow-[0_0_12px_rgb(0_0_0_/_0.35)]" aria-hidden />
        <span
          className={cn(
            "absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy-900 shadow-lift ring-1 ring-navy-100 transition-transform duration-300",
            "group-focus-within:ring-4 group-focus-within:ring-aqua-300",
            dragging ? "scale-110" : "group-hover:scale-105",
          )}
          aria-hidden
        >
          <ChevronsLeftRight className="size-5" />
        </span>
      </div>

      {/* Hint (verdwijnt na interactie) */}
      <span
        className={cn(
          "pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-navy-950/70 px-3 py-1 text-xs text-white backdrop-blur transition-opacity duration-500",
          (dragging || pos !== initial) && "opacity-0",
        )}
      >
        Sleep om te vergelijken
      </span>
    </div>
  );
}
