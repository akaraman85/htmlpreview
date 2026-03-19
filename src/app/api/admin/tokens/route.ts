import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  generateUserToken,
  getUserTokens,
  deleteUserToken,
} from "@/lib/store";

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
    const tokens = await getUserTokens(userId);
    return NextResponse.json({ tokens });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to get user tokens:", errorMessage);
    return NextResponse.json(
      { error: "Failed to retrieve tokens", details: errorMessage },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use email as user identifier if id is not available
  const userId = (session.user as { id?: string }).id || session.user.email;
  
  if (!userId) {
    return NextResponse.json({ error: "User identifier not found" }, { status: 401 });
  }

  let body: { name?: string };
  try {
    body = (await request.json()) as { name?: string };
  } catch {
    body = {};
  }

  try {
    const userToken = await generateUserToken(
      userId,
      typeof body.name === "string" ? body.name : undefined,
    );
    return NextResponse.json({ token: userToken.token });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to generate token:", errorMessage);
    return NextResponse.json(
      { error: "Failed to generate token", details: errorMessage },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use email as user identifier if id is not available
  const userId = (session.user as { id?: string }).id || session.user.email;
  
  if (!userId) {
    return NextResponse.json({ error: "User identifier not found" }, { status: 401 });
  }

  let body: { token: string };
  try {
    body = (await request.json()) as { token: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.token !== "string") {
    return NextResponse.json(
      { error: "Token is required" },
      { status: 400 },
    );
  }

  try {
    await deleteUserToken(userId, body.token);
    return NextResponse.json({ message: "Token deleted successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to delete token:", errorMessage);
    return NextResponse.json(
      { error: "Failed to delete token", details: errorMessage },
      { status: 500 },
    );
    }
}
