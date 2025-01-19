'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(email: string) {
  const supabase = await createClient()

  // Send magic link to the provided email for sign-in
  const { error } = await supabase.auth.signInWithOtp({ email })

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/check_your_email')
}

export async function signup(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  })

  if (error) {
    switch (error.message) {
      case 'User already registered':
        return { error: 'This email is already registered' }
      case 'Invalid email':
        return { error: 'Please enter a valid email address' }
      case 'To many requests':
        return { error: 'Too many attempts. Please try again later' }
      default:
        return { error: 'Failed to send magic link. Please try again' }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/check_your_email')
}

// Email/Password login
export async function emailPasswordLogin(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/plans/create')
}

// Email/Password signup
export async function emailPasswordSignup(email: string, password: string) {
  const supabase = await createClient()

  if (password.length < 6) {
    // Instead of redirect, consider returning error messages
    return { error: 'Password must be at least 6 characters' }
  }

  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    // Handle specific error cases
    switch (error.message) {
      case 'User already registered':
        return { error: 'This email is already registered' }
      default:
        return { error: error.message }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/plans/create')
}
