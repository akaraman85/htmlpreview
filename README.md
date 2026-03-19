# gistio

`gistio` is a Vercel-ready Next.js app for storing raw HTML via authenticated API calls and serving each snippet on a public URL.

## Features

- Authenticated write API (`POST /api/snippets`)
- Read API (`GET /api/snippets/:id`)
- Public render page (`/p/:id`)
- Redis-backed persistence via Upstash

## Environment variables

Copy `.env.example` to `.env.local` and set:

- `API_WRITE_TOKEN` (your shared secret for write calls)
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## Local development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## API usage

Create a snippet:

```bash
curl -X POST "http://localhost:3000/api/snippets" \
  -H "Authorization: Bearer $API_WRITE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Sample","html":"<h1>Hello</h1><p>From gistio</p>"}'
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

Open the public page:

```bash
open "http://localhost:3000/p/<id>"
```
