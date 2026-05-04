import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Callback OAuth (Google) et email confirmation
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Sécurité : ne rediriger que vers des URLs relatives (même domaine)
      const redirectTo = next.startsWith('/') ? next : '/dashboard'
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  // Erreur : rediriger vers la page de connexion avec message d'erreur
  return NextResponse.redirect(
    `${origin}/auth/login?error=auth_callback_error`
  )
}
