// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Don't block admin, login, or maintenance routes
  if (req.nextUrl.pathname.startsWith('/admin')) return res
  if (req.nextUrl.pathname.startsWith('/login')) return res
  if (req.nextUrl.pathname.startsWith('/maintenance')) return res

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: () => {},
      },
    }
  )

  const { data } = await supabase
    .from('site_settings')
    .select('maintenance_mode')
    .single()

  if (data?.maintenance_mode) {
    return NextResponse.rewrite(new URL('/maintenance', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}