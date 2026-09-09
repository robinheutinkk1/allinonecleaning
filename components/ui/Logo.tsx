import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/config/site";

/**
 * Logo van All in One Cleaning.
 *
 * Gebruikt /public/images/logo-mark.png (alleen het beeldmerk, gegenereerd door
 * scripts/process-photos.mjs) in de ronde badge; het volledige logo met wordmark
 * staat op /public/images/logo.png en wordt gebruikt voor OG/JSON-LD.
 *
 * `variant="mark"` toont alleen het beeldmerk (klein), `variant="full"` toont
 * beeldmerk + tekstlogo als toegankelijke tekst voor SEO/screenreaders.
 */
export function Logo({
  className,
  variant = "full",
  inverted = false,
  priority = false,
  compactHide = false,
  multiline = false,
}: {
  className?: string;
  variant?: "full" | "mark";
  inverted?: boolean;
  priority?: boolean;
  /** Verberg de tekst alleen op extreem smalle schermen (< 360px). */
  compactHide?: boolean;
  /** Laat de naam over twee regels lopen in smalle containers (dashboard-sidebar). */
  multiline?: boolean;
}) {
  return (
    <Link href="/" aria-label={`${siteConfig.companyName}, naar de homepage`} className={cn("group inline-flex items-center gap-3", className)}>
      <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5 shadow-soft ring-1 ring-navy-100 sm:size-12">
        <Image src="/images/logo-mark.png" alt="" width={96} height={96} priority={priority} className="size-full object-contain" />
      </span>
      {variant === "full" && (
        <span className={cn("min-w-0 flex-col justify-center leading-none", compactHide ? "hidden min-[360px]:flex" : "flex")}>
          <span
            className={cn(
              "font-display text-[13px] font-extrabold uppercase tracking-[0.06em] min-[400px]:text-[15px]",
              multiline ? "leading-[1.15]" : "whitespace-nowrap sm:text-base",
              inverted ? "text-white" : "text-navy-900",
            )}
          >
            All in One Cleaning
          </span>
          <span className={cn("mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] min-[400px]:text-[10px] sm:text-[11px]", inverted ? "text-aqua-300" : "text-aqua-600")}>
            {siteConfig.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}
