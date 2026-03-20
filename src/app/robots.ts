import type { MetadataRoute } from "next";
import {
  getCanonicalSiteUrlFromRequest,
  getSiteUrl,
} from "@/lib/site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  let base: string;
  try {
    base = await getCanonicalSiteUrlFromRequest();
  } catch {
    base = getSiteUrl();
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
