import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/savings",
  "/investments",
  "/reports",
  "/goals",
  "/settings",
];

// Routes only for unauthenticated users (redirect to dashboard if already authed)
const AUTH_PREFIXES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // auth_session cookie is set by AuthProvider when Firebase confirms the user.
  // It acts as a UX hint for the middleware — real security is enforced by
  // Firebase Security Rules on the backend.
  const isAuthenticated = request.cookies.has("auth_session");

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname); // preserve intended destination
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on every route except static assets and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
