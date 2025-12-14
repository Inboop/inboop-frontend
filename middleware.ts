import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  const isAppSubdomain = hostname.startsWith('app.');
  const isLocalhost = hostname.includes('localhost');

  // App routes that require authentication
  const appRoutes = ['/inbox', '/leads', '/orders', '/analytics', '/settings'];
  const isAppRoute = appRoutes.some(route => pathname.startsWith(route));

  // Marketing routes
  const marketingRoutes = ['/', '/login', '/register'];
  const isMarketingRoute = marketingRoutes.includes(pathname);

  // Skip middleware for API routes, static files, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // On localhost, allow normal routing
  if (isLocalhost) {
    return NextResponse.next();
  }

  // On app.inboop.com
  if (isAppSubdomain) {
    // Redirect marketing routes to main domain
    if (isMarketingRoute) {
      return NextResponse.redirect(new URL(pathname, 'https://inboop.com'));
    }
    // Allow app routes
    return NextResponse.next();
  }

  // On inboop.com (main domain)
  if (!isAppSubdomain) {
    // Redirect app routes to app subdomain
    if (isAppRoute) {
      return NextResponse.redirect(new URL(pathname, 'https://app.inboop.com'));
    }
    // Allow marketing routes
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
