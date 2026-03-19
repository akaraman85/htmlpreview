import { put, head } from "@vercel/blob";
import type { HtmlSnippet } from "@/lib/types";

const pathnameForSnippet = (id: string) => `snippets/${id}.json`;

export async function saveSnippet(snippet: HtmlSnippet): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Make sure the Blob store is connected to your Vercel project.",
    );
  }

  const pathname = pathnameForSnippet(snippet.id);
  const jsonData = JSON.stringify(snippet);

  try {
    await put(pathname, jsonData, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      token,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to save snippet to Blob: ${errorMessage}`);
  }
}

export async function getSnippet(id: string): Promise<HtmlSnippet | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Make sure the Blob store is connected to your Vercel project.",
    );
  }

  const pathname = pathnameForSnippet(id);

  try {
    const blobHead = await head(pathname, { token });
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
