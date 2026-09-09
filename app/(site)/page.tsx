import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Intro } from "@/components/sections/Intro";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { BeforeAfterShowcase } from "@/components/before-after/BeforeAfterShowcase";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { StatsSection } from "@/components/sections/StatsSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/config/site";
import { faqItems } from "@/config/faq";
import { getFeaturedProjects } from "@/lib/projects";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: `Vastgoedonderhoud Enschede | ${siteConfig.companyName} | ${siteConfig.tagline}`,
  description:
    "All in One Vastgoedonderhoud in Enschede: reiniging van gevels, daken, trespa, zonnepanelen en bestrating, schilderwerk binnen en buiten, houtrotherstel, vloerwerk en renovatie. Professioneel, veilig en met oog voor detail, in heel Overijssel. Vraag een vrijblijvende offerte aan.",
  path: "/",
  ogTitle: "Eén partner voor het onderhoud van uw pand.",
  ogSubtitle: "Reiniging, schilderwerk, houtrotherstel, vloerwerk en renovatie in Enschede en heel Overijssel.",
});

/**
 * Hero-video: zie siteConfig.heroVideo. Zet NEXT_PUBLIC_HERO_VIDEO_SRC="" om de
 * video uit te schakelen (alleen poster), of /videos/hero.mp4 om zelf te hosten.
 * Op mobiel wordt altijd de poster gebruikt.
 */
export default async function HomePage() {
  const [projects, settings] = await Promise.all([getFeaturedProjects(3), getSiteSettings()]);
  const videoSrc = settings.heroVideoEnabled ? siteConfig.heroVideo || null : null;

  return (
    <>
      <Hero videoSrc={videoSrc} />
      <TrustBar />
      <Intro />
      <BeforeAfterShowcase projects={projects} />
      <ServiceGrid />
      <ProcessSteps />
      <StatsSection />
      <ReviewsSection />
      <LocationSection />
      <FAQ />
      <CTASection />
      <JsonLd data={faqJsonLd(faqItems)} />
    </>
  );
}
