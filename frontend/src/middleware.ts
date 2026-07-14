import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Auth isn't wired up yet. Flip this to true once the backend issues real
// auth_token cookies, so the dashboard stays reachable in the meantime.
const AUTH_ENABLED = false

export function middleware(request: NextRequest) {
  // The dashboard is the landing page for now. The public intake form at
  // app/page.tsx is parked until the team decides where it should live.
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const token = request.cookies.get('auth_token')
  const isProtected = request.nextUrl.pathname.startsWith('/dashboard')

  if (AUTH_ENABLED && isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
}
