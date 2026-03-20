/**
 * Canonical site origin for sitemaps, robots, and absolute metadata.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://your-domain.com) for stable URLs.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}`;
  }
  return "https://htmlpreview-phi.vercel.app";
}
