import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/config/site";

/**
 * Logo van All in One Cleaning.
 *
 * Verwacht het aangeleverde logo op /public/images/logo.png (vierkant, transparant
 * of witte achtergrond). Vervang het placeholderbestand door het echte logo —
 * er hoeft niets in de code te veranderen.
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
}: {
  className?: string;
  variant?: "full" | "mark";
  inverted?: boolean;
  priority?: boolean;
  /** Verberg de tekst op zeer smalle schermen (navbar). */
  compactHide?: boolean;
}) {
  return (
    <Link href="/" aria-label={`${siteConfig.companyName} — naar de homepage`} className={cn("group inline-flex items-center gap-3", className)}>
      <span className="relative block size-11 shrink-0 overflow-hidden rounded-full bg-white shadow-soft ring-1 ring-navy-100 sm:size-12">
        <Image src="/images/logo.png" alt="" width={96} height={96} priority={priority} className="size-full object-cover" />
      </span>
      {variant === "full" && (
        <span className={cn("flex-col leading-none", compactHide ? "hidden min-[480px]:flex" : "flex")}>
          <span className={cn("whitespace-nowrap font-display text-[15px] font-extrabold uppercase tracking-[0.06em] sm:text-base", inverted ? "text-white" : "text-navy-900")}>
            All in One Cleaning
          </span>
          <span className={cn("mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-[11px]", inverted ? "text-aqua-300" : "text-aqua-600")}>
            {siteConfig.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}
