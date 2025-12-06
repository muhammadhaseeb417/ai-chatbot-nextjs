// This endpoint lets users check their remaining quota without using it
// Why separate endpoint? Allows UI to display quota without making a chat request

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRateLimitStatus } from '@/lib/rate-limit'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const status = await getRateLimitStatus(user.id)

    return NextResponse.json(status)
  } catch (error) {
    console.error('Error getting rate limit status:', error)
    return NextResponse.json(
      { error: 'Failed to get rate limit status' },
      { status: 500 }
    )
  }
}