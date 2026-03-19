import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSnippetsByToken, validateUserToken } from "@/lib/store";

type Params = {
  params: Promise<{ token: string }>;
};

export async function GET(request: Request, { params }: Params) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use email as user identifier if id is not available
  const userId = (session.user as { id?: string }).id || session.user.email;
  
  if (!userId) {
    return NextResponse.json({ error: "User identifier not found" }, { status: 401 });
  }

  const { token } = await params;

  // Verify the token belongs to the user (including inactive tokens)
  const userToken = await validateUserToken(token);
  if (!userToken || userToken.userId !== userId) {
    return NextResponse.json({ error: "Token not found or access denied" }, { status: 403 });
  }

  try {
    // Get all snippets created with this token (works even if token is inactive)
    const snippets = await getSnippetsByToken(token);
    return NextResponse.json({ 
      snippets,
      token: {
        name: userToken.name,
        createdAt: userToken.createdAt,
        deletedAt: userToken.deletedAt,
        isActive: !userToken.deletedAt,
      }
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to get snippets by token:", errorMessage);
    return NextResponse.json(
      { error: "Failed to retrieve snippets", details: errorMessage },
      { status: 500 },
    );
  }
}
