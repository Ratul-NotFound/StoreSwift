import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://storeswift.com"),
  title: {
    default: "StoreSwift — Instant eCommerce SaaS Platform for Startups",
    template: "%s | StoreSwift"
  },
  description: "Turnkey eCommerce platform for startups: Instant category-ready storefront, inventory manager, and order dashboard in 3 minutes.",
  keywords: ["ecommerce", "online store builder", "startup ecommerce", "inventory management", "saas storefront"],
  authors: [{ name: "StoreSwift Team" }],
  creator: "StoreSwift",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://storeswift.com",
    siteName: "StoreSwift",
    title: "StoreSwift — Instant eCommerce SaaS Platform for Startups",
    description: "Launch your category-ready online storefront, real-time inventory engine, and merchant dashboard in 3 minutes.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StoreSwift eCommerce Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "StoreSwift — Instant eCommerce SaaS Platform for Startups",
    description: "Turnkey eCommerce platform for startups: Instant category-ready storefront and inventory engine in 3 minutes.",
    creator: "@storeswift"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafafa] text-zinc-900 antialiased font-sans">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
