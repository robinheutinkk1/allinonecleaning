"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/**
 * Telt een getal op zodra het in beeld komt: "250+" → 0+ … 250+, "4,9" → 0,0 … 4,9.
 * Tekst zonder getal (bijv. "Twente") wordt gewoon getoond.
 * Server en eerste client-render tonen de eindwaarde (geen hydration-verschil);
 * de animatie start pas in een effect.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(/^([^\d]*)(\d+(?:[.,]\d+)?)(.*)$/);
    if (!inView || !match || reduce) return;
    const [, prefix, num, suffix] = match;
    const decimals = num.includes(",") || num.includes(".") ? (num.split(/[.,]/)[1]?.length ?? 0) : 0;
    const separator = num.includes(",") ? "," : ".";
    const target = Number(num.replace(",", "."));
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(`${prefix}${v.toFixed(decimals).replace(".", separator)}${suffix}`),
      onComplete: () => setDisplay(value),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
