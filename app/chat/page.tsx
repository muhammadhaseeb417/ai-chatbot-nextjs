// Protected page - only accessible to verified users
// Server component checks auth before rendering client component

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ChatInterface from '@/components/chat-interface'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/')
  }

  // Redirect to login if email not verified
  if (!user.email_confirmed_at) {
    redirect('/')
  }

  return <ChatInterface />
}