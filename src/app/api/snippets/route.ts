import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { isWriteAuthorized } from "@/lib/auth";
import { saveSnippet } from "@/lib/store";
import type { HtmlSnippet } from "@/lib/types";

type CreateSnippetBody = {
  html?: unknown;
  title?: unknown;
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

  const id = randomUUID();
  const snippet: HtmlSnippet = {
    id,
    html: body.html,
    title,
    createdBy: "api",
    createdAt: new Date().toISOString(),
  };

  try {
    await saveSnippet(snippet);
  } catch {
    return NextResponse.json(
      { error: "Storage is not configured on this deployment" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    id,
    apiUrl: `/api/snippets/${id}`,
    publicUrl: `/p/${id}`,
  });
}
