import { put, get } from "@vercel/blob";
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
      access: "private",
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
    // Use get() method for private blobs - it handles authentication automatically
    const blob = await get(pathname, { 
      access: "private",
      token,
    });
    
    if (!blob) {
      return null;
    }

    // Read the blob content from the stream
    const reader = blob.stream.getReader();
    const chunks: Uint8Array[] = [];
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    
    // Combine chunks and convert to text
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }
    
    const jsonData = new TextDecoder().decode(combined);
    return JSON.parse(jsonData) as HtmlSnippet;
  } catch (error) {
    console.error("Error fetching snippet:", error);
    return null;
  }
}
