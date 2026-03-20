"use client";

import { useCallback, useEffect, useState } from "react";
import { HeaderLink } from "./HeaderLink";
import { PreviewContainer } from "./PreviewContainer";

type PreviewPageShellProps = {
  snippetId: string;
  title: string;
  createdAt: string;
  html: string;
};

const storageKey = (id: string) => `htmlpreview:previewHeaderCollapsed:${id}`;

export function PreviewPageShell({
  snippetId,
  title,
  createdAt,
  html,
}: PreviewPageShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey(snippetId));
      if (stored === "1") {
        setCollapsed(true);
      }
    } catch {
      // ignore
    }
  }, [snippetId]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        sessionStorage.setItem(storageKey(snippetId), next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }, [snippetId]);

  const iframeTitle = title || `snippet-${snippetId}`;

  return (
    <main className="flex h-screen w-full flex-col">
      {collapsed ? (
        <div className="flex flex-shrink-0 items-center justify-end border-b border-zinc-200 bg-white px-3 py-1 dark:border-zinc-800 dark:bg-zinc-900 md:px-4">
          <button
            type="button"
            onClick={toggleCollapsed}
            className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-expanded={false}
            aria-label="Expand header and viewport toolbar"
            title="Show title bar and viewport controls"
          >
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <header className="flex flex-shrink-0 items-center justify-between gap-2 border-b border-zinc-200 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900 md:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <h1 className="truncate text-lg font-semibold">
                {title || "Shared HTML Snippet"}
              </h1>
              <p className="hidden shrink-0 text-xs text-zinc-500 sm:block">
                Created at {new Date(createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex shrink-0 items-center">
              <HeaderLink />
            </div>
          </header>
          <PreviewContainer
            html={html}
            title={iframeTitle}
            viewportToolbarEnd={
              <button
                type="button"
                onClick={toggleCollapsed}
                className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                aria-expanded={true}
                aria-label="Collapse header and viewport toolbar"
                title="Hide title bar and viewport controls"
              >
                <ChevronUpIcon className="h-4 w-4" />
              </button>
            }
          />
        </>
      )}

      {collapsed && (
        <PreviewContainer
          html={html}
          title={iframeTitle}
          compactChrome={true}
        />
      )}
    </main>
  );
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 15l-6-6-6 6" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
