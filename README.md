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

**Recommended on Vercel:** `NEXT_PUBLIC_SITE_URL` — set to your real public origin (e.g. `https://htmlpreview-phi.vercel.app`). Without it, preview pages still use the **request host** for `og:image` / `og:url` (so Slack matches the link you paste). This env is still used as a fallback for sitemap/robots during static generation and for `VERCEL_PROJECT_PRODUCTION_URL` when available.

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

## End-to-end tests (Playwright)

```bash
npx playwright install chromium   # once per machine
npm run test:e2e                  # builds, starts production server, runs tests
```

- **`e2e/public-routes.spec.ts`** — always runs: home page, `robots.txt`, `sitemap.xml` (and asserts no `Set-Cookie` on those SEO routes).
- **`e2e/preview-open-graph.spec.ts`** — full stack: `POST /api/snippets`, open `/p/:id`, assert `og:image` / `og:url` use the same host as the server, fetch `og:image` as Slackbot and assert PNG + no cookies. **Skipped** unless both `BLOB_READ_WRITE_TOKEN` and `API_WRITE_TOKEN` (or `E2E_WRITE_TOKEN`) are set (e.g. in `.env.local` when Playwright starts `next start`).

Use `npm run test:e2e:ui` for the Playwright UI.

### Running E2E against Vercel (or any deployed URL)

Vercel **does not run Playwright** on its platform (no long-lived browser runner in the build). The usual pattern is:

1. **Deploy** to Vercel (preview or production).
2. **Run Playwright in GitHub Actions** (or another CI) and point tests at the live URL.

If `PLAYWRIGHT_BASE_URL` is **not** `localhost` / `127.0.0.1`, this repo’s config **skips** the local `webServer` and only hits the remote app:

```bash
export PLAYWRIGHT_BASE_URL="https://htmlpreview-phi.vercel.app"
# Optional: force skip even on localhost (e.g. you already ran `npm run start`)
# export PLAYWRIGHT_SKIP_WEBSERVER=1

export BLOB_READ_WRITE_TOKEN="…"   # same store the deployment uses
export API_WRITE_TOKEN="…"         # or E2E_WRITE_TOKEN

npx playwright install chromium
npx playwright test
```

`BLOB_READ_WRITE_TOKEN` and `API_WRITE_TOKEN` must be available **on the CI runner** (secrets), not inside Vercel — the snippet test calls your deployment’s **`POST /api/snippets`** over HTTPS.

You can also wire **Vercel → GitHub** (e.g. [deployment events](https://vercel.com/docs/deployments/git#github) or a workflow that reads the preview URL from the Vercel bot comment) and pass that URL as `PLAYWRIGHT_BASE_URL`. See `.github/workflows/e2e-vercel.yml` for a **manual** “run E2E against this URL” workflow.

### GitHub Actions

`.github/workflows/e2e.yml` runs on push/PR: public tests always; the OG/snippet test runs when repo secrets `BLOB_READ_WRITE_TOKEN` and `API_WRITE_TOKEN` are configured.

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
