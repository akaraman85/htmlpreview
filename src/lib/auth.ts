import { timingSafeEqual } from "crypto";
import { validateUserToken } from "./store";

const AUTH_PREFIX = "Bearer ";

export async function isWriteAuthorized(authHeader: string | null): Promise<boolean> {
  if (!authHeader?.startsWith(AUTH_PREFIX)) {
    return false;
  }

  const providedToken = authHeader.slice(AUTH_PREFIX.length).trim();
  const result = await validateTokenForAuth(providedToken);
  return result !== null;
}

export async function getAuthUser(authHeader: string | null): Promise<{ type: "global" | "user"; userId?: string; token?: string } | null> {
  if (!authHeader?.startsWith(AUTH_PREFIX)) {
    return null;
  }

  const providedToken = authHeader.slice(AUTH_PREFIX.length).trim();

  // Check global API_WRITE_TOKEN first
  const expectedToken = process.env.API_WRITE_TOKEN;
  if (expectedToken) {
    const expected = Buffer.from(expectedToken);
    const provided = Buffer.from(providedToken);

    if (expected.length === provided.length) {
      if (timingSafeEqual(expected, provided)) {
        return { type: "global", token: providedToken };
      }
    }
  }

  // Check user-generated tokens (including inactive ones for query purposes)
  const userToken = await validateUserToken(providedToken);
  if (userToken) {
    return { type: "user", userId: userToken.userId, token: providedToken };
  }

  return null;
}

// Function to validate token for authentication (only active tokens)
export async function validateTokenForAuth(providedToken: string): Promise<{ type: "global" | "user"; userId?: string } | null> {
  // Check global API_WRITE_TOKEN first
  const expectedToken = process.env.API_WRITE_TOKEN;
  if (expectedToken) {
    const expected = Buffer.from(expectedToken);
    const provided = Buffer.from(providedToken);

    if (expected.length === provided.length) {
      if (timingSafeEqual(expected, provided)) {
        return { type: "global" };
      }
    }
  }

  // Check user-generated tokens - only active ones
  const userToken = await validateUserToken(providedToken);
  if (userToken && !userToken.deletedAt) {
    return { type: "user", userId: userToken.userId };
  }

  return null;
}
