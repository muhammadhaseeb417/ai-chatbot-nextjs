// Admin client with elevated privileges for rate limiting
// Why? We need to reliably check/update request counts without RLS interference

import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  // Service role key bypasses RLS - use with extreme caution
  // Never expose this client to browser or client components
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}