import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://storeswift.app"),
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
    url: "https://storeswift.app",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('storeswift-theme');
                  var isDark = stored ? stored === 'dark' : true;
                  if (stored === 'system') {
                    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  }
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className={`${inter.variable} min-h-screen antialiased font-sans selection:bg-zinc-800 selection:text-zinc-100 dark:selection:bg-zinc-200 dark:selection:text-zinc-900`}>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
