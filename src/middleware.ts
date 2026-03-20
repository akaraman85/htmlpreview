import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";

/**
 * Skip NextAuth on these paths so crawlers (Slack, Facebook, etc.) don't get
 * Set-Cookie on og:image, sitemap, or robots — unfurlers often drop images otherwise.
 */
function isSeoAssetPath(pathname: string): boolean {
  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") return true;
  if (pathname.endsWith("/opengraph-image")) return true;
  if (pathname.endsWith("/twitter-image")) return true;
  return false;
}

const authMiddleware = auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow auth API routes to pass through
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith("/admin") && !req.auth) {
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}) as unknown as NextMiddleware;

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (isSeoAssetPath(req.nextUrl.pathname)) {
    return NextResponse.next();
  }
  return authMiddleware(req, event);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
