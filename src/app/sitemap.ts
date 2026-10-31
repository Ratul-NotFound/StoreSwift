import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const rootUrl = process.env.NEXT_PUBLIC_APP_URL || "https://storeswift.app";
  const now = new Date();

  return [
    {
      url: rootUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0
    },
    {
      url: `${rootUrl}/onboarding`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${rootUrl}/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${rootUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${rootUrl}/store/apex-fashion`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85
    },
    {
      url: `${rootUrl}/store/luxe-glow-beauty`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85
    },
    {
      url: `${rootUrl}/store/craft-shoes`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85
    },
    {
      url: `${rootUrl}/store/cyber-tech`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85
    },
    {
      url: `${rootUrl}/store/maison-jewelry`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85
    },
    {
      url: `${rootUrl}/store/artisan-food`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85
    }
  ];
}
