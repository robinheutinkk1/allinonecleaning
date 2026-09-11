"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * Zijpaneel voor bewerken in de demo-beheeromgeving. Op telefoon schuift het van
 * onderen omhoog (volledige breedte), op desktop van rechts.
 */
export function DemoDrawer({ open, title, description, onClose, children }: { open: boolean; title: string; description?: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Sluiten"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-navy-950/50 backdrop-blur-[2px]"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-[80] max-h-[92dvh] overflow-y-auto rounded-t-3xl bg-white shadow-lift lg:inset-y-0 lg:left-auto lg:right-0 lg:max-h-none lg:w-[32rem] lg:rounded-none lg:rounded-l-3xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-navy-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
              <div>
                <h2 className="font-display text-lg font-bold text-navy-900">{title}</h2>
                {description && <p className="mt-0.5 text-sm text-navy-500">{description}</p>}
              </div>
              <button type="button" onClick={onClose} aria-label="Sluiten" className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-navy-500 hover:bg-navy-50 hover:text-navy-900">
                <X className="size-5" />
              </button>
            </div>
            <div className="px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
