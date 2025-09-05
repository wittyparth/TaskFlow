import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname

  // Define paths that are considered public (accessible without authentication)
  const isPublicPath = path === '/' || 
                      path === '/signin' || 
                      path === '/signup' || 
                      path === '/forgot-password' || 
                      path === '/verify-email' || 
                      path === '/reset-password' ||
                      path === '/pricing'

  // Define paths that require authentication
  const isProtectedPath = path.startsWith('/dashboard') ||
                         path.startsWith('/projects') ||
                         path.startsWith('/tasks') ||
                         path.startsWith('/team') ||
                         path.startsWith('/analytics') ||
                         path.startsWith('/settings') ||
                         path.startsWith('/billing') ||
                         path.startsWith('/notifications') ||
                         path.startsWith('/search')

  // Get the token from the cookies (you would replace this with your actual auth logic)
  const token = request.cookies.get('authToken')?.value || ''

  // If user is on a protected path and not authenticated, redirect to signin
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (token && (path === '/signin' || path === '/signup' || path === '/forgot-password')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
