import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuth = !!token
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin")
  const isApiRoute = req.nextUrl.pathname.startsWith("/api")

  // Allow auth pages and API routes
  if (isAuthPage || isApiRoute) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated and trying to access protected routes
  if (!isAuth && isAdminPage) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  // Check role-based access for admin routes
  if (isAdminPage && token) {
    const userRole = token.role

    // Only allow ADMIN, MANAGER, and STAFF roles to access admin panel
    if (!["ADMIN", "MANAGER", "STAFF"].includes(userRole as string)) {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
}
