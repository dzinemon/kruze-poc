import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Only active on staging deployments
  if (!process.env.SANITY_IS_STAGING) return NextResponse.next();

  // Skip API routes to avoid redirect loops
  if (request.nextUrl.pathname.startsWith("/api/")) return NextResponse.next();

  // Already in draft mode — nothing to do
  if (request.cookies.has("__prerender_bypass")) return NextResponse.next();

  // Redirect through the staging-enable handler to set the draft mode cookie,
  // then return to the original page
  const url = request.nextUrl.clone();
  url.pathname = "/api/draft-mode/staging-enable";
  url.searchParams.set("returnTo", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
