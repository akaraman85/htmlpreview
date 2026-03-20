import type { Metadata } from "next";
import Link from "next/link";

const canonicalUrl =
  "https://htmlpreview-phi.vercel.app/article/secure-html-preview-api";

export const metadata: Metadata = {
  title:
    "Secure HTML Preview Hosting for AI Agents | Step-by-Step Guide | HTMLPreview",
  description:
    "Host HTML previews securely via API: store snippets, share live URLs, optional passphrase protection. Built for AI assistants, agents, and developers who need a safe place to push rendered HTML.",
  keywords: [
    "secure HTML preview",
    "HTML preview API",
    "host HTML snippet",
    "AI agent HTML preview",
    "sandbox HTML hosting",
    "paste HTML share URL",
    "LLM HTML output preview",
    "authenticated HTML hosting",
    "Vercel HTML preview",
  ],
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: "Secure HTML Preview Hosting for AI Agents | HTMLPreview",
    description:
      "Step-by-step: push HTML over a secure API, get a shareable preview URL. Optional passphrase. Ideal for AI workflows.",
    url: canonicalUrl,
    siteName: "HTMLPreview",
    type: "article",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Secure HTML Preview Hosting for AI Agents | HTMLPreview",
    description:
      "Push HTML via API, get a live preview URL. Passphrase optional. Built for AI agents.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Secure HTML Preview Hosting for AI Agents — How HTMLPreview Works",
  description:
    "A step-by-step guide to hosting HTML previews securely via API, with optional passphrase protection, for AI assistants and developers.",
  author: {
    "@type": "Organization",
    name: "HTMLPreview",
  },
  publisher: {
    "@type": "Organization",
    name: "HTMLPreview",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": canonicalUrl,
  },
};

export default function SecureHtmlPreviewArticlePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-full bg-[#F7F9FB]">
        <header
          className="border-b bg-white"
          style={{ borderColor: "#E3EAF2" }}
        >
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 md:px-8">
            <Link
              href="/"
              className="text-sm font-semibold transition-colors"
              style={{ color: "#3A506B" }}
            >
              ← HTMLPreview
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link
                href="/"
                className="transition-colors"
                style={{ color: "#6C7A89" }}
              >
                Home
              </Link>
              <Link
                href="/admin"
                className="transition-colors"
                style={{ color: "#6C7A89" }}
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>

        <article className="mx-auto max-w-3xl px-4 py-10 pb-16 md:px-8">
          <header className="mb-10">
            <p
              className="mb-3 text-sm font-medium uppercase tracking-wide"
              style={{ color: "#5BC0BE" }}
            >
              Guide
            </p>
            <h1
              className="mb-4 text-3xl font-bold leading-tight md:text-4xl"
              style={{ color: "#1C2541" }}
            >
              Secure HTML preview hosting for AI agents and developers
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#6C7A89" }}>
              HTMLPreview is a{" "}
              <strong style={{ color: "#1C2541" }}>
                secured place to push HTML previews
              </strong>{" "}
              over HTTPS: you send HTML through an authenticated API, and you
              get back a public link where that HTML is rendered in a sandboxed
              preview. The primary use case is{" "}
              <strong style={{ color: "#1C2541" }}>
                AI assistants and autonomous agents
              </strong>{" "}
              that need to show users live pages without hosting files
              themselves.
            </p>
          </header>

          <section className="mb-12" aria-labelledby="why-ai">
            <h2
              id="why-ai"
              className="mb-4 text-2xl font-semibold"
              style={{ color: "#1C2541" }}
            >
              Why this is built for AI workflows
            </h2>
            <ul
              className="list-inside list-disc space-y-2 leading-relaxed"
              style={{ color: "#6C7A89" }}
            >
              <li>
                <strong style={{ color: "#1C2541" }}>One HTTP call</strong> from
                an agent: POST JSON with HTML, receive IDs and URLs in the
                response.
              </li>
              <li>
                <strong style={{ color: "#1C2541" }}>Bearer tokens</strong>{" "}
                (project token or per-user API tokens) keep writes private;
                readers only need the preview URL (and passphrase if you set
                one).
              </li>
              <li>
                <strong style={{ color: "#1C2541" }}>Optional passphrase</strong>{" "}
                per snippet so sensitive previews are not guessable by URL alone.
              </li>
              <li>
                <strong style={{ color: "#1C2541" }}>Agentic-friendly docs</strong>{" "}
                on the homepage (including a modal agents can copy) describe
                endpoints and headers in plain language.
              </li>
            </ul>
          </section>

          <section className="mb-12" aria-labelledby="how-it-works">
            <h2
              id="how-it-works"
              className="mb-4 text-2xl font-semibold"
              style={{ color: "#1C2541" }}
            >
              How it works (high level)
            </h2>
            <ol
              className="list-inside list-decimal space-y-3 leading-relaxed"
              style={{ color: "#6C7A89" }}
            >
              <li>
                You (or your agent) obtain a{" "}
                <strong style={{ color: "#1C2541" }}>write token</strong>: either
                a deployment secret or a token generated after signing in with
                Google in the admin dashboard.
              </li>
              <li>
                You call{" "}
                <code className="rounded bg-[#E3EAF2] px-1.5 py-0.5 text-sm text-[#1C2541]">
                  POST /api/snippets
                </code>{" "}
                with{" "}
                <code className="rounded bg-[#E3EAF2] px-1.5 py-0.5 text-sm text-[#1C2541]">
                  Authorization: Bearer &lt;token&gt;
                </code>{" "}
                and a JSON body containing{" "}
                <code className="rounded bg-[#E3EAF2] px-1.5 py-0.5 text-sm text-[#1C2541]">
                  html
                </code>
                , optional{" "}
                <code className="rounded bg-[#E3EAF2] px-1.5 py-0.5 text-sm text-[#1C2541]">
                  title
                </code>
                , optional{" "}
                <code className="rounded bg-[#E3EAF2] px-1.5 py-0.5 text-sm text-[#1C2541]">
                  passphrase
                </code>
                .
              </li>
              <li>
                The service stores the snippet (e.g. in object storage), hashes
                any passphrase, and returns{" "}
                <code className="rounded bg-[#E3EAF2] px-1.5 py-0.5 text-sm text-[#1C2541]">
                  id
                </code>
                , API path, and a{" "}
                <strong style={{ color: "#1C2541" }}>public preview path</strong>{" "}
                like{" "}
                <code className="rounded bg-[#E3EAF2] px-1.5 py-0.5 text-sm text-[#1C2541]">
                  /p/&lt;id&gt;
                </code>
                .
              </li>
              <li>
                Anyone with the link (and passphrase if used) can open the live
                HTML preview in the browser; content is shown in a sandboxed
                iframe appropriate for untrusted HTML.
              </li>
            </ol>
          </section>

          <section className="mb-12" aria-labelledby="steps">
            <h2
              id="steps"
              className="mb-4 text-2xl font-semibold"
              style={{ color: "#1C2541" }}
            >
              Step-by-step for an AI agent or developer
            </h2>
            <div className="space-y-8">
              <div>
                <h3
                  className="mb-2 text-lg font-semibold"
                  style={{ color: "#3A506B" }}
                >
                  Step 1 — Get a write token
                </h3>
                <p className="leading-relaxed" style={{ color: "#6C7A89" }}>
                  <strong style={{ color: "#1C2541" }}>Human-operated:</strong> Sign
                  in at{" "}
                  <Link href="/admin" className="font-medium text-[#3A506B] underline">
                    /admin
                  </Link>{" "}
                  with Google and generate an API token.{" "}
                  <strong style={{ color: "#1C2541" }}>Automation:</strong> Use a
                  deployment-level{" "}
                  <code className="rounded bg-[#E3EAF2] px-1.5 py-0.5 text-sm">
                    API_WRITE_TOKEN
                  </code>{" "}
                  if your project is configured that way. Never commit tokens to
                  public repos; use environment variables or a secret store.
                </p>
              </div>
              <div>
                <h3
                  className="mb-2 text-lg font-semibold"
                  style={{ color: "#3A506B" }}
                >
                  Step 2 — Push HTML with POST
                </h3>
                <p className="mb-3 leading-relaxed" style={{ color: "#6C7A89" }}>
                  Send JSON to your deployment&apos;s{" "}
                  <code className="rounded bg-[#E3EAF2] px-1.5 py-0.5 text-sm">
                    /api/snippets
                  </code>{" "}
                  endpoint. Example shape (replace host and token):
                </p>
                <pre
                  className="overflow-x-auto rounded-xl border p-4 text-sm leading-relaxed text-zinc-100"
                  style={{
                    borderColor: "#E3EAF2",
                    background: "linear-gradient(to bottom right, #18181b, #27272a)",
                  }}
                >
                  {`curl -X POST "https://your-deployment.example/api/snippets" \\
  -H "Authorization: Bearer YOUR_WRITE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Agent output","html":"<h1>Hello</h1><p>From the agent.</p>"}'`}
                </pre>
              </div>
              <div>
                <h3
                  className="mb-2 text-lg font-semibold"
                  style={{ color: "#3A506B" }}
                >
                  Step 3 — Share the preview URL
                </h3>
                <p className="leading-relaxed" style={{ color: "#6C7A89" }}>
                  Use the returned{" "}
                  <code className="rounded bg-[#E3EAF2] px-1.5 py-0.5 text-sm">
                    publicUrl
                  </code>{" "}
                  (or build{" "}
                  <code className="rounded bg-[#E3EAF2] px-1.5 py-0.5 text-sm">
                    https://&lt;host&gt;/p/&lt;id&gt;
                  </code>
                  ). If you included a passphrase, the response may include it in
                  the query string for convenience; treat that like a secret
                  link.
                </p>
              </div>
              <div>
                <h3
                  className="mb-2 text-lg font-semibold"
                  style={{ color: "#3A506B" }}
                >
                  Step 4 — Update or delete (optional)
                </h3>
                <p className="leading-relaxed" style={{ color: "#6C7A89" }}>
                  POST again with the same{" "}
                  <code className="rounded bg-[#E3EAF2] px-1.5 py-0.5 text-sm">
                    id
                  </code>{" "}
                  to overwrite HTML. Use authenticated DELETE on{" "}
                  <code className="rounded bg-[#E3EAF2] px-1.5 py-0.5 text-sm">
                    /api/snippets/&lt;id&gt;
                  </code>{" "}
                  to remove a snippet when it is no longer needed.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12" aria-labelledby="security">
            <h2
              id="security"
              className="mb-4 text-2xl font-semibold"
              style={{ color: "#1C2541" }}
            >
              Security and privacy
            </h2>
            <ul
              className="list-inside list-disc space-y-2 leading-relaxed"
              style={{ color: "#6C7A89" }}
            >
              <li>
                Writes require a valid bearer token; guessing snippet IDs does
                not grant write access.
              </li>
              <li>
                Passphrases are stored as strong one-way hashes (not plaintext).
              </li>
              <li>
                Previews run in a sandboxed context; treat hosted HTML as
                untrusted user content.
              </li>
              <li>
                For organization use, prefer per-user tokens from the admin
                dashboard and rotate or inactivate tokens when staff change
                roles.
              </li>
            </ul>
          </section>

          <section
            className="rounded-xl border bg-white p-6 shadow-sm"
            style={{ borderColor: "#E3EAF2" }}
            aria-labelledby="cta"
          >
            <h2
              id="cta"
              className="mb-3 text-xl font-semibold"
              style={{ color: "#1C2541" }}
            >
              Start from the product home
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: "#6C7A89" }}>
              The main site has live curl examples, an &quot;Agentic
              Friendly&quot; copy block for LLMs, and links to admin sign-in.
            </p>
            <Link
              href="/"
              className="inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#3A506B" }}
            >
              Open HTMLPreview home
            </Link>
          </section>

          <footer className="mt-12 border-t pt-8 text-sm" style={{ color: "#6C7A89", borderColor: "#E3EAF2" }}>
            <p>
              Looking for a{" "}
              <strong style={{ color: "#1C2541" }}>
                secure HTML preview API
              </strong>{" "}
              or a{" "}
              <strong style={{ color: "#1C2541" }}>
                safe place to host HTML snippets from AI tools
              </strong>
              ? HTMLPreview is designed for exactly that workflow: authenticated
              writes, shareable previews, optional passphrase protection, and
              documentation written for both humans and agents.
            </p>
          </footer>
        </article>
      </div>
    </>
  );
}
