import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog";
import { US_STATES, TR_CITIES, DE_STATES } from "@/lib/seo-locations";

const BASE = "https://settlelens.com";
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const CHECKLIST_TOPICS = [
  "before-consulting-lawyer",
  "hidden-assets",
  "house-decision",
  "retirement-accounts",
  "business-owner",
  "children-support",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = LOCALES.flatMap((lang) => [
    { url: `${BASE}/${lang}`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/${lang}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/${lang}/house-simulator`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/${lang}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/${lang}/trust`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/${lang}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/${lang}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/${lang}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/${lang}/cookie-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.2 },
  ]);

  const methodologyPages: MetadataRoute.Sitemap = LOCALES.flatMap((lang) =>
    ["us", "uk", "de", "fr", "es", "tr"].map((country) => ({
      url: `${BASE}/${lang}/methodology/${country}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  const blogPages: MetadataRoute.Sitemap = LOCALES.flatMap((lang) =>
    getBlogPosts(lang).map((post) => ({
      url: `${BASE}/${lang}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  const usStatePages: MetadataRoute.Sitemap = US_STATES.map((s) => ({
    url: `${BASE}/en/divorce-calculator/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const trCityPages: MetadataRoute.Sitemap = TR_CITIES.map((c) => ({
    url: `${BASE}/tr/bosanma-hesaplama/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const deStatePages: MetadataRoute.Sitemap = DE_STATES.map((s) => ({
    url: `${BASE}/de/scheidung-rechner/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const checklistPages: MetadataRoute.Sitemap = CHECKLIST_TOPICS.map((t) => ({
    url: `${BASE}/en/divorce-checklist/${t}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...methodologyPages,
    ...blogPages,
    ...usStatePages,
    ...trCityPages,
    ...deStatePages,
    ...checklistPages,
  ];
}
