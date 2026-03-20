import type { MetadataRoute } from "next";
import { listPublicSnippetsForSitemap } from "@/lib/store";
import {
  getCanonicalSiteUrlFromRequest,
  getSiteUrl,
} from "@/lib/site-url";

/** Regenerate periodically so new public previews appear without hammering Blob on every request. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let base: string;
  try {
    base = await getCanonicalSiteUrlFromRequest();
  } catch {
    base = getSiteUrl();
  }
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/article/secure-html-preview-api`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  const publicSnippets = await listPublicSnippetsForSitemap();
  const previewEntries: MetadataRoute.Sitemap = publicSnippets.map(
    ({ id, lastModified }) => ({
      url: `${base}/p/${id}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }),
  );

  return [...staticEntries, ...previewEntries];
}
