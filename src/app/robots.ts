import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const rootUrl = process.env.NEXT_PUBLIC_APP_URL || "https://storeswift.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register", "/onboarding", "/store/"],
        disallow: ["/admin/", "/super-admin/", "/api/"]
      }
    ],
    sitemap: `${rootUrl}/sitemap.xml`
  };
}

