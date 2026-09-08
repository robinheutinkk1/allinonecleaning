"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Centrale Framer Motion-configuratie.
 * reducedMotion="user": bij prefers-reduced-motion worden transform/layout-
 * animaties overgeslagen; opacity-fades blijven (kort en rustig).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
