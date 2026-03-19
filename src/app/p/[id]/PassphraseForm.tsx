"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function PassphraseForm() {
  const router = useRouter();
  const pathname = usePathname();
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const url = new URL(window.location.origin + pathname);
    url.searchParams.set("passphrase", passphrase);
    router.push(url.pathname + url.search);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="passphrase"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Enter passphrase to view this snippet
        </label>
        <input
          id="passphrase"
          type="password"
          value={passphrase}
          onChange={(e) => {
            setPassphrase(e.target.value);
            setError("");
          }}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          placeholder="Enter passphrase"
          autoFocus
          disabled={isSubmitting}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !passphrase.trim()}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {isSubmitting ? "Verifying..." : "View Snippet"}
      </button>
    </form>
  );
}
