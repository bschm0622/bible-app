import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Add timestamp to make console logs clearly visible
  console.log(`[${new Date().toISOString()}] Middleware running for: ${request.nextUrl.pathname}`)
  
  const response = NextResponse.next()
  response.headers.set('x-middleware-test', 'active')
  
  if (request.nextUrl.pathname === '/create_plan') {
    console.log('Protected route accessed - redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return response
}
 
// Matcher updated to explicitly match create_plan
export const config = {
  matcher: '/create_plan'
}