import { NextResponse } from "next/server";
import { verifyPassphrase } from "@/lib/passphrase";
import { getSnippet } from "@/lib/store";

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
