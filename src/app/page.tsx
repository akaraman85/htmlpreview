export default function Home() {
  // Use the production URL, fallback to localhost for development
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://htmlpreview-phi.vercel.app"
      : "http://localhost:3000";

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-12 md:px-8">
      {/* Hero Section */}
      <div className="text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400">
          <span className="text-lg">🚀</span>
          <span>HTML Snippet Hosting</span>
        </div>
        <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-blue-400 dark:to-purple-400">
          HTMLPreview
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Store your HTML snippets via API and share them instantly with a
          public URL. Perfect for demos, prototypes, and quick previews.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-800">
          <div className="mb-3 text-2xl">🔐</div>
          <h3 className="mb-2 font-semibold">Secure API</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Authenticated write access with optional passphrase protection
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-800">
          <div className="mb-3 text-2xl">⚡</div>
          <h3 className="mb-2 font-semibold">Instant Sharing</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Get a public URL immediately after uploading your HTML
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-green-50 to-green-100/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-800">
          <div className="mb-3 text-2xl">🎨</div>
          <h3 className="mb-2 font-semibold">Sandboxed Rendering</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Safe HTML preview in isolated iframes for security
          </p>
        </div>
      </div>

      {/* API Examples */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xl">💻</span>
          <h2 className="text-xl font-semibold">API Usage</h2>
        </div>
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Basic snippet:
              </span>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Public
              </span>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-gradient-to-br from-zinc-950 to-zinc-900 p-4 text-sm text-zinc-100 shadow-inner">
              {`curl -X POST "${baseUrl}/api/snippets" \\
  -H "Authorization: Bearer $API_WRITE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Sample","html":"<h1>Hello</h1><p>From HTMLPreview</p>"}'`}
            </pre>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Protected snippet:
              </span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Passphrase
              </span>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-gradient-to-br from-zinc-950 to-zinc-900 p-4 text-sm text-zinc-100 shadow-inner">
              {`curl -X POST "${baseUrl}/api/snippets" \\
  -H "Authorization: Bearer $API_WRITE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Protected","html":"<h1>Secret</h1>","passphrase":"my-secret"}'`}
            </pre>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Update existing snippet:
              </span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Update
              </span>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-gradient-to-br from-zinc-950 to-zinc-900 p-4 text-sm text-zinc-100 shadow-inner">
              {`curl -X POST "${baseUrl}/api/snippets" \\
  -H "Authorization: Bearer $API_WRITE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"id":"existing-id","title":"Updated","html":"<h1>New Content</h1>"}'`}
            </pre>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Delete snippet:
              </span>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                Delete
              </span>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-gradient-to-br from-zinc-950 to-zinc-900 p-4 text-sm text-zinc-100 shadow-inner">
              {`curl -X DELETE "${baseUrl}/api/snippets/<id>" \\
  -H "Authorization: Bearer $API_WRITE_TOKEN"`}
            </pre>
          </div>
        </div>
      </section>

      {/* Response Info */}
      <section className="rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-800">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xl">✨</span>
          <h2 className="text-lg font-semibold">What You Get</h2>
        </div>
        <p className="text-zinc-700 dark:text-zinc-300">
          You'll receive a URL to access your stored HTML instantly. For
          protected snippets, the passphrase is automatically included in the URL.
          Update existing snippets by providing the same ID, or delete them when
          no longer needed. Simple, secure, and fast! 🎉
        </p>
      </section>
    </main>
  );
}
