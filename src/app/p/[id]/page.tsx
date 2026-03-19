import { notFound } from "next/navigation";
import { getSnippet } from "@/lib/store";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function PublicSnippetPage({ params }: Params) {
  const { id } = await params;
  let snippet = null;
  try {
    snippet = await getSnippet(id);
  } catch {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-3 px-4 py-10 md:px-8">
        <h1 className="text-2xl font-semibold">Storage not configured</h1>
        <p className="text-zinc-600 dark:text-zinc-300">
          Missing Redis environment variables for this deployment.
        </p>
      </main>
    );
  }

  if (!snippet) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-8 md:px-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">
          {snippet.title ?? "Shared HTML Snippet"}
        </h1>
        <p className="text-sm text-zinc-500">
          Created at {new Date(snippet.createdAt).toLocaleString()}
        </p>
      </header>

      <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <iframe
          title={snippet.title ?? `snippet-${snippet.id}`}
          srcDoc={snippet.html}
          className="h-[80vh] w-full"
          sandbox=""
        />
      </section>
    </main>
  );
}
