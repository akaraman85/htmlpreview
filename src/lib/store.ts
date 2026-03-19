import { Redis } from "@upstash/redis";
import type { HtmlSnippet } from "@/lib/types";

const keyForSnippet = (id: string) => `snippet:${id}`;

function getRedisClient(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing Redis environment variables: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN",
    );
  }

  return new Redis({ url, token });
}

export async function saveSnippet(snippet: HtmlSnippet): Promise<void> {
  const redis = getRedisClient();
  await redis.set(keyForSnippet(snippet.id), snippet);
}

export async function getSnippet(id: string): Promise<HtmlSnippet | null> {
  const redis = getRedisClient();
  const snippet = await redis.get<HtmlSnippet>(keyForSnippet(id));
  return snippet ?? null;
}
