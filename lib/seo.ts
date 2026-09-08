import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { services } from "@/config/services";

/** Bouwt consistente metadata per pagina (title, description, canonical, OG). */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${opts.path === "/" ? "" : opts.path}`;
  const image = opts.image ?? "/images/og-image.jpg";
  // Titels die de bedrijfsnaam al bevatten niet nogmaals door de template laten voorzien.
  const hasBrand = opts.title.toLowerCase().includes(siteConfig.companyName.toLowerCase());
  return {
    title: hasBrand ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: siteConfig.companyName,
      locale: "nl_NL",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: `${siteConfig.companyName} | ${siteConfig.tagline}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}

/** LocalBusiness - alleen bekende velden worden opgenomen. */
export function localBusinessJsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.legalName,
    alternateName: siteConfig.companyName,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/images/og-image.jpg`,
    logo: `${siteConfig.url}/images/logo.png`,
    areaServed: siteConfig.workAreas.map((name) => ({ "@type": "City", name })),
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.city,
      addressCountry: siteConfig.country,
      ...(siteConfig.address.street ? { streetAddress: siteConfig.address.street } : {}),
      ...(siteConfig.address.postalCode ? { postalCode: siteConfig.address.postalCode } : {}),
    },
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, url: `${siteConfig.url}${s.href}` },
    })),
  };
  if (siteConfig.phone) data.telephone = siteConfig.phone;
  if (siteConfig.email) data.email = siteConfig.email;
  const sameAs = Object.values(siteConfig.socialLinks).filter(Boolean);
  if (sameAs.length) data.sameAs = sameAs;
  if (siteConfig.openingHours) {
    data.openingHoursSpecification = siteConfig.openingHours.map((o) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: o.days,
      opens: o.hours.split("-")[0]?.trim(),
      closes: o.hours.split("-")[1]?.trim(),
    }));
  }
  return data;
}

export function serviceJsonLd(service: { title: string; seoDescription: string; href: string; image: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.seoDescription,
    url: `${siteConfig.url}${service.href}`,
    image: `${siteConfig.url}${service.image}`,
    serviceType: service.title,
    provider: { "@id": `${siteConfig.url}/#business` },
    areaServed: siteConfig.workAreas.map((name) => ({ "@type": "City", name })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
