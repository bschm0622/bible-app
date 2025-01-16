import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Redirect authenticated users away from auth pages
  if (session && (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup'
  )) {
    return NextResponse.redirect(new URL('/account', request.url))
  }

  // Protect all routes under /plans and /account
  if (!session && (
    request.nextUrl.pathname.startsWith('/plans') ||
    request.nextUrl.pathname.startsWith('/account')
  )) {
    // Store the original URL to redirect back after login
    const redirectUrl = request.nextUrl.pathname + request.nextUrl.search
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', redirectUrl)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/plans/:path*',
    '/account/:path*',
    '/reset-password',
    '/update-password'
  ]
}