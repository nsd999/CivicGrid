// CivicGrid — Next.js Middleware
// Protects /dashboard routes. Auth.js handles JWT verification.

import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest & { auth?: unknown }) => {
  const { pathname } = req.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!(req as NextRequest & { auth?: { user?: unknown } }).auth?.user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  // Run middleware on all routes except static files and API internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
