import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/config/site";
import { logoPaths } from "./logo-paths";

/**
 * Logo van NOVA Onderhoud: geometrisch beeldmerk (gouden tegel met dakvorm) plus een
 * typografisch woordmerk. Inline SVG, dus scherp op elke grootte en zonder extra request.
 *
 * - `variant="full"` (standaard): beeldmerk + woordmerk. `variant="mark"`: alleen het beeldmerk.
 * - `inverted`: witte tekst voor donkere achtergronden. Het beeldmerk blijft goud.
 * - Hoogte via `className` (bijv. h-12); de breedte volgt automatisch.
 *
 * Bitmapvarianten voor e-mail en deelafbeeldingen staan in public/brand (scripts/generate-logo.mjs).
 */
export function Logo({
  className,
  variant = "full",
  inverted = false,
  href = "/",
}: {
  className?: string;
  variant?: "full" | "mark";
  inverted?: boolean;
  /** Niet meer nodig (inline SVG); bestaat voor compatibiliteit. */
  priority?: boolean;
  href?: string | null;
}) {
  const { width, height, icon } = logoPaths;
  const isMark = variant === "mark";
  const viewBox = isMark ? `0 0 ${icon.size} ${icon.size}` : `0 0 ${width} ${height}`;
  const text = inverted ? "#ffffff" : "#111c30";
  const sub = inverted ? "#e8cf8a" : "#8a6a1f";

  const svg = (
    <svg
      viewBox={viewBox}
      role="img"
      aria-label={siteConfig.companyName}
      className="block h-full w-auto"
      style={{ aspectRatio: isMark ? "1" : `${width} / ${height}` }}
    >
      <path d={icon.tile} fill="#d9a23a" />
      <path d={icon.roof} fill="none" stroke="#ffffff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      <path d={icon.base} fill="none" stroke="#ffffff" strokeWidth={9} strokeLinecap="round" />
      {!isMark && (
        <>
          <path d={logoPaths.nova} fill={text} />
          <path d={logoPaths.onderhoud} fill={sub} />
        </>
      )}
    </svg>
  );

  const cls = cn("inline-flex shrink-0 items-center", isMark ? "h-11 sm:h-12" : "h-12 sm:h-14", className);
  if (!href) return <span className={cls}>{svg}</span>;
  return (
    <Link href={href} aria-label={`${siteConfig.companyName}, naar de homepage`} className={cn(cls, "group")}>
      {svg}
    </Link>
  );
}
