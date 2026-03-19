import { put, head } from "@vercel/blob";
import type { HtmlSnippet } from "@/lib/types";

const pathnameForSnippet = (id: string) => `snippets/${id}.json`;

export async function saveSnippet(snippet: HtmlSnippet): Promise<void> {
  const pathname = pathnameForSnippet(snippet.id);
  const jsonData = JSON.stringify(snippet);

  // Vercel Blob SDK auto-detects BLOB_READ_WRITE_TOKEN from environment
  await put(pathname, jsonData, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function getSnippet(id: string): Promise<HtmlSnippet | null> {
  const pathname = pathnameForSnippet(id);

  try {
    // Vercel Blob SDK auto-detects BLOB_READ_WRITE_TOKEN from environment
    const blobHead = await head(pathname);
    if (!blobHead) {
      return null;
    }

    // Fetch the blob content
    const response = await fetch(blobHead.url);
    if (!response.ok) {
      return null;
    }

    const jsonData = await response.text();
    return JSON.parse(jsonData) as HtmlSnippet;
  } catch (error) {
    console.error("Error fetching snippet:", error);
    return null;
  }
}
