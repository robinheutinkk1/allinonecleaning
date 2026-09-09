"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ProgressBar({ current, total, label }: { current: number; total: number; label: string }) {
  const reduce = useReducedMotion();
  const pct = Math.round((current / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-navy-900">
          Stap {current} van {total}
        </span>
        <span className="text-navy-500">{label}</span>
      </div>
      <div
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-navy-100"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={`Voortgang: stap ${current} van ${total}`}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
