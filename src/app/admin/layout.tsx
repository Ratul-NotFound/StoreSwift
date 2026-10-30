import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchant Dashboard — StoreSwift",
  description: "Manage your StoreSwift store: products, orders, inventory, and settings."
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
