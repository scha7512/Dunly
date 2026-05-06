'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { ChevronRight, ChevronLeft, User, Phone, MapPin, Building2, FileText, Clock, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const LOGICIELS = [
  { id: 'pennylane', label: 'Pennylane', icon: '🟣' },
  { id: 'quickbooks', label: 'QuickBooks', icon: '🟢' },
  { id: 'excel', label: 'Excel / CSV', icon: '📄' },
  { id: 'autre', label: 'Autre', icon: '🔧' },
  { id: 'aucun', label: 'Aucun pour l\'instant', icon: '✋' },
]

const SECTEURS = [
  'Consulting / Conseil', 'Design / Créatif', 'Développement web', 'BTP / Artisanat',
  'Comptabilité / Finance', 'Marketing / Communication', 'Santé / Bien-être',
  'Formation / Coaching', 'Commerce / Distribution', 'Autre',
]

const DELAIS = [
  { value: 'moins30', label: 'Moins de 30 jours' },
  { value: '30-60', label: '30 à 60 jours' },
  { value: '60-90', label: '60 à 90 jours' },
  { value: 'plus90', label: 'Plus de 90 jours' },
  { value: 'inconnu', label: 'Je ne sais pas' },
]

const STEPS = [
  { id: 1, label: 'Identité', icon: User },
  { id: 2, label: 'Localisation', icon: MapPin },
  { id: 3, label: 'Entreprise', icon: Building2 },
  { id: 4, label: 'Facturation', icon: FileText },
  { id: 5, label: 'Délais', icon: Clock },
]

interface FormData {
  prenom: string
  nom: string
  telephone: string
  date_naissance: string
  ville: string
  code_postal: string
  pays: string
  entreprise: string
  siret: string
  secteur: string
  logiciel: string
  factures_mois: number
  delai: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showSkipWarning, setShowSkipWarning] = useState(false)

  const [form, setForm] = useState<FormData>({
    prenom: '', nom: '', telephone: '', date_naissance: '',
    ville: '', code_postal: '', pays: 'France',
    entreprise: '', siret: '', secteur: '',
    logiciel: '', factures_mois: 10, delai: '',
  })

  const set = (key: keyof FormData, value: string | number) =>
    setForm(f => ({ ...f, [key]: value }))

  const handleFinish = async (complet: boolean) => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non connecté')

      await supabase.from('profiles').update({
        prenom: form.prenom || null,
        nom: form.nom || null,
        telephone: form.telephone || null,
        date_naissance: form.date_naissance || null,
        ville: form.ville || null,
        code_postal: form.code_postal || null,
        pays: form.pays || 'France',
        entreprise: form.entreprise || null,
        siret: form.siret || null,
        secteur: form.secteur || null,
        logiciel_facturation: form.logiciel || null,
        factures_par_mois: form.factures_mois,
        delai_paiement_actuel: form.delai || null,
        onboarding_completed: complet,
        profil_complet: complet,
      }).eq('id', user.id)

      toast.success(complet ? 'Bienvenue sur Dunly ! 🎉' : 'Tu pourras compléter ton profil plus tard.')
      router.push('/dashboard')
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const canNext = () => {
    if (step === 1) return form.prenom.length >= 2 && form.nom.length >= 2
    if (step === 2) return form.ville.length >= 2
    if (step === 3) return form.entreprise.length >= 2 && form.secteur !== ''
    if (step === 4) return form.logiciel !== ''
    if (step === 5) return form.delai !== ''
    return true
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(0,255,135,0.06),transparent)]" />

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-display font-bold text-3xl text-white mb-6">
            DUNL<span className="text-[#00FF87]">Y</span>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-1 mb-4">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 ${
                  s.id < step ? 'bg-[#00FF87] text-black' :
                  s.id === step ? 'bg-[rgba(0,255,135,0.2)] text-[#00FF87] border border-[#00FF87]' :
                  'bg-[#1A1A1A] text-[#555]'
                }`}>
                  {s.id < step ? '✓' : s.id}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-6 h-px mx-1 bg-[#1A1A1A] overflow-hidden">
                    <div className="h-full bg-[#00FF87] transition-all duration-500" style={{ width: step > s.id ? '100%' : '0%' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-[#555]">Étape {step}/{STEPS.length} — {STEPS[step-1].label}</p>
        </div>

        {/* Contenu */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="glass border border-[#1A1A1A] rounded-3xl p-8"
          >
            {/* ÉTAPE 1 — Identité */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <User size={18} className="text-[#00FF87]" />
                  <h2 className="font-display font-bold text-2xl text-white">Qui es-tu ?</h2>
                </div>
                <p className="text-[#888] text-sm mb-6">Ces informations nous permettent de personnaliser tes relances.</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#888] mb-1.5 block">Prénom *</label>
                      <input
                        value={form.prenom}
                        onChange={e => set('prenom', e.target.value)}
                        placeholder="Jean"
                        className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF87] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#888] mb-1.5 block">Nom *</label>
                      <input
                        value={form.nom}
                        onChange={e => set('nom', e.target.value)}
                        placeholder="Dupont"
                        className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF87] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#888] mb-1.5 block">
                      <Phone size={11} className="inline mr-1" />Téléphone
                    </label>
                    <input
                      value={form.telephone}
                      onChange={e => set('telephone', e.target.value)}
                      placeholder="06 12 34 56 78"
                      type="tel"
                      className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF87] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#888] mb-1.5 block">Date de naissance</label>
                    <input
                      value={form.date_naissance}
                      onChange={e => set('date_naissance', e.target.value)}
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF87] transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ÉTAPE 2 — Localisation */}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={18} className="text-[#00FF87]" />
                  <h2 className="font-display font-bold text-2xl text-white">Où es-tu basé ?</h2>
                </div>
                <p className="text-[#888] text-sm mb-6">Pour adapter les mentions légales de tes relances.</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#888] mb-1.5 block">Ville *</label>
                      <input
                        value={form.ville}
                        onChange={e => set('ville', e.target.value)}
                        placeholder="Paris"
                        className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF87] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#888] mb-1.5 block">Code postal</label>
                      <input
                        value={form.code_postal}
                        onChange={e => set('code_postal', e.target.value)}
                        placeholder="75001"
                        className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF87] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#888] mb-1.5 block">Pays</label>
                    <select
                      value={form.pays}
                      onChange={e => set('pays', e.target.value)}
                      className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF87] transition-colors"
                    >
                      {['France', 'Belgique', 'Suisse', 'Luxembourg', 'Canada', 'Autre'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ÉTAPE 3 — Entreprise */}
            {step === 3 && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 size={18} className="text-[#00FF87]" />
                  <h2 className="font-display font-bold text-2xl text-white">Ton entreprise</h2>
                </div>
                <p className="text-[#888] text-sm mb-6">Pour personnaliser les emails envoyés à tes clients.</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#888] mb-1.5 block">Nom de l&apos;entreprise *</label>
                    <input
                      value={form.entreprise}
                      onChange={e => set('entreprise', e.target.value)}
                      placeholder="Ma Société SAS"
                      className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF87] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#888] mb-1.5 block">SIRET (optionnel)</label>
                    <input
                      value={form.siret}
                      onChange={e => set('siret', e.target.value)}
                      placeholder="123 456 789 00012"
                      className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF87] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#888] mb-1.5 block">Secteur d&apos;activité *</label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {SECTEURS.map(s => (
                        <button
                          key={s}
                          onClick={() => set('secteur', s)}
                          className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                            form.secteur === s
                              ? 'border-[#00FF87] bg-[rgba(0,255,135,0.08)] text-white'
                              : 'border-[#1A1A1A] bg-[#0D0D0D] text-[#888] hover:border-[#333] hover:text-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ÉTAPE 4 — Logiciel */}
            {step === 4 && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={18} className="text-[#00FF87]" />
                  <h2 className="font-display font-bold text-2xl text-white">Ton logiciel de facturation</h2>
                </div>
                <p className="text-[#888] text-sm mb-6">On s&apos;y connectera pour importer tes factures automatiquement.</p>
                <div className="grid grid-cols-2 gap-3">
                  {LOGICIELS.map(l => (
                    <button
                      key={l.id}
                      onClick={() => set('logiciel', l.id)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                        form.logiciel === l.id
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

            {/* ÉTAPE 5 — Délais + volume */}
            {step === 5 && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={18} className="text-[#00FF87]" />
                  <h2 className="font-display font-bold text-2xl text-white">Tes délais actuels</h2>
                </div>
                <p className="text-[#888] text-sm mb-6">On mesurera tes progrès avec Dunly.</p>

                <div className="mb-6">
                  <label className="text-xs text-[#888] mb-3 block">Factures envoyées par mois</label>
                  <div className="text-center mb-4">
                    <motion.div
                      key={form.factures_mois}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-display font-bold text-6xl text-[#00FF87]"
                    >
                      {form.factures_mois}
                    </motion.div>
                  </div>
                  <input
                    type="range" min="1" max="200" value={form.factures_mois}
                    onChange={e => set('factures_mois', Number(e.target.value))}
                    className="w-full accent-[#00FF87] h-2 bg-[#1A1A1A] rounded-full cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-[#555] mt-1">
                    <span>1</span><span>200</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#888] mb-3 block">Délai moyen de paiement actuel</label>
                  <div className="space-y-2">
                    {DELAIS.map(d => (
                      <button
                        key={d.value}
                        onClick={() => set('delai', d.value)}
                        className={`w-full p-3.5 rounded-xl border text-left text-sm font-medium transition-all ${
                          form.delai === d.value
                            ? 'border-[#00FF87] bg-[rgba(0,255,135,0.08)] text-white'
                            : 'border-[#1A1A1A] bg-[#0D0D0D] text-[#888] hover:border-[#333] hover:text-white'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1.5 text-sm text-[#888] hover:text-white transition-colors"
            >
              <ChevronLeft size={16} /> Retour
            </button>
          ) : <div />}

          {step < STEPS.length ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="flex items-center gap-1.5 btn-gradient text-black font-bold px-6 py-2.5 rounded-full text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuer <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => handleFinish(true)}
              disabled={loading || !form.delai}
              className="flex items-center gap-1.5 btn-gradient text-black font-bold px-6 py-2.5 rounded-full text-sm disabled:opacity-40"
            >
              {loading ? 'Chargement...' : 'Accéder à mon dashboard →'}
            </button>
          )}
        </div>

        {/* Répondre plus tard — avec avertissement */}
        {!showSkipWarning ? (
          <button
            onClick={() => setShowSkipWarning(true)}
            className="block w-full text-center text-xs text-[#333] hover:text-[#555] mt-4 transition-colors"
          >
            Répondre plus tard
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-[rgba(255,184,0,0.05)] border border-[rgba(255,184,0,0.2)] rounded-2xl p-4"
          >
            <div className="flex items-start gap-2.5 mb-3">
              <AlertTriangle size={15} className="text-[#FFB800] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#888] leading-relaxed">
                <span className="text-[#FFB800] font-semibold">Attention</span> — Sans profil complet, tu ne pourras pas souscrire à un abonnement payant. Tu devras compléter ces informations avant de passer au Starter ou Pro.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSkipWarning(false)}
                className="flex-1 py-2 rounded-xl border border-[#1A1A1A] text-xs text-[#888] hover:text-white transition-colors"
              >
                Continuer le profil
              </button>
              <button
                onClick={() => handleFinish(false)}
                disabled={loading}
                className="flex-1 py-2 rounded-xl bg-[#1A1A1A] text-xs text-[#555] hover:text-white transition-colors"
              >
                Passer quand même
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
