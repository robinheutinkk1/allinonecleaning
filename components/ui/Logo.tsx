import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/config/site";

/**
 * Logo van All in One Vastgoedonderhoud (huisje + "ALL IN ONE" + "VASTGOEDONDERHOUD").
 *
 * Bestanden (gegenereerd door scripts/process-logo.mjs uit assets/originals):
 * - /images/logo.png            volledig logo, transparant (lichte achtergronden)
 * - /images/logo-inverted.png   navy-delen wit (donkere achtergronden)
 * - /images/logo-mark.png       alleen het huisje (kleine plekken, favicon)
 *
 * `variant="full"` (standaard) toont het volledige logo; `variant="mark"` alleen het huisje.
 * Hoogte via `className` (bijv. h-14); breedte volgt automatisch.
 */
export function Logo({
  className,
  variant = "full",
  inverted = false,
  priority = false,
  href = "/",
}: {
  className?: string;
  variant?: "full" | "mark";
  inverted?: boolean;
  priority?: boolean;
  href?: string | null;
  /** @deprecated wordt niet meer gebruikt (logo bevat de naam) */
  compactHide?: boolean;
  /** @deprecated wordt niet meer gebruikt (logo bevat de naam) */
  multiline?: boolean;
}) {
  const src = variant === "mark" ? "/images/logo-mark.png" : inverted ? "/images/logo-inverted.png" : "/images/logo.png";
  const ratio = variant === "mark" ? 1 : 929 / 569;
  const img = (
    <Image
      src={src}
      alt={siteConfig.companyName}
      width={variant === "mark" ? 512 : 929}
      height={variant === "mark" ? 512 : 569}
      priority={priority}
      className={cn("block h-full w-auto object-contain", variant === "mark" && "aspect-square")}
      style={{ aspectRatio: String(ratio) }}
    />
  );
  const cls = cn("inline-flex shrink-0 items-center", variant === "mark" ? "h-11 sm:h-12" : "h-14 sm:h-16", className);
  if (!href) return <span className={cls}>{img}</span>;
  return (
    <Link href={href} aria-label={`${siteConfig.companyName}, naar de homepage`} className={cn(cls, "group")}>
      {img}
    </Link>
  );
}
