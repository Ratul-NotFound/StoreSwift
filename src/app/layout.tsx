import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaunchCommerce | Instant eCommerce SaaS for Startups",
  description: "Turnkey eCommerce platform for startups: Instant category-ready storefront, inventory manager, and order dashboard."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

