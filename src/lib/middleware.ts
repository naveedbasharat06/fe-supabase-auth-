import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createMiddlewareClient({ req: request, res: response })
  const session = await supabase.auth.getSession() // refreshes session if expired
  console.log(session.data.session,"session is here ")
  return response
}
