// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createServerSupabase } from '../../../../lib/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  let nextPath = url.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createServerSupabase()
    // exchange the code for a session (access + refresh tokens)
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // redirect user to intended page (dashboard)
      return NextResponse.redirect(new URL(nextPath, request.url))
    } else {
      // handle error (simple fallback)
      return NextResponse.redirect(new URL(`/auth/error?reason=${encodeURIComponent(error.message)}`, request.url))
    }
  }

  return NextResponse.redirect(new URL('/', request.url))
}
