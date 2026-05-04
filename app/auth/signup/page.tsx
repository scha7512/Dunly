'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Mail, Lock, User, Building, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const schema = z.object({
  prenom: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
  nom: z.string().min(2, 'Nom requis (min. 2 caractères)'),
  email: z.string().email('Email invalide'),
  entreprise: z.string().min(2, 'Nom d\'entreprise requis'),
  password: z.string()
    .min(8, 'Mot de passe : 8 caractères minimum')
    .regex(/[A-Z]/, 'Doit contenir une majuscule')
    .regex(/[0-9]/, 'Doit contenir un chiffre'),
})

type FormData = z.infer<typeof schema>

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { ok: password.length >= 8, label: '8 caractères' },
    { ok: /[A-Z]/.test(password), label: 'Majuscule' },
    { ok: /[0-9]/.test(password), label: 'Chiffre' },
    { ok: /[^A-Za-z0-9]/.test(password), label: 'Symbole' },
  ]
  const strength = checks.filter(c => c.ok).length

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= strength
                ? strength <= 1 ? 'bg-[#FF4444]'
                  : strength <= 2 ? 'bg-[#FFB800]'
                  : strength <= 3 ? 'bg-[#00CC6A]'
                  : 'bg-[#00FF87]'
                : 'bg-[#1A1A1A]'
            }`}
          />
        ))}
      </div>
      <div className="flex gap-3 flex-wrap">
        {checks.map(c => (
          <span key={c.label} className={`text-xs ${c.ok ? 'text-[#00FF87]' : 'text-[#555]'}`}>
            {c.ok ? '✓' : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const password = watch('password', '')

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            prenom: data.prenom,
            nom: data.nom,
            entreprise: data.entreprise,
          },
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      })
      if (error) throw error
      setEmailSent(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'inscription'
      toast.error(message.includes('already registered') ? 'Cet email est déjà utilisé' : message)
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-[rgba(0,255,135,0.1)] flex items-center justify-center mx-auto mb-6">
            <Mail size={32} className="text-[#00FF87]" />
          </div>
          <h2 className="font-display font-bold text-3xl text-white mb-3">Vérifie ta boîte mail</h2>
          <p className="text-[#888] leading-relaxed mb-6">
            On a envoyé un lien de confirmation à ton adresse. Clique dessus pour activer ton compte Dunly.
          </p>
          <p className="text-sm text-[#555]">
            Pas reçu ?{' '}
            <button onClick={() => setEmailSent(false)} className="text-[#00FF87] hover:underline">
              Renvoyer l&apos;email
            </button>
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(0,255,135,0.06),transparent)]" />

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
          <h1 className="text-xl font-semibold text-white mt-4">Créer ton compte</h1>
          <p className="text-[#888] text-sm mt-2">14 jours gratuits — sans carte bancaire</p>
        </div>

        <div className="glass border border-[#1A1A1A] rounded-3xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                {...register('prenom')}
                label="Prénom"
                placeholder="Jean"
                icon={<User size={16} />}
                error={errors.prenom?.message}
              />
              <Input
                {...register('nom')}
                label="Nom"
                placeholder="Dupont"
                error={errors.nom?.message}
              />
            </div>

            <Input
              {...register('email')}
              type="email"
              label="Email professionnel"
              placeholder="jean@monentreprise.fr"
              icon={<Mail size={16} />}
              error={errors.email?.message}
            />

            <Input
              {...register('entreprise')}
              label="Nom de l'entreprise"
              placeholder="Mon Entreprise SAS"
              icon={<Building size={16} />}
              error={errors.entreprise?.message}
            />

            <div>
              <div className="relative">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  label="Mot de passe"
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-[#555] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && <PasswordStrength password={password} />}
            </div>

            <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
              Créer mon compte gratuitement
            </Button>

            <p className="text-xs text-[#555] text-center">
              En créant un compte, tu acceptes nos{' '}
              <a href="#" className="text-[#888] hover:text-white">CGU</a>{' '}
              et notre{' '}
              <a href="#" className="text-[#888] hover:text-white">politique de confidentialité</a>.
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-[#888] mt-6">
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="text-[#00FF87] hover:underline">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
