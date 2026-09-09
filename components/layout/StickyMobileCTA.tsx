"use client";

import { usePathname } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ctaConfig } from "@/config/site";
import { telHref, useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { track } from "@/lib/analytics";

/**
 * Sticky bottom bar op mobiel. Verborgen op de offertepagina (daar staat
 * de wizard-navigatie) en op de contactpagina.
 * "Bel direct" verschijnt alleen als het telefoonnummer bekend is.
 */
export function StickyMobileCTA() {
  const pathname = usePathname();
  const { phone } = useSiteSettings();
  if (pathname.startsWith("/offerte-aanvragen") || pathname.startsWith("/contact")) return null;

  return (
    <>
      {/* Ruimte onder de footer zodat de balk geen inhoud verbergt */}
      <div className="h-20 lg:hidden" aria-hidden />
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-100 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgb(16_28_48_/_0.25)] backdrop-blur-lg lg:hidden"
        role="region"
        aria-label="Snelle acties"
      >
        <div className="mx-auto flex max-w-md gap-2">
          {phone && (
            <Button href={telHref(phone)} variant="ghost" className="flex-1" icon={<Phone className="size-4" />} iconPosition="left" onClick={() => track({ name: "phone_click", location: "sticky_mobile" })}>
              Bel direct
            </Button>
          )}
          <Button href={ctaConfig.primary.href} className="flex-[1.4]" icon={<ArrowRight className="size-4" />} onClick={() => track({ name: "cta_click", label: "offerte", location: "sticky_mobile" })}>
            Offerte aanvragen
          </Button>
        </div>
      </div>
    </>
  );
}
