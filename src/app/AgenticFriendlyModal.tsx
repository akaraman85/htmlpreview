"use client";

import { useState } from "react";

type AgenticFriendlyModalProps = {
  baseUrl: string;
  onClose: () => void;
};

export function AgenticFriendlyModal({
  baseUrl,
  onClose,
}: AgenticFriendlyModalProps) {
  const [copied, setCopied] = useState(false);

  const apiInstructions = `# HTMLPreview API Documentation for AI Agents

## Overview
HTMLPreview is a Vercel-deployed Next.js application that provides an authenticated API for storing HTML snippets and serving them on public URLs. It uses Vercel Blob for storage.

## Base URL
${baseUrl}

## Authentication (get a token before uploading)
All write operations (POST, DELETE) require a Bearer token in the header:
\`Authorization: Bearer <YOUR_WRITE_TOKEN>\`

**Two ways to obtain \`<YOUR_WRITE_TOKEN>\`:**

1. **Per-user token (recommended)** — Human signs in at \`${baseUrl}/admin\` with Google → **Generate API Token** → copy the hex token. Use it in the Authorization header. Tokens are tied to that account; you can list and inactivate them in the admin dashboard.

2. **Deployment secret** — If the project owner set \`API_WRITE_TOKEN\` in Vercel environment variables, that same string is accepted as the Bearer token (shared across all callers who know it).

You must have a valid token **before** calling \`POST /api/snippets\`; otherwise the API returns \`401 Unauthorized\`.

In examples below, replace \`\$API_WRITE_TOKEN\` or \`<API_WRITE_TOKEN>\` with either your admin-generated token or the deployment secret.

## Authentication errors (401) — \`authStatus\` field
When a write request is rejected, the JSON body includes machine-readable \`authStatus\` plus human and agent-oriented text. Always inspect \`authStatus\` before retrying.

| \`authStatus\` | Meaning | What to do |
|----------------|---------|------------|
| \`missing_authorization\` | No \`Authorization\` header, wrong scheme, or not \`Bearer\`. | Add \`Authorization: Bearer <your-token>\`. |
| \`empty_token\` | Header present but token string is blank. | Paste the full token after \`Bearer \` with no typos. |
| \`invalid_token\` | Token does not match this deployment (wrong value, typo, or unknown token). | Regenerate at \`${baseUrl}/admin\` or verify \`API_WRITE_TOKEN\` matches the server. |
| \`token_revoked\` | This was a valid **user** token that was **revoked/deactivated** in the admin dashboard. | **Generate a new token** at \`${baseUrl}/admin\`; revoked tokens never work again for writes. |

**Response shape (401):**
\`\`\`json
{
  "error": "Unauthorized",
  "authStatus": "token_revoked",
  "message": "This API token was revoked or deactivated...",
  "agentHint": "Sign in at /admin, generate a new API token...",
  "documentation": "${baseUrl}/article/secure-html-preview-api"
}
\`\`\`

- \`message\` — short summary for logs or UI.
- \`agentHint\` — step-by-step guidance for automated clients.
- \`documentation\` — link to the human guide (getting a token, etc.).

**Note:** \`invalid_token\` is used when the server cannot match the credential (including wrong deployment secret). \`token_revoked\` is only returned when the token **was** a known user token that has been inactivated — so agents can branch: revoked → new token at admin; invalid → check spelling and deployment.

## Endpoints

### 1. Create Snippet
\`\`\`
POST /api/snippets
Authorization: Bearer <API_WRITE_TOKEN>
Content-Type: application/json

Body:
{
  "html": "<h1>Hello</h1>",  // Required: HTML content as string
  "title": "My Snippet",     // Optional: Title (max 120 chars)
  "passphrase": "secret",    // Optional: Passphrase for protection
  "id": "custom-id"          // Optional: Custom ID (if provided, updates existing)
}
\`\`\`

Response:
\`\`\`
{
  "id": "uuid-here",
  "apiUrl": "/api/snippets/uuid-here",
  "publicUrl": "/p/uuid-here"  // Includes ?passphrase=xxx if provided
}
\`\`\`

### 2. Get Snippet
\`\`\`
GET /api/snippets/<id>
GET /api/snippets/<id>?passphrase=xxx  // Required if snippet is protected
\`\`\`

Response:
\`\`\`
{
  "id": "uuid",
  "html": "<h1>Hello</h1>",
  "title": "My Snippet",
  "passphraseHash": "...",  // Only present if protected
  "createdAt": "2026-03-19T...",
  "createdBy": "api"
}
\`\`\`

### 3. Update Snippet
\`\`\`
POST /api/snippets
Authorization: Bearer <API_WRITE_TOKEN>
Content-Type: application/json

Body:
{
  "id": "existing-id",  // Required: ID of snippet to update
  "html": "<h1>Updated</h1>",
  "title": "Updated Title",
  "passphrase": "new-secret"  // Optional: Can change passphrase
}
\`\`\`

Note: If ID is provided and snippet exists, it will be replaced. Original createdAt is preserved.

### 4. Delete Snippet
\`\`\`
DELETE /api/snippets/<id>
Authorization: Bearer <API_WRITE_TOKEN>
\`\`\`

Response:
\`\`\`
{
  "message": "Snippet deleted successfully",
  "id": "uuid-here"
}
\`\`\`

## Public View
Snippets can be viewed at: \`/p/<id>\` or \`/p/<id>?passphrase=xxx\`
The passphrase is automatically included in the publicUrl when creating protected snippets.

## Important Notes for AI Agents
1. On \`401\` from POST or DELETE, read \`authStatus\` in the JSON body and follow \`agentHint\`; use \`token_revoked\` vs \`invalid_token\` to decide whether to obtain a **new** admin token or fix configuration/spelling
2. Always use the Authorization header with Bearer token for write operations
3. HTML content must be a non-empty string
4. Passphrases are hashed with PBKDF2 and cannot be recovered
5. If updating a snippet, provide the existing ID in the request body
6. Protected snippets require passphrase in URL query parameter for access
7. The publicUrl returned includes the passphrase automatically if one was set
8. All snippets are stored in Vercel Blob with private access
9. Snippets are rendered in sandboxed iframes for security

## Example Usage
\`\`\`bash
# Create a basic snippet
curl -X POST "${baseUrl}/api/snippets" \\
  -H "Authorization: Bearer \$API_WRITE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Test","html":"<h1>Hello World</h1>"}'

# Create a protected snippet
curl -X POST "${baseUrl}/api/snippets" \\
  -H "Authorization: Bearer \$API_WRITE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Secret","html":"<h1>Protected</h1>","passphrase":"my-secret"}'

# Update existing snippet
curl -X POST "${baseUrl}/api/snippets" \\
  -H "Authorization: Bearer \$API_WRITE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"id":"existing-id","html":"<h1>Updated</h1>"}'

# Get snippet (public, but passphrase required if protected)
curl "${baseUrl}/api/snippets/<id>?passphrase=xxx"

# Delete snippet
curl -X DELETE "${baseUrl}/api/snippets/<id>" \\
  -H "Authorization: Bearer \$API_WRITE_TOKEN"
\`\`\`
`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiInstructions);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(28, 37, 65, 0.5)' }}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl"
        style={{ 
          borderColor: '#E3EAF2',
          backgroundColor: '#FFFFFF',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ 
            borderColor: '#E3EAF2',
            backgroundColor: '#F7F9FB'
          }}
        >
          <h2 
            className="text-xl font-semibold"
            style={{ color: '#1C2541' }}
          >
            Agentic Friendly API Documentation
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 transition-colors"
            style={{ 
              color: '#6C7A89'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E3EAF2';
              e.currentTarget.style.color = '#1C2541';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6C7A89';
            }}
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 180px)" }}>
          <pre className="whitespace-pre-wrap rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100">
            {apiInstructions}
          </pre>
        </div>

        {/* Footer with Copy Button */}
        <div 
          className="border-t px-6 py-4"
          style={{ 
            borderColor: '#E3EAF2',
            backgroundColor: '#F7F9FB'
          }}
        >
          <button
            onClick={handleCopy}
            className="w-full rounded-lg px-6 py-4 text-lg font-semibold text-white transition-all active:scale-95"
            style={{ 
              backgroundColor: copied ? '#5BC0BE' : '#3A506B'
            }}
            onMouseEnter={(e) => {
              if (!copied) {
                e.currentTarget.style.backgroundColor = '#2a3d52';
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                e.currentTarget.style.backgroundColor = '#3A506B';
              }
            }}
          >
            {copied ? "✓ Copied!" : "📋 Copy Instructions"}
          </button>
        </div>
      </div>
    </div>
  );
}
