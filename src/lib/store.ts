import { put, get, del, list } from "@vercel/blob";
import type { HtmlSnippet, UserToken } from "@/lib/types";
import { randomBytes, timingSafeEqual } from "crypto";

const pathnameForSnippet = (id: string) => `snippets/${id}.json`;
const pathnameForUserToken = (userId: string, tokenId: string) => `tokens/${userId}/${tokenId}.json`;

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
      allowOverwrite: true,
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
    
    if (!blob || !blob.stream) {
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

export async function deleteSnippet(id: string): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Make sure the Blob store is connected to your Vercel project.",
    );
  }

  const pathname = pathnameForSnippet(id);

  try {
    await del(pathname, { token });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete snippet from Blob: ${errorMessage}`);
  }
}

export async function getSnippetsByToken(token: string): Promise<HtmlSnippet[]> {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!blobToken) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Make sure the Blob store is connected to your Vercel project.",
    );
  }

  try {
    const prefix = "snippets/";
    const { blobs } = await list({ prefix, token: blobToken });
    
    const snippets: HtmlSnippet[] = [];
    
    for (const blob of blobs) {
      try {
        const blobData = await get(blob.pathname, {
          access: "private",
          token: blobToken,
        });
        
        if (!blobData || !blobData.stream) continue;
        
        const reader = blobData.stream.getReader();
        const chunks: Uint8Array[] = [];
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }
        
        const jsonData = new TextDecoder().decode(combined);
        const snippet = JSON.parse(jsonData) as HtmlSnippet;
        
        // Filter by token used to create
        if (snippet.createdWithToken === token) {
          snippets.push(snippet);
        }
      } catch (error) {
        console.error(`Error reading snippet ${blob.pathname}:`, error);
      }
    }
    
    return snippets.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Error fetching snippets by token:", error);
    return [];
  }
}

export async function getUserSnippets(userId: string): Promise<HtmlSnippet[]> {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!blobToken) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Make sure the Blob store is connected to your Vercel project.",
    );
  }

  try {
    const prefix = "snippets/";
    const { blobs } = await list({ prefix, token: blobToken });
    
    const snippets: HtmlSnippet[] = [];
    
    for (const blob of blobs) {
      try {
        const blobData = await get(blob.pathname, {
          access: "private",
          token: blobToken,
        });
        
        if (!blobData || !blobData.stream) continue;
        
        const reader = blobData.stream.getReader();
        const chunks: Uint8Array[] = [];
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }
        
        const jsonData = new TextDecoder().decode(combined);
        const snippet = JSON.parse(jsonData) as HtmlSnippet;
        
        // Filter by user ID - snippets are stored with token's userId in createdBy
        if (snippet.createdBy === userId) {
          snippets.push(snippet);
        }
      } catch (error) {
        console.error(`Error reading snippet ${blob.pathname}:`, error);
      }
    }
    
    return snippets.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Error fetching user snippets:", error);
    return [];
  }
}

export async function updateSnippetPassphrase(id: string, passphrase: string | null): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Make sure the Blob store is connected to your Vercel project.",
    );
  }

  const snippet = await getSnippet(id);
  if (!snippet) {
    throw new Error("Snippet not found");
  }

  const { hashPassphrase } = await import("@/lib/passphrase");
  const passphraseHash = passphrase && passphrase.trim() !== "" ? hashPassphrase(passphrase) : undefined;

  const updatedSnippet: HtmlSnippet = {
    ...snippet,
    passphraseHash,
  };

  await saveSnippet(updatedSnippet);
}

// User Token Management Functions
export async function generateUserToken(userId: string, name?: string): Promise<UserToken> {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!blobToken) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Make sure the Blob store is connected to your Vercel project.",
    );
  }

  // Generate a secure random token
  const apiToken = randomBytes(32).toString("hex");
  const tokenId = randomBytes(16).toString("hex");
  
  const userToken: UserToken = {
    userId,
    token: apiToken,
    createdAt: new Date().toISOString(),
    name: name || "Default Token",
  };

  const pathname = pathnameForUserToken(userId, tokenId);
  const jsonData = JSON.stringify(userToken);

  try {
    await put(pathname, jsonData, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: false,
      token: blobToken,
    });
    
    return userToken;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to save user token: ${errorMessage}`);
  }
}

export async function getUserTokens(userId: string, includeInactive: boolean = false): Promise<UserToken[]> {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!blobToken) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Make sure the Blob store is connected to your Vercel project.",
    );
  }

  try {
    const prefix = `tokens/${userId}/`;
    const { blobs } = await list({ prefix, token: blobToken });
    
    const tokens: UserToken[] = [];
    
    for (const blob of blobs) {
      try {
        const blobData = await get(blob.pathname, {
          access: "private",
          token: blobToken,
        });
        
        if (!blobData || !blobData.stream) continue;
        
        const reader = blobData.stream.getReader();
        const chunks: Uint8Array[] = [];
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }
        
        const jsonData = new TextDecoder().decode(combined);
        const token = JSON.parse(jsonData) as UserToken;
        // Include all tokens if includeInactive is true, otherwise only active ones
        if (includeInactive || !token.deletedAt) {
          tokens.push(token);
        }
      } catch (error) {
        console.error(`Error reading token ${blob.pathname}:`, error);
      }
    }
    
    return tokens.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Error fetching user tokens:", error);
    return [];
  }
}

export async function validateUserToken(providedToken: string): Promise<UserToken | null> {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!blobToken) {
    return null;
  }

  try {
    // List all tokens to find a match
    const { blobs } = await list({ prefix: "tokens/", token: blobToken });
    
    for (const blob of blobs) {
      try {
        const blobData = await get(blob.pathname, {
          access: "private",
          token: blobToken,
        });
        
        if (!blobData || !blobData.stream) continue;
        
        const reader = blobData.stream.getReader();
        const chunks: Uint8Array[] = [];
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }
        
        const jsonData = new TextDecoder().decode(combined);
        const token = JSON.parse(jsonData) as UserToken;
        
        // Use timing-safe comparison
        const expected = Buffer.from(token.token);
        const provided = Buffer.from(providedToken);
        
        if (expected.length === provided.length) {
          if (timingSafeEqual(expected, provided)) {
            // Return token even if inactive (for query purposes)
            // Authentication will check deletedAt separately
            return token;
          }
        }
      } catch (error) {
        console.error(`Error reading token ${blob.pathname}:`, error);
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error validating user token:", error);
    return null;
  }
}

export async function deleteUserToken(userId: string, token: string): Promise<void> {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!blobToken) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Make sure the Blob store is connected to your Vercel project.",
    );
  }

  try {
    const prefix = `tokens/${userId}/`;
    const { blobs } = await list({ prefix, token: blobToken });
    
    for (const blob of blobs) {
      try {
        const blobData = await get(blob.pathname, {
          access: "private",
          token: blobToken,
        });
        
        if (!blobData || !blobData.stream) continue;
        
        const reader = blobData.stream.getReader();
        const chunks: Uint8Array[] = [];
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }
        
        const jsonData = new TextDecoder().decode(combined);
        const userToken = JSON.parse(jsonData) as UserToken;
        
        if (userToken.token === token) {
          // Mark token as inactive instead of deleting
          const updatedToken: UserToken = {
            ...userToken,
            deletedAt: new Date().toISOString(),
          };
          
          await put(blob.pathname, JSON.stringify(updatedToken), {
            access: "private",
            contentType: "application/json",
            addRandomSuffix: false,
            allowOverwrite: true,
            token: blobToken,
          });
          return;
        }
      } catch (error) {
        console.error(`Error reading token ${blob.pathname}:`, error);
      }
    }
    
    throw new Error("Token not found");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete user token: ${errorMessage}`);
  }
}

/** Public preview pages only (no passphrase); for sitemap / SEO. Paginates blob list. */
export async function listPublicSnippetsForSitemap(): Promise<
  { id: string; lastModified: Date }[]
> {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) {
    return [];
  }

  const results: { id: string; lastModified: Date }[] = [];
  let cursor: string | undefined;

  try {
    do {
      const response = await list({
        prefix: "snippets/",
        token: blobToken,
        limit: 1000,
        cursor,
      });

      for (const blob of response.blobs) {
        const match = /^snippets\/([^/]+)\.json$/.exec(blob.pathname);
        if (!match) continue;
        const id = match[1];
        const snippet = await getSnippet(id);
        if (!snippet || snippet.passphraseHash) continue;
        results.push({
          id: snippet.id,
          lastModified: new Date(snippet.createdAt),
        });
      }

      cursor =
        response.hasMore && response.cursor ? response.cursor : undefined;
    } while (cursor);
  } catch (error) {
    console.error("listPublicSnippetsForSitemap:", error);
    return [];
  }

  return results;
}
