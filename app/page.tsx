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

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: `Gevelreiniging Enschede | ${siteConfig.companyName} – ${siteConfig.tagline}`,
  description:
    "All in One Cleaning is uw gevelspecialist in Enschede en omgeving. Professionele reiniging van gevels, dakpannen, trespa en zonnepanelen. Bekijk onze before & after-resultaten en vraag gratis een offerte aan.",
  path: "/",
});

/**
 * Hero-video: zet HERO_VIDEO_SRC in .env (bijv. /videos/hero.mp4) zodra de
 * Higgsfield-video beschikbaar is en goedgekeurd. Zonder video wordt de
 * statische poster gebruikt. Op mobiel altijd de poster.
 */
export default async function HomePage() {
  const projects = await getFeaturedProjects(3);
  const videoSrc = process.env.NEXT_PUBLIC_HERO_VIDEO_SRC ?? null;

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
