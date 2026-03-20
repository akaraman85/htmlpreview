import { headers } from "next/headers";

/**
 * Fallback origin when no request is available (build, cron, etc.).
 * Prefer NEXT_PUBLIC_SITE_URL in Vercel for a stable production domain.
 *
 * Note: VERCEL_URL is the *deployment* hostname (e.g. …-team.vercel.app), not
 * your production alias (e.g. htmlpreview-phi.vercel.app). Using it for og:image
 * breaks Slack unfurls when users share the alias URL.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) {
    const host = production.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}`;
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}`;
  }
  return "https://htmlpreview-phi.vercel.app";
}

/**
 * Use the host the visitor (or Slack) actually requested so og:image and
 * og:url match the pasted link.
 */
export async function getCanonicalSiteUrlFromRequest(): Promise<string> {
  const h = await headers();
  const xfHost = h.get("x-forwarded-host");
  const host =
    xfHost?.split(",")[0]?.trim() || h.get("host")?.trim() || "";
  if (!host) {
    return getSiteUrl();
  }
  const protoHeader = h.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const isLocal =
    host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const proto = protoHeader || (isLocal ? "http" : "https");
  return `${proto}://${host}`;
}
