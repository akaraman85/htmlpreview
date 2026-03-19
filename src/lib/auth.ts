import { timingSafeEqual } from "crypto";

const AUTH_PREFIX = "Bearer ";

export function isWriteAuthorized(authHeader: string | null): boolean {
  const expectedToken = process.env.API_WRITE_TOKEN;

  if (!expectedToken || !authHeader?.startsWith(AUTH_PREFIX)) {
    return false;
  }

  const providedToken = authHeader.slice(AUTH_PREFIX.length).trim();
  const expected = Buffer.from(expectedToken);
  const provided = Buffer.from(providedToken);

  if (expected.length !== provided.length) {
    return false;
  }

  return timingSafeEqual(expected, provided);
}
