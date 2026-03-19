import { notFound } from "next/navigation";
import { verifyPassphrase } from "@/lib/passphrase";
import { getSnippet } from "@/lib/store";
import { PassphraseForm } from "./PassphraseForm";

type Params = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ passphrase?: string }>;
};

export default async function PublicSnippetPage({
  params,
  searchParams,
}: Params) {
  const { id } = await params;
  const { passphrase } = await searchParams;

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

  // If snippet has a passphrase, verify it
  if (snippet.passphraseHash) {
    if (!passphrase) {
      return (
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 md:px-8">
          <header className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">
              {snippet.title ?? "Shared HTML Snippet"}
            </h1>
            <p className="text-sm text-zinc-500">
              This snippet is protected with a passphrase
            </p>
          </header>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:bg-zinc-900">
            <PassphraseForm />
          </div>
        </main>
      );
    }

    if (!verifyPassphrase(passphrase, snippet.passphraseHash)) {
      return (
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 md:px-8">
          <header className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">
              {snippet.title ?? "Shared HTML Snippet"}
            </h1>
            <p className="text-sm text-zinc-500">
              This snippet is protected with a passphrase
            </p>
          </header>
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-800 dark:bg-red-950">
            <p className="mb-4 text-sm font-medium text-red-800 dark:text-red-200">
              Invalid passphrase. Please try again.
            </p>
            <PassphraseForm />
          </div>
        </main>
      );
    }
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
