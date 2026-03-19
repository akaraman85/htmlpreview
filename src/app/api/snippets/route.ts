import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { isWriteAuthorized } from "@/lib/auth";
import { hashPassphrase } from "@/lib/passphrase";
import { saveSnippet } from "@/lib/store";
import type { HtmlSnippet } from "@/lib/types";

type CreateSnippetBody = {
  html?: unknown;
  title?: unknown;
  passphrase?: unknown;
};

export async function POST(request: Request) {
  if (!isWriteAuthorized(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CreateSnippetBody;
  try {
    body = (await request.json()) as CreateSnippetBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.html !== "string" || body.html.trim() === "") {
    return NextResponse.json(
      { error: "`html` is required and must be a non-empty string" },
      { status: 400 },
    );
  }

  const title =
    typeof body.title === "string" && body.title.trim() !== ""
      ? body.title.trim().slice(0, 120)
      : undefined;

  const rawPassphrase =
    typeof body.passphrase === "string" && body.passphrase.trim() !== ""
      ? body.passphrase.trim()
      : undefined;

  const passphraseHash = rawPassphrase
    ? hashPassphrase(rawPassphrase)
    : undefined;

  const id = randomUUID();
  const snippet: HtmlSnippet = {
    id,
    html: body.html,
    title,
    passphraseHash,
    createdBy: "api",
    createdAt: new Date().toISOString(),
  };

  try {
    await saveSnippet(snippet);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to save snippet:", errorMessage);
    
    // Always return the actual error message for debugging
    return NextResponse.json(
      {
        error: "Storage is not configured on this deployment",
        details: errorMessage,
      },
      { status: 500 },
    );
  }

  // Include passphrase in publicUrl if provided
  const publicUrl = rawPassphrase
    ? `/p/${id}?passphrase=${encodeURIComponent(rawPassphrase)}`
    : `/p/${id}`;

  return NextResponse.json({
    id,
    apiUrl: `/api/snippets/${id}`,
    publicUrl,
  });
}
