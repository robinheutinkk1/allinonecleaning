"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info } from "lucide-react";

/**
 * Meldingen in de demo-beheeromgeving. Wijzigingen worden niet opgeslagen; elke
 * "opslaan"-actie geeft een korte melding zodat de omgeving wél als echt aanvoelt.
 */
type Feedback = { id: number; text: string; tone: "success" | "info" };

const Ctx = createContext<{ notify: (text: string, tone?: Feedback["tone"]) => void } | null>(null);

export function DemoFeedbackProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Feedback[]>([]);
  const counter = useRef(0);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const notify = useCallback((text: string, tone: Feedback["tone"] = "success") => {
    const id = ++counter.current;
    setItems((prev) => [...prev.slice(-2), { id, text, tone }]);
    const timer = setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      timers.current.delete(id);
    }, 3200);
    timers.current.set(id, timer);
  }, []);

  useEffect(() => {
    const active = timers.current;
    return () => active.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <Ctx.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6" aria-live="polite">
        <AnimatePresence>
          {items.map((i) => (
            <motion.div
              key={i.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto flex max-w-md items-center gap-2.5 rounded-2xl bg-navy-950 px-4 py-3 text-sm text-white shadow-lift ring-1 ring-white/10"
            >
              {i.tone === "success" ? <CheckCircle2 className="size-4 shrink-0 text-gold-300" aria-hidden /> : <Info className="size-4 shrink-0 text-gold-300" aria-hidden />}
              <span>{i.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useDemoFeedback() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemoFeedback buiten DemoFeedbackProvider");
  return ctx;
}

/** Standaardmelding na een "opslaan" in de demo. */
export const DEMO_SAVED = "Opgeslagen in de demo. Wijzigingen worden niet bewaard.";
