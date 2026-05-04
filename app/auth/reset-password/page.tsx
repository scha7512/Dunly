'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const schema = z.object({
  password: z.string().min(8, 'Minimum 8 caractères').regex(/[A-Z]/, 'Doit contenir une majuscule'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirm'],
})

type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: data.password })
      if (error) throw error
      toast.success('Mot de passe mis à jour !')
      router.push('/dashboard')
    } catch {
      toast.error('Erreur lors de la mise à jour')
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
        <div className="text-center mb-8">
          <div className="font-display font-bold text-3xl text-white mb-4">
            DUNL<span className="text-[#00FF87]">Y</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Nouveau mot de passe</h1>
          <p className="text-[#888] text-sm mt-2">Choisis un mot de passe sécurisé</p>
        </div>

        <div className="glass border border-[#1A1A1A] rounded-3xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Input
                {...register('password')}
                type={showPwd ? 'text' : 'password'}
                label="Nouveau mot de passe"
                placeholder="••••••••"
                icon={<Lock size={16} />}
                error={errors.password?.message}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-[38px] text-[#555] hover:text-white">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Input
              {...register('confirm')}
              type="password"
              label="Confirmer le mot de passe"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              error={errors.confirm?.message}
            />

            <Button type="submit" loading={loading} size="lg" className="w-full">
              Enregistrer le mot de passe
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
