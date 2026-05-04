'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('Email invalide'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      setSent(true)
    } catch {
      toast.error('Erreur lors de l\'envoi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(0,255,135,0.06),transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-[#888] hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={14} />
          Retour à la connexion
        </Link>

        {!sent ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-[rgba(0,255,135,0.1)] flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-[#00FF87]" />
              </div>
              <h1 className="text-2xl font-semibold text-white">Mot de passe oublié ?</h1>
              <p className="text-[#888] text-sm mt-2">
                Saisis ton email pour recevoir un lien de réinitialisation.
              </p>
            </div>

            <div className="glass border border-[#1A1A1A] rounded-3xl p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  {...register('email')}
                  type="email"
                  label="Email"
                  placeholder="toi@exemple.fr"
                  icon={<Mail size={16} />}
                  error={errors.email?.message}
                />
                <Button type="submit" loading={loading} size="lg" className="w-full">
                  Envoyer le lien
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[rgba(0,255,135,0.1)] flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-[#00FF87]" />
            </div>
            <h2 className="font-display font-bold text-3xl text-white mb-3">Email envoyé !</h2>
            <p className="text-[#888] leading-relaxed mb-8">
              Vérifie ta boîte mail. Le lien est valable 1 heure.
            </p>
            <Link href="/auth/login">
              <Button variant="secondary" size="lg">
                Retour à la connexion
              </Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
