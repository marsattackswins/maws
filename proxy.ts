import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE_RE = /(?:^|;\s*)(?:__Host-maws\.session|maws\.session)=[0-9a-f]{64}(?:;|$)/;

/**
 * Optimistic edge guard (Next 16 "proxy" convention). Real authentication —
 * session validity, CSRF, Origin binding — happens again in every route
 * handler; this only fast-fails obviously unauthenticated live-API traffic.
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api/live")) {
    const cookieHeader = request.headers.get("cookie") ?? "";
    if (!SESSION_COOKIE_RE.test(cookieHeader)) {
      return NextResponse.json(
        { error: { code: "unauthenticated", message: "Sign in required" } },
        { status: 401, headers: { "cache-control": "no-store" } },
      );
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/live/:path*"],
};
