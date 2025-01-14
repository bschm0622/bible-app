import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Log the middleware activity with a timestamp
  console.log(`[${new Date().toISOString()}] Middleware running for: ${request.nextUrl.pathname}`);
  
  // List of protected routes
  const protectedRoutes = ['/create_plan', '/view_plans'];

  // Check if the requested path is protected
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    console.log(`Protected route accessed: ${request.nextUrl.pathname} - redirecting to login`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Continue the request for non-protected routes
  const response = NextResponse.next();
  response.headers.set('x-middleware-test', 'active');
  return response;
}

// Matcher updated to include both /create_plan and /view_plans
export const config = {
  matcher: ['/create_plan', '/view_plans'],
};
