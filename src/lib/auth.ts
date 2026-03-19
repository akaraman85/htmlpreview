import { timingSafeEqual } from "crypto";
import { validateUserToken } from "./store";

const AUTH_PREFIX = "Bearer ";

export async function isWriteAuthorized(authHeader: string | null): Promise<boolean> {
  const result = await getAuthUser(authHeader);
  return result !== null;
}

export async function getAuthUser(authHeader: string | null): Promise<{ type: "global" | "user"; userId?: string } | null> {
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
        return { type: "global" };
      }
    }
  }

  // Check user-generated tokens
  const userToken = await validateUserToken(providedToken);
  if (userToken) {
    return { type: "user", userId: userToken.userId };
  }

  return null;
}
