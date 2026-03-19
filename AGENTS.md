<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:gistio-app-context -->
# gistio - Vercel Next.js App

## What is gistio?

`gistio` is a Vercel-ready Next.js application for storing raw HTML snippets via authenticated API calls and serving each snippet on a public URL. It's essentially a pastebin/Gist service specifically for HTML content.

## Architecture

- **Framework**: Next.js 16.2.0 (App Router)
- **Deployment**: Vercel
- **Storage**: Upstash Redis (serverless Redis)
- **Authentication**: Bearer token for write operations (`API_WRITE_TOKEN`)
- **Security**: Optional per-snippet passphrase protection using PBKDF2

## Key Features

1. **Write API** (`POST /api/snippets`): Authenticated endpoint to create HTML snippets
2. **Read API** (`GET /api/snippets/:id`): Public endpoint to fetch snippet data (requires passphrase if protected)
3. **Public Pages** (`/p/:id`): Server-rendered pages that display HTML in sandboxed iframes
4. **Passphrase Protection**: Optional per-snippet passphrase hashed with PBKDF2

## Environment Variables

- `API_WRITE_TOKEN`: Shared secret for authenticating write operations
- `UPSTASH_REDIS_REST_URL`: Upstash Redis REST API URL
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis REST API token

## Data Flow

1. Client sends POST with `Authorization: Bearer <API_WRITE_TOKEN>` and optional `passphrase`
2. Server validates token, hashes passphrase (if provided), generates UUID
3. Snippet stored in Redis with key `snippet:<id>`
4. Returns `{ id, apiUrl, publicUrl }`
5. Public access via `/p/<id>` or `/api/snippets/<id>?passphrase=...` (if protected)

## Important Notes

- This is a **Vercel deployment** - use Vercel environment variables for production
- Redis storage is required - app will error if Upstash env vars are missing
- Passphrases are hashed with PBKDF2 (100k iterations, SHA-256) and cannot be recovered
- HTML is rendered in sandboxed iframes for security isolation
<!-- END:gistio-app-context -->
