import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SiteSettingsProvider } from "@/components/providers/SiteSettingsProvider";
import { JsonLd } from "@/components/ui/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

/** Layout voor de publieke website. Het dashboard (/admin) heeft een eigen layout. */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <SiteSettingsProvider settings={settings}>
      <MotionProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-navy-900 focus:shadow-lift"
        >
          Naar hoofdinhoud
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer settings={settings} />
        <StickyMobileCTA />
      </MotionProvider>
      <JsonLd data={localBusinessJsonLd(settings)} />
    </SiteSettingsProvider>
  );
}
