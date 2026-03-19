import { NextResponse } from "next/server";
import { isWriteAuthorized } from "@/lib/auth";
import { verifyPassphrase } from "@/lib/passphrase";
import { deleteSnippet, getSnippet } from "@/lib/store";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  let snippet = null;
  try {
    snippet = await getSnippet(id);
  } catch {
    return NextResponse.json(
      { error: "Storage is not configured on this deployment" },
      { status: 500 },
    );
  }

  if (!snippet) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // If snippet has a passphrase, verify it
  if (snippet.passphraseHash) {
    const url = new URL(request.url);
    const passphrase = url.searchParams.get("passphrase");

    if (!passphrase) {
      return NextResponse.json(
        { error: "Passphrase required" },
        { status: 401 },
      );
    }

    if (!verifyPassphrase(passphrase, snippet.passphraseHash)) {
      return NextResponse.json(
        { error: "Invalid passphrase" },
        { status: 403 },
      );
    }
  }

  return NextResponse.json(snippet);
}

export async function DELETE(request: Request, { params }: Params) {
  // Require API token authentication for deletion
  if (!isWriteAuthorized(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify snippet exists before attempting deletion
  let snippet = null;
  try {
    snippet = await getSnippet(id);
  } catch {
    return NextResponse.json(
      { error: "Storage is not configured on this deployment" },
      { status: 500 },
    );
  }

  if (!snippet) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete the snippet
  try {
    await deleteSnippet(id);
    return NextResponse.json({ 
      message: "Snippet deleted successfully",
      id 
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to delete snippet:", errorMessage);
    return NextResponse.json(
      {
        error: "Failed to delete snippet",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
