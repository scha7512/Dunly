'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
  remember: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/dashboard'
  const supabase = createClient()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) throw error
      toast.success('Connexion réussie !')
      router.push(redirectTo)
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de connexion'
      toast.error(
        message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect'
          : message
      )
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
        },
      })
      if (error) throw error
    } catch {
      toast.error('Erreur avec Google. Vérifie que Google OAuth est activé dans Supabase.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      {/* Fond radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(0,255,135,0.06),transparent)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="font-display font-bold text-3xl text-white">
            DUNL<span className="text-[#00FF87]">Y</span>
          </Link>
          <h1 className="text-xl font-semibold text-white mt-4">Bon retour 👋</h1>
          <p className="text-[#888] text-sm mt-2">Connecte-toi à ton espace Dunly</p>
        </div>

        {/* Card */}
        <div className="glass border border-[#1A1A1A] rounded-3xl p-8">
          {/* Google OAuth */}
          <button
            onClick={signInWithGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[#1A1A1A] bg-[#0D0D0D] text-white text-sm font-medium hover:border-[#333] transition-colors mb-6 disabled:opacity-50"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-label="Google">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continuer avec Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#1A1A1A]" />
            <span className="text-xs text-[#555]">ou par email</span>
            <div className="flex-1 h-px bg-[#1A1A1A]" />
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="toi@exemple.fr"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              autoComplete="email"
            />

            <div className="relative">
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                label="Mot de passe"
                placeholder="••••••••"
                icon={<Lock size={16} />}
                error={errors.password?.message}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-[#555] hover:text-white transition-colors"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[#888] cursor-pointer">
                <input
                  {...register('remember')}
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#1A1A1A] bg-[#0D0D0D] accent-[#00FF87]"
                />
                Se souvenir de moi
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#00FF87] hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
              Se connecter
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[#888] mt-6">
          Pas encore de compte ?{' '}
          <Link href="/auth/signup" className="text-[#00FF87] hover:underline font-medium">
            Créer un compte gratuit
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
