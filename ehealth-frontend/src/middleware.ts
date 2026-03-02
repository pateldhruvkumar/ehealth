import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "auth_token"; // matches AUTH_TOKEN_KEY in lib/constants.ts

const PROTECTED_PREFIXES = ["/patient", "/doctor", "/onboarding"];
const AUTH_ONLY_PREFIXES = ["/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) && !token) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (AUTH_ONLY_PREFIXES.some((p) => pathname.startsWith(p)) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
