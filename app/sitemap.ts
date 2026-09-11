import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { services } from "@/config/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/diensten`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/ons-werk`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/werkwijze`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/offerte-aanvragen`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/over-ons`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}${s.href}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...servicePages];
}
