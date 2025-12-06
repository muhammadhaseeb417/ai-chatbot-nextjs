// This handles the redirect after email verification
// Why? Supabase sends users here after clicking email confirmation link

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to chat page after successful verification
  return NextResponse.redirect(new URL('/chat', request.url))
}