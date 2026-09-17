import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Better Auth session token cookie
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthRoute = pathname.startsWith("/sign-up");
  const isApiRoute = pathname.startsWith("/api");

  // 1. ถ้ายังไม่ได้ล็อกอิน และพยายามเข้าหน้าภายใน -> ให้ redirect ไปหน้า /sign-up
  if (!sessionToken && !isAuthRoute && !isApiRoute) {
    const signInUrl = new URL("/sign-up", request.url);
    signInUrl.searchParams.set("mode", "signin");
    return NextResponse.redirect(signInUrl);
  }

  // 2. ถ้าล็อกอินอยู่แล้ว และเข้าหน้า /sign-up -> ให้ redirect ไปที่ /dashboard
  if (sessionToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset files (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

