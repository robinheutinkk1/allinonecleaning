"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const LIMIT = 200;

/**
 * Reviewtekst: lange teksten worden ingekort tot ongeveer vier regels met een
 * knop "Meer weergeven". Korte teksten worden gewoon volledig getoond.
 */
export function ReviewText({ text, className }: { text: string; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const long = text.length > LIMIT;

  return (
    <div className={className}>
      <blockquote id={id} className={cn("text-[15px] leading-relaxed text-navy-700", long && !expanded && "line-clamp-4")}>
        {text}
      </blockquote>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={id}
          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-aqua-700 transition-colors hover:text-aqua-800"
        >
          {expanded ? "Minder weergeven" : "Meer weergeven"}
          <ChevronDown className={cn("size-4 transition-transform duration-300", expanded && "rotate-180")} aria-hidden />
        </button>
      )}
    </div>
  );
}
