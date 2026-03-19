export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-10 md:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">gistio</h1>
      <p className="max-w-3xl text-zinc-600 dark:text-zinc-300">
        Store HTML through an authenticated API and share it with a public URL.
      </p>

      <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:bg-zinc-900">
        <h2 className="mb-3 text-lg font-semibold">Create snippet</h2>
        <pre className="overflow-x-auto rounded bg-zinc-950 p-3 text-sm text-zinc-100">
          {`curl -X POST "$BASE_URL/api/snippets" \\
  -H "Authorization: Bearer $API_WRITE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Sample","html":"<h1>Hello</h1><p>From gistio</p>"}'`}
        </pre>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:bg-zinc-900">
        <h2 className="mb-3 text-lg font-semibold">Response</h2>
        <pre className="overflow-x-auto rounded bg-zinc-950 p-3 text-sm text-zinc-100">
          {`{
  "id": "1f6ec038-7a4d-44d8-af6e-cf97e42402e9",
  "apiUrl": "/api/snippets/1f6ec038-7a4d-44d8-af6e-cf97e42402e9",
  "publicUrl": "/p/1f6ec038-7a4d-44d8-af6e-cf97e42402e9"
}`}
        </pre>
      </section>
    </main>
  );
}
