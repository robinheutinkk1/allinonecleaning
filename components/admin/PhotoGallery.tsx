"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";

/** Foto's van een aanvraag via tijdelijke (signed) URL's, met lightbox. */
export function PhotoGallery({ photos }: { photos: { path: string; url: string | null }[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const valid = photos.filter((p) => p.url);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? null : (i + 1) % valid.length));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? null : (i - 1 + valid.length) % valid.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, valid.length]);

  if (photos.length === 0) return <p className="text-sm text-navy-400">Geen foto&apos;s meegestuurd.</p>;

  return (
    <>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {photos.map((p, i) => (
          <li key={p.path} className="relative aspect-square overflow-hidden rounded-2xl bg-navy-100 ring-1 ring-navy-100">
            {p.url ? (
              <button type="button" onClick={() => setIndex(valid.findIndex((v) => v.path === p.path))} className="block size-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={`Foto ${i + 1}`} className="size-full object-cover transition hover:scale-105" loading="lazy" />
              </button>
            ) : (
              <span className="flex size-full items-center justify-center p-2 text-center text-xs text-navy-400">Niet beschikbaar</span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-navy-400">Links zijn 1 uur geldig. Ververs de pagina als een foto niet meer laadt.</p>

      {index !== null && valid[index] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90 p-4" role="dialog" aria-modal="true" aria-label="Foto vergroot">
          <button type="button" onClick={() => setIndex(null)} aria-label="Sluiten" className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
            <X className="size-6" />
          </button>
          {valid.length > 1 && (
            <>
              <button type="button" onClick={() => setIndex((index - 1 + valid.length) % valid.length)} aria-label="Vorige" className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
                <ChevronLeft className="size-6" />
              </button>
              <button type="button" onClick={() => setIndex((index + 1) % valid.length)} aria-label="Volgende" className="absolute right-4 top-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={valid[index].url!} alt={`Foto ${index + 1}`} className="max-h-[85vh] max-w-full rounded-2xl object-contain" />
          <a href={valid[index].url!} target="_blank" rel="noopener noreferrer" className="absolute bottom-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-900">
            <Download className="size-4" /> Origineel openen ({index + 1}/{valid.length})
          </a>
        </div>
      )}
    </>
  );
}
