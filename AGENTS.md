<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:htmlpreview-app-context -->
# HTMLPreview - Vercel Next.js App

## What is HTMLPreview?

HTMLPreview is a Vercel-ready Next.js application for storing raw HTML snippets via authenticated API calls and serving each snippet on a public URL. It's essentially a pastebin/Gist service specifically for HTML content.

## Architecture

- **Framework**: Next.js 16.2.0 (App Router)
- **Deployment**: Vercel
- **Storage**: Vercel Blob (object storage)
- **Authentication**: 
  - Bearer token for write operations (`API_WRITE_TOKEN` - optional, backward compatible)
  - User-generated API tokens via admin dashboard
  - Google OAuth for admin access (NextAuth.js v5)
- **Security**: Optional per-snippet passphrase protection using PBKDF2

## Key Features

1. **Write API** (`POST /api/snippets`): Authenticated endpoint to create HTML snippets
2. **Read API** (`GET /api/snippets/:id`): Public endpoint to fetch snippet data (requires passphrase if protected)
3. **Public Pages** (`/p/:id`): Server-rendered pages that display HTML in sandboxed iframes
4. **Passphrase Protection**: Optional per-snippet passphrase hashed with PBKDF2
5. **Admin Dashboard** (`/admin`): Google OAuth-protected dashboard for managing API tokens
6. **User-Generated Tokens**: Users can generate their own API tokens via the admin dashboard
7. **SEO article** (`/article/secure-html-preview-api`): Step-by-step guide for secure HTML preview hosting, AI/agent use case, metadata + JSON-LD

## Environment Variables

- `API_WRITE_TOKEN`: Optional shared secret for authenticating write operations (backward compatible)
- `BLOB_READ_WRITE_TOKEN`: Automatically set by Vercel when you create a Blob store (no manual setup needed)
- `GOOGLE_CLIENT_ID`: Required for admin dashboard - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Required for admin dashboard - Google OAuth client secret
- `AUTH_SECRET`: Required for NextAuth.js - generate with `openssl rand -base64 32`

## Getting a token before upload

Documented for humans in **README** (section “Getting a write token”) and on the **home page** (API Usage callout) and **Agentic Friendly** modal: either generate a token at `/admin` after Google sign-in, or use the deployment `API_WRITE_TOKEN`.

## Data Flow

1. Client sends POST with `Authorization: Bearer <token>` (user token from admin or `API_WRITE_TOKEN`) and optional `passphrase`
2. Server validates token, hashes passphrase (if provided), generates UUID
3. Snippet stored in Vercel Blob as JSON at pathname `snippets/<id>.json`
4. Returns `{ id, apiUrl, publicUrl }`
5. Public access via `/p/<id>` or `/api/snippets/<id>?passphrase=...` (if protected)

## Admin Dashboard

- **Route**: `/admin` (protected, requires Google OAuth)
- **Authentication**: NextAuth.js v5 with Google OAuth provider
- **Features**:
  - Generate personalized API tokens
  - View and manage all user tokens
  - View all HTML snippets created by the user
  - Add, change, or remove passphrases from snippets
  - Inactivate tokens (tokens are marked inactive, not deleted)
- **Token Storage**: User tokens stored in Vercel Blob at `tokens/<userId>/<tokenId>.json`
- **Token Inactivation**: When a token is "deleted", it's marked with `deletedAt` timestamp but remains in storage for audit/query purposes
- **Token Querying**: Inactive tokens cannot be used for authentication but can still be queried to see which snippets were created with them
- **Authentication Flow**: 
  1. User visits `/admin` → redirected to Google OAuth if not authenticated
  2. After Google sign-in → redirected back to `/admin`
  3. User can generate/manage tokens and snippets

## Token Management & Tracking

- **Token Lifecycle**: 
  - Tokens are generated with a secure random 64-character hex string
  - When "deleted", tokens are marked inactive with `deletedAt` timestamp (not actually removed)
  - Inactive tokens cannot be used for API authentication but remain queryable
- **Snippet Tracking**: Each snippet stores `createdWithToken` field to track which token was used to create it
- **Querying by Token**: Use `GET /api/admin/tokens/[token]/snippets` to query all snippets created with a specific token (works even if token is inactive)
- **Authentication Functions**:
  - `resolveWriteAuth()` - Resolves Bearer auth for writes; returns `authStatus` on failure (`missing_authorization`, `empty_token`, `invalid_token`, `token_revoked`)
  - `writeAuthErrorBody()` - Builds JSON for `401` responses (`error`, `authStatus`, `message`, `agentHint`, `documentation`)
  - `validateUserToken()` - Returns token if found (including inactive ones, for query purposes)
  - `validateTokenForAuth()` - Deprecated; delegates to `resolveWriteAuth`
  - `isWriteAuthorized()` - Uses `resolveWriteAuth()` for boolean check

## Important Notes

- This is a **Vercel deployment** - use Vercel environment variables for production
- Vercel Blob storage is required - create a Blob store in Vercel dashboard (token is auto-injected)
- Passphrases are hashed with PBKDF2 (100k iterations, SHA-256) and cannot be recovered
- HTML is rendered in sandboxed iframes for security isolation
- Admin dashboard requires Google OAuth setup - configure redirect URI: `https://htmlpreview-phi.vercel.app/api/auth/callback/google`
- API authentication supports both global `API_WRITE_TOKEN` and user-generated tokens
- **Token inactivation**: Tokens are never deleted, only marked inactive - this allows audit trails and querying of historical data
<!-- END:htmlpreview-app-context -->
