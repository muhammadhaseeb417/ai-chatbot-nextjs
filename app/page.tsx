// This is a Server Component by default (no 'use client')
// Why? Server components are more performant and secure

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AuthForm from '@/components/auth-form'

export default async function Home() {
  // Check if user is already logged in
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If logged in and verified, redirect to chat
  if (user?.email_confirmed_at) {
    redirect('/chat')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm />
    </div>
  )
}