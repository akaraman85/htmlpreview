import { timingSafeEqual } from "crypto";
import { validateUserToken } from "./store";

const AUTH_PREFIX = "Bearer ";

/** Stable codes for clients and AI agents */
export type WriteAuthStatus =
  | "missing_authorization"
  | "empty_token"
  | "invalid_token"
  | "token_revoked";

export type WriteAuthSuccess = {
  ok: true;
  type: "global" | "user";
  userId?: string;
  token: string;
};

export type WriteAuthFailure = {
  ok: false;
  authStatus: WriteAuthStatus;
  message: string;
  agentHint: string;
};

export type WriteAuthResult = WriteAuthSuccess | WriteAuthFailure;

const DOC_PATH = "/article/secure-html-preview-api";

export function writeAuthErrorBody(failure: WriteAuthFailure, baseUrl?: string) {
  const doc =
    baseUrl != null && baseUrl.length > 0
      ? `${baseUrl.replace(/\/$/, "")}${DOC_PATH}`
      : DOC_PATH;

  return {
    error: "Unauthorized",
    authStatus: failure.authStatus,
    message: failure.message,
    agentHint: failure.agentHint,
    documentation: doc,
  };
}

/**
 * Resolves Bearer authentication for write operations (POST/DELETE snippets).
 * Returns structured failure reasons for outdated, revoked, or invalid tokens.
 */
export async function resolveWriteAuth(
  authHeader: string | null,
): Promise<WriteAuthResult> {
  if (authHeader == null || !authHeader.startsWith(AUTH_PREFIX)) {
    return {
      ok: false,
      authStatus: "missing_authorization",
      message: "Authorization header with Bearer token is required.",
      agentHint:
        "Send header: Authorization: Bearer <token>. Obtain a token from /admin (Google sign-in → Generate API Token) or use the deployment API_WRITE_TOKEN if configured.",
    };
  }

  const providedToken = authHeader.slice(AUTH_PREFIX.length).trim();

  if (providedToken === "") {
    return {
      ok: false,
      authStatus: "empty_token",
      message: "Bearer token is empty.",
      agentHint:
        "The value after 'Bearer ' must be your non-empty API token. Regenerate one in the admin dashboard if unsure.",
    };
  }

  // Global deployment token
  const expectedToken = process.env.API_WRITE_TOKEN;
  if (expectedToken) {
    const expected = Buffer.from(expectedToken);
    const provided = Buffer.from(providedToken);

    if (expected.length === provided.length && timingSafeEqual(expected, provided)) {
      return {
        ok: true,
        type: "global",
        token: providedToken,
      };
    }
  }

  // User-generated tokens (check revocation before generic invalid)
  const userToken = await validateUserToken(providedToken);

  if (userToken) {
    if (userToken.deletedAt) {
      return {
        ok: false,
        authStatus: "token_revoked",
        message:
          "This API token was revoked or deactivated and no longer works for uploads.",
        agentHint:
          "Sign in at /admin, generate a new API token, and retry with Authorization: Bearer <new-token>. Revoked tokens remain in the system for audit but cannot authenticate writes.",
      };
    }

    return {
      ok: true,
      type: "user",
      userId: userToken.userId,
      token: providedToken,
    };
  }

  return {
    ok: false,
    authStatus: "invalid_token",
    message:
      "The token is not recognized, incorrect, or does not match this deployment.",
    agentHint:
      "Verify the token string (no extra spaces or quotes). If you use a user token, confirm it was created on this same HTMLPreview deployment. If the deployment uses only API_WRITE_TOKEN, use that exact secret.",
  };
}

export async function isWriteAuthorized(authHeader: string | null): Promise<boolean> {
  const result = await resolveWriteAuth(authHeader);
  return result.ok;
}

/**
 * @deprecated Prefer resolveWriteAuth for write routes; this returns the same success payload as before but only for valid (non-revoked) credentials.
 */
export async function getAuthUser(
  authHeader: string | null,
): Promise<{ type: "global" | "user"; userId?: string; token?: string } | null> {
  const result = await resolveWriteAuth(authHeader);
  if (!result.ok) return null;
  return {
    type: result.type,
    userId: result.userId,
    token: result.token,
  };
}

/** @deprecated use resolveWriteAuth */
export async function validateTokenForAuth(
  providedToken: string,
): Promise<{ type: "global" | "user"; userId?: string } | null> {
  const result = await resolveWriteAuth(`${AUTH_PREFIX}${providedToken}`);
  if (!result.ok) return null;
  return {
    type: result.type,
    userId: result.userId,
  };
}
