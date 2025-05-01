import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/" || path === "/learn";

  // Define protected paths that require authentication
  const isProtectedPath =
    path === "/chat" || path === "/wallet" || path === "/profile";

  // Check if user is authenticated (either through cookies or localStorage)
  const isAuthenticated =
    request.cookies.has("finai-auth") ||
    request.cookies.has("next-auth.session-token") ||
    request.headers.get("x-auth-status") === "authenticated";

  // Redirect logic
  if (!isAuthenticated && isProtectedPath) {
    // Redirect to login if trying to access protected route without auth
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && path === "/login") {
    // Redirect to chat if already logged in and trying to access login page
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

// Configure which paths should trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /icons (inside /public)
     * 5. /images (inside /public)
     * 6. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|fonts|icons|images|[\\w-]+\\.\\w+).*)",
  ],
};
