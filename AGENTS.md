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

## Environment Variables

- `API_WRITE_TOKEN`: Optional shared secret for authenticating write operations (backward compatible)
- `BLOB_READ_WRITE_TOKEN`: Automatically set by Vercel when you create a Blob store (no manual setup needed)
- `GOOGLE_CLIENT_ID`: Required for admin dashboard - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Required for admin dashboard - Google OAuth client secret
- `AUTH_SECRET`: Required for NextAuth.js - generate with `openssl rand -base64 32`

## Data Flow

1. Client sends POST with `Authorization: Bearer <API_WRITE_TOKEN>` and optional `passphrase`
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
  - Delete tokens when no longer needed
- **Token Storage**: User tokens stored in Vercel Blob at `tokens/<userId>/<tokenId>.json`
- **Authentication Flow**: 
  1. User visits `/admin` → redirected to Google OAuth if not authenticated
  2. After Google sign-in → redirected back to `/admin`
  3. User can generate/manage tokens

## Important Notes

- This is a **Vercel deployment** - use Vercel environment variables for production
- Vercel Blob storage is required - create a Blob store in Vercel dashboard (token is auto-injected)
- Passphrases are hashed with PBKDF2 (100k iterations, SHA-256) and cannot be recovered
- HTML is rendered in sandboxed iframes for security isolation
- Admin dashboard requires Google OAuth setup - configure redirect URI: `https://htmlpreview-phi.vercel.app/api/auth/callback/google`
- API authentication supports both global `API_WRITE_TOKEN` and user-generated tokens
<!-- END:htmlpreview-app-context -->
