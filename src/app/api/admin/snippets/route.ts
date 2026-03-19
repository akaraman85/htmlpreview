import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserSnippets, updateSnippetPassphrase, getSnippet } from "@/lib/store";
import { hashPassphrase } from "@/lib/passphrase";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use email as user identifier if id is not available
  const userId = (session.user as { id?: string }).id || session.user.email;
  
  if (!userId) {
    return NextResponse.json({ error: "User identifier not found" }, { status: 401 });
  }

  try {
    const snippets = await getUserSnippets(userId);
    return NextResponse.json({ snippets });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to get user snippets:", errorMessage);
    return NextResponse.json(
      { error: "Failed to retrieve snippets", details: errorMessage },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use email as user identifier if id is not available
  const userId = (session.user as { id?: string }).id || session.user.email;
  
  if (!userId) {
    return NextResponse.json({ error: "User identifier not found" }, { status: 401 });
  }

  let body: { id: string; passphrase?: string | null };
  try {
    body = (await request.json()) as { id: string; passphrase?: string | null };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.id !== "string") {
    return NextResponse.json(
      { error: "Snippet ID is required" },
      { status: 400 },
    );
  }

  // Verify the snippet belongs to the user
  const snippet = await getSnippet(body.id);
  if (!snippet) {
    return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
  }

  if (snippet.createdBy !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // If passphrase is an empty string, remove it (set to null)
    const passphrase = body.passphrase === "" ? null : body.passphrase;
    await updateSnippetPassphrase(body.id, passphrase || null);
    return NextResponse.json({ message: "Passphrase updated successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to update passphrase:", errorMessage);
    return NextResponse.json(
      { error: "Failed to update passphrase", details: errorMessage },
      { status: 500 },
    );
  }
}
