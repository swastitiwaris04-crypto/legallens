import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export function createMiddlewareClient(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set(name, value)
          supabaseResponse = NextResponse.next({ request })
          supabaseResponse.cookies.set(name, value, options)
        },
        remove(name, options) {
          request.cookies.set(name, '')
          supabaseResponse = NextResponse.next({ request })
          supabaseResponse.cookies.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  return { supabase, supabaseResponse }
}
