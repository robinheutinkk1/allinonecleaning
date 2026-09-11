import { demoConfig } from "@/config/site";

/** Woordmerk van de TagPoint Demo-beheeromgeving (donkere achtergrond). */
export function TagPointWordmark({ compact = false, subtitle = "Beheeromgeving" }: { compact?: boolean; subtitle?: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gold-500">
        <svg viewBox="0 0 100 100" className="size-5" fill="none" stroke="#fff" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M27 58L50 35L73 58" />
          <path d="M36 71H64" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block font-display text-[15px] font-bold text-white">{demoConfig.platformName} Demo</span>
        {!compact && <span className="block text-[11px] text-navy-400">{subtitle}</span>}
      </span>
    </span>
  );
}
