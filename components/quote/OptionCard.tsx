"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Grote klikbare keuzekaart voor de wizard.
 * - `multi=false` → radio-gedrag (role="radio")
 * - `multi=true`  → checkbox-gedrag (role="checkbox")
 */
export function OptionCard({
  label,
  description,
  icon,
  selected,
  onSelect,
  multi = false,
  size = "md",
}: {
  label: string;
  description?: string;
  icon?: ReactNode;
  selected: boolean;
  onSelect: () => void;
  multi?: boolean;
  size?: "md" | "sm";
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "group relative flex w-full items-center gap-4 rounded-2xl border-2 bg-white text-left transition-all duration-200 ease-out-expo",
        size === "md" ? "p-4 sm:p-5" : "px-4 py-3",
        selected
          ? "border-gold-500 bg-gold-50/60 shadow-[0_0_0_4px_rgb(217_162_58_/_0.12)]"
          : "border-navy-100 hover:border-gold-300 hover:bg-navy-50/50 hover:shadow-soft",
      )}
    >
      {icon && (
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors",
            selected ? "bg-gold-500 text-navy-950" : "bg-navy-50 text-navy-600 group-hover:bg-gold-100 group-hover:text-gold-700",
          )}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={cn("block font-semibold text-navy-900", size === "md" ? "text-base" : "text-[15px]")}>{label}</span>
        {description && <span className="mt-0.5 block text-sm text-navy-500">{description}</span>}
      </span>
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center border-2 transition-all",
          multi ? "rounded-md" : "rounded-full",
          selected ? "border-gold-500 bg-gold-500 text-navy-950" : "border-navy-200 bg-white text-transparent",
        )}
        aria-hidden
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    </button>
  );
}
