import { NextResponse } from "next/server";
import { getSnippet } from "@/lib/store";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
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

  return NextResponse.json(snippet);
}
