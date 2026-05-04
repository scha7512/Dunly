'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'

const LOGICIELS = [
  { id: 'pennylane', label: 'Pennylane', icon: '🟣' },
  { id: 'quickbooks', label: 'QuickBooks', icon: '🟢' },
  { id: 'autre', label: 'Autre logiciel', icon: '📄' },
  { id: 'aucun', label: 'Aucun pour l\'instant', icon: '✋' },
]

const DELAIS = [
  { value: 'moins30', label: 'Moins de 30 jours' },
  { value: '30-60', label: '30 à 60 jours' },
  { value: '60-90', label: '60 à 90 jours' },
  { value: 'plus90', label: 'Plus de 90 jours' },
  { value: 'inconnu', label: 'Je ne sais pas' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [logiciel, setLogiciel] = useState('')
  const [facturesMois, setFacturesMois] = useState(10)
  const [delai, setDelai] = useState('')

  const TOTAL_STEPS = 3

  const handleFinish = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non connecté')

      const { error } = await supabase
        .from('profiles')
        .update({
          logiciel_facturation: logiciel,
          factures_par_mois: facturesMois,
          delai_paiement_actuel: delai,
          onboarding_completed: true,
        })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Bienvenue sur Dunly !')
      router.push('/dashboard')
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(0,255,135,0.06),transparent)]" />

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="font-display font-bold text-3xl text-white mb-6">
            DUNL<span className="text-[#00FF87]">Y</span>
          </div>

          {/* Progress bar */}
          <div className="flex items-center justify-between mb-3">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  s < step ? 'bg-[#00FF87] text-black' :
                  s === step ? 'bg-[rgba(0,255,135,0.2)] text-[#00FF87] border border-[#00FF87]' :
                  'bg-[#1A1A1A] text-[#555]'
                }`}>
                  {s < step ? '✓' : s}
                </div>
                {s < 3 && (
                  <div className="flex-1 h-px mx-2 bg-[#1A1A1A] overflow-hidden">
                    <div
                      className="h-full bg-[#00FF87] transition-all duration-500"
                      style={{ width: step > s ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-sm text-[#888]">Étape {step}/{TOTAL_STEPS}</p>
        </div>

        {/* Contenu de l'étape */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass border border-[#1A1A1A] rounded-3xl p-8"
          >
            {/* Étape 1 : Logiciel */}
            {step === 1 && (
              <div>
                <h2 className="font-display font-bold text-2xl text-white mb-2">
                  Quel logiciel de facturation utilises-tu ?
                </h2>
                <p className="text-[#888] text-sm mb-6">On s&apos;y connectera pour importer tes factures automatiquement.</p>
                <div className="grid grid-cols-2 gap-3">
                  {LOGICIELS.map(l => (
                    <button
                      key={l.id}
                      onClick={() => setLogiciel(l.id)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                        logiciel === l.id
                          ? 'border-[#00FF87] bg-[rgba(0,255,135,0.08)]'
                          : 'border-[#1A1A1A] bg-[#0D0D0D] hover:border-[#333]'
                      }`}
                    >
                      <div className="text-2xl mb-2">{l.icon}</div>
                      <div className="text-sm font-medium text-white">{l.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Étape 2 : Factures par mois */}
            {step === 2 && (
              <div>
                <h2 className="font-display font-bold text-2xl text-white mb-2">
                  Combien de factures envoies-tu par mois ?
                </h2>
                <p className="text-[#888] text-sm mb-8">Pour adapter le plan le plus adapté à tes besoins.</p>

                <div className="text-center mb-8">
                  <motion.div
                    key={facturesMois}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-display font-bold text-7xl text-[#00FF87] mb-2"
                  >
                    {facturesMois}
                  </motion.div>
                  <div className="text-[#888] text-sm">factures / mois</div>
                </div>

                <input
                  type="range"
                  min="1"
                  max="200"
                  value={facturesMois}
                  onChange={e => setFacturesMois(Number(e.target.value))}
                  className="w-full accent-[#00FF87] h-2 bg-[#1A1A1A] rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[#555] mt-2">
                  <span>1</span>
                  <span>50</span>
                  <span>100</span>
                  <span>200</span>
                </div>
              </div>
            )}

            {/* Étape 3 : Délai actuel */}
            {step === 3 && (
              <div>
                <h2 className="font-display font-bold text-2xl text-white mb-2">
                  Quel est ton délai moyen de paiement actuel ?
                </h2>
                <p className="text-[#888] text-sm mb-6">On mesurera tes progrès avec Dunly.</p>
                <div className="space-y-2">
                  {DELAIS.map(d => (
                    <button
                      key={d.value}
                      onClick={() => setDelai(d.value)}
                      className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all duration-200 ${
                        delai === d.value
                          ? 'border-[#00FF87] bg-[rgba(0,255,135,0.08)] text-white'
                          : 'border-[#1A1A1A] bg-[#0D0D0D] text-[#888] hover:border-[#333] hover:text-white'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(s => s - 1)}>
              <ChevronLeft size={16} />
              Retour
            </Button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !logiciel}
            >
              Continuer
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              loading={loading}
              disabled={!delai}
            >
              Accéder à mon dashboard →
            </Button>
          )}
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="block w-full text-center text-sm text-[#555] hover:text-[#888] mt-4 transition-colors"
        >
          Passer cette étape
        </button>
      </div>
    </div>
  )
}
