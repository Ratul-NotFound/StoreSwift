export const RESERVED_SUBDOMAINS = new Set([
  "admin",
  "api",
  "app",
  "auth",
  "billing",
  "dashboard",
  "mail",
  "platform",
  "root",
  "support",
  "sys",
  "system",
  "test",
  "www"
]);

export function isReservedSlug(slug: string): boolean {
  if (!slug) return true;
  const clean = slug.trim().toLowerCase();
  return RESERVED_SUBDOMAINS.has(clean);
}
