// This is the core security component - all rate limiting happens server-side
// Why? Client-side checks can be bypassed; server-side cannot

import { createAdminClient } from './supabase/admin'

const DAILY_LIMIT = 10

export async function checkAndUpdateRateLimit(userId: string): Promise<{
  allowed: boolean
  remaining: number
  message?: string
}> {
  const supabase = createAdminClient()
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

  try {
    // Try to get existing record for this user
    const { data: existing, error: fetchError } = await supabase
      .from('user_requests')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (expected for new users)
      throw fetchError
    }

    if (!existing) {
      // First request ever for this user - create record
      const { error: insertError } = await supabase
        .from('user_requests')
        .insert({
          user_id: userId,
          request_count: 1,
          last_reset_date: today,
        })

      if (insertError) throw insertError

      return { allowed: true, remaining: DAILY_LIMIT - 1 }
    }

    // Check if we need to reset the counter (new day)
    if (existing.last_reset_date !== today) {
      // New day - reset counter
      const { error: updateError } = await supabase
        .from('user_requests')
        .update({
          request_count: 1,
          last_reset_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      if (updateError) throw updateError

      return { allowed: true, remaining: DAILY_LIMIT - 1 }
    }

    // Same day - check if under limit
    if (existing.request_count >= DAILY_LIMIT) {
      return {
        allowed: false,
        remaining: 0,
        message: `Daily limit of ${DAILY_LIMIT} requests reached. Resets at midnight UTC.`,
      }
    }

    // Under limit - increment counter
    const newCount = existing.request_count + 1
    const { error: updateError } = await supabase
      .from('user_requests')
      .update({
        request_count: newCount,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (updateError) throw updateError

    return { allowed: true, remaining: DAILY_LIMIT - newCount }
  } catch (error) {
    console.error('Rate limit check error:', error)
    // On error, deny request (fail-safe)
    return {
      allowed: false,
      remaining: 0,
      message: 'Error checking rate limit. Please try again.',
    }
  }
}

// Helper function to get current usage without incrementing
export async function getRateLimitStatus(userId: string): Promise<{
  used: number
  remaining: number
  limit: number
}> {
  const supabase = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  try {
    const { data, error } = await supabase
      .from('user_requests')
      .select('request_count, last_reset_date')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (!data || data.last_reset_date !== today) {
      // No data or old data - user has full quota
      return { used: 0, remaining: DAILY_LIMIT, limit: DAILY_LIMIT }
    }

    const used = data.request_count
    return {
      used,
      remaining: Math.max(0, DAILY_LIMIT - used),
      limit: DAILY_LIMIT,
    }
  } catch (error) {
    console.error('Error getting rate limit status:', error)
    return { used: 0, remaining: 0, limit: DAILY_LIMIT }
  }
}