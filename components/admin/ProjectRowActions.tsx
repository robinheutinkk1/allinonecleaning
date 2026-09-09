"use client";

import { useTransition } from "react";
import { toggleProjectFlag } from "@/lib/admin/actions";
import { cn } from "@/lib/utils/cn";

export function FlagToggle({ id, field, value, label }: { id: string; field: "published" | "featured"; value: boolean; label: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      disabled={pending}
      onClick={() => start(() => toggleProjectFlag(id, field, !value).then(() => undefined))}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset transition disabled:opacity-50",
        value ? "bg-emerald-100 text-emerald-800 ring-emerald-200" : "bg-navy-50 text-navy-500 ring-navy-200",
      )}
    >
      <span className={cn("size-2 rounded-full", value ? "bg-emerald-500" : "bg-navy-300")} aria-hidden />
      {label}
    </button>
  );
}
