# HTMLPreview

HTMLPreview is a Vercel-ready Next.js app for storing raw HTML via authenticated API calls and serving each snippet on a public URL.

## Features

- Authenticated write API (`POST /api/snippets`)
- Read API (`GET /api/snippets/:id`)
- Public render page (`/p/:id`)
- Optional passphrase protection for snippets
- Vercel Blob storage for persistence
- Admin dashboard with Google OAuth login
- User-generated API tokens for personalized access

## Environment variables

Copy `.env.example` to `.env.local` and set:

- `API_WRITE_TOKEN` (optional - your shared secret for write calls, users can also generate their own tokens)
- `GOOGLE_CLIENT_ID` (required for admin dashboard - get from [Google Cloud Console](https://console.cloud.google.com/))
- `GOOGLE_CLIENT_SECRET` (required for admin dashboard - get from [Google Cloud Console](https://console.cloud.google.com/))
- `AUTH_SECRET` (required for NextAuth - generate with `openssl rand -base64 32` and add to Vercel environment variables)

**Note:** `BLOB_READ_WRITE_TOKEN` is automatically set by Vercel when you create a Blob store in your project. No manual configuration needed!

**Optional:** `NEXT_PUBLIC_SITE_URL` — canonical origin (e.g. `https://your-domain.com`) for `/sitemap.xml`, `/robots.txt`, and Open Graph absolute URLs. If unset, `VERCEL_URL` or the default production host is used.

## Getting a write token (before you upload)

Every `POST` / `DELETE` to the snippets API needs a Bearer token. You can use either:

1. **Your own API token (recommended for individuals)**  
   - Open **`/admin`** in the browser, sign in with Google, then use **Generate API Token**.  
   - Copy the token once; use it as `Authorization: Bearer <that-token>` in curl or your app.  
   - You can create multiple tokens and revoke (inactivate) them from the same dashboard.

2. **Deployment `API_WRITE_TOKEN` (for automation / shared projects)**  
   - Set a long random secret in Vercel env as `API_WRITE_TOKEN`.  
   - Use that same value in the `Authorization: Bearer ...` header.

Generate or configure a token **before** calling `POST /api/snippets`; the API will return `401 Unauthorized` without a valid token.

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - Production: `https://htmlpreview-phi.vercel.app/api/auth/callback/google`
   - Local dev: `http://localhost:3000/api/auth/callback/google`
   - **Important:** The redirect URI must match exactly, including the `/api/auth/callback/google` path
7. Copy the Client ID and Client Secret to your environment variables

## Local development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## API usage

### Write errors (`401 Unauthorized`)

Failed authentication on `POST` or `DELETE /api/snippets` returns JSON with:

- `authStatus` — `missing_authorization` | `empty_token` | `invalid_token` | `token_revoked`
- `message` — short explanation
- `agentHint` — guidance for tools and automation
- `documentation` — link to the how-it-works article

Use `token_revoked` when a user API token was deactivated in **Admin** (generate a new token). Use `invalid_token` when the credential is wrong or unknown.

Create a snippet:

```bash
curl -X POST "http://localhost:3000/api/snippets" \
  -H "Authorization: Bearer $API_WRITE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Sample","html":"<h1>Hello</h1><p>From HTMLPreview</p>"}'
```

Create a protected snippet with a passphrase:

```bash
curl -X POST "http://localhost:3000/api/snippets" \
  -H "Authorization: Bearer $API_WRITE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Protected","html":"<h1>Secret</h1>","passphrase":"my-secret-pass"}'
```

Success response:

```json
{
  "id": "1f6ec038-7a4d-44d8-af6e-cf97e42402e9",
  "apiUrl": "/api/snippets/1f6ec038-7a4d-44d8-af6e-cf97e42402e9",
  "publicUrl": "/p/1f6ec038-7a4d-44d8-af6e-cf97e42402e9"
}
```

Fetch a snippet payload:

```bash
curl "http://localhost:3000/api/snippets/<id>"
```

Fetch a protected snippet (requires passphrase):

```bash
curl "http://localhost:3000/api/snippets/<id>?passphrase=my-secret-pass"
```

Open the public page:

```bash
open "http://localhost:3000/p/<id>"
```

Protected snippets will show a passphrase form. After entering the correct passphrase, the snippet will be displayed.
