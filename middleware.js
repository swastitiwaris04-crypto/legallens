import { createMiddlewareClient } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'

const protectedPaths = ['/dashboard', '/results', '/compare', '/obligations']
const authPaths = ['/login', '/signup']

export async function middleware(request) {
  const { supabase, supabaseResponse } = createMiddlewareClient(request)
  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  const isProtected = protectedPaths.some(p => path.startsWith(p))
  const isAuthPage = authPaths.some(p => path.startsWith(p))

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', path)
    return NextResponse.redirect(url)
  }

  if (isAuthPage && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth|api/share|$).*)',
  ],
}
