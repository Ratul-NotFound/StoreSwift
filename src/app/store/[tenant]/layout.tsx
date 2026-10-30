import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store — StoreSwift",
  description: "Browse and shop from this StoreSwift-powered store."
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
