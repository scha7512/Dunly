'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { User, Bell, Plug, CreditCard, X, Check, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/dashboard/Header'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { PLANS } from '@/lib/stripe/client'

const TABS = [
  { id: 'compte', label: 'Compte', icon: User },
  { id: 'relances', label: 'Relances', icon: Bell },
  { id: 'integrations', label: 'Intégrations', icon: Plug },
  { id: 'abonnement', label: 'Abonnement', icon: CreditCard },
]

const PLAN_DETAILS = {
  gratuit: {
    color: '#555',
    description: 'Parfait pour tester Dunly sans engagement. Accès limité aux fonctionnalités de base.',
    inclus: [
      '1 client maximum',
      '3 factures maximum',
      'Tableau de bord basique',
      'Accès à l\'interface complète',
    ],
    non_inclus: [
      'Relances automatiques',
      'Export PDF / CSV',
      'Support prioritaire',
      'Clients illimités',
    ],
  },
  starter: {
    color: '#00CC6A',
    description: 'Idéal pour les freelances et indépendants qui veulent automatiser leurs relances et gagner du temps.',
    inclus: [
      '10 clients',
      '30 factures par mois',
      'Relances automatiques (douce, ferme, urgente)',
      'Templates d\'emails inclus',
      'Tableau de bord complet',
      'Support par email sous 48h',
    ],
    non_inclus: [
      'Clients illimités',
      'Export PDF / CSV',
      'Templates personnalisables',
      'Multi-utilisateurs',
    ],
  },
  pro: {
    color: '#00FF87',
    description: 'La solution complète pour les PME et agences. Tout ce dont tu as besoin pour encaisser plus vite, sans limite.',
    inclus: [
      'Clients illimités',
      'Factures illimitées',
      'Relances automatiques avancées',
      'Templates d\'emails personnalisables',
      'Analytics & rapports détaillés',
      'Export PDF / CSV',
      'Support prioritaire sous 24h',
    ],
    non_inclus: [
      'Multi-utilisateurs (5 comptes)',
      'Marque blanche sur les emails',
      'Intégrations Pennylane & QuickBooks',
      'Account manager dédié',
    ],
  },
  cabinet: {
    color: '#FFB800',
    description: 'Pour les cabinets comptables et grandes structures qui gèrent plusieurs clients simultanément.',
    inclus: [
      'Tout le plan Pro inclus',
      'Multi-utilisateurs (jusqu\'à 5 comptes)',
      'Marque blanche sur les emails de relance',
      'Intégrations Pennylane & QuickBooks',
      'Account manager dédié',
      'SLA garanti 99,9%',
      'Support téléphonique dédié',
    ],
    non_inclus: [],
  },
}

export default function ParametresPage() {
  const [tab, setTab] = useState('compte')
  const [planDetail, setPlanDetail] = useState<string | null>(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const supabase = useMemo(() => createClient(), [])
  const [profile, setProfile] = useState<{
    prenom: string; nom: string; entreprise: string; plan: string
  } | null>(null)
  const [form, setForm] = useState({ prenom: '', nom: '', entreprise: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('prenom, nom, entreprise, plan')
        .eq('id', user.id)
        .single()
      if (data) {
        setProfile(data)
        setForm({ prenom: data.prenom ?? '', nom: data.nom ?? '', entreprise: data.entreprise ?? '' })
      }
    }
    load()
  }, [supabase])

  const saveProfile = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error } = await supabase.from('profiles').update(form).eq('id', user.id)
      if (error) throw error
      toast.success('Profil mis à jour !')
    } catch {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  // Modal détail plan
  const selectedPlan = planDetail ? PLANS[planDetail as keyof typeof PLANS] : null
  const selectedDetail = planDetail ? PLAN_DETAILS[planDetail as keyof typeof PLAN_DETAILS] : null

  return (
    <>
      {/* Modal En savoir plus */}
      {planDetail && selectedPlan && selectedDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPlanDetail(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-3xl p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setPlanDetail(null)} className="absolute top-4 right-4 text-[#555] hover:text-white transition-colors">
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${selectedDetail.color}20` }}>
                <CreditCard size={18} style={{ color: selectedDetail.color }} />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-white">{selectedPlan.name}</h2>
                <p className="text-sm font-bold" style={{ color: selectedDetail.color }}>
                  {selectedPlan.price === 0 ? 'Gratuit' : `${selectedPlan.price}€/mois`}
                </p>
              </div>
            </div>

            <p className="text-[#888] text-sm mb-6 leading-relaxed">{selectedDetail.description}</p>

            {/* Ce qui est inclus */}
            <div className="mb-4">
              <p className="text-xs text-[#555] uppercase tracking-wider mb-3">✅ Ce qui est inclus</p>
              <div className="space-y-2.5">
                {selectedDetail.inclus.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: selectedDetail.color }} />
                    <span className="text-sm text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ce qui n'est pas inclus */}
            {selectedDetail.non_inclus.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-[#555] uppercase tracking-wider mb-3">❌ Non inclus</p>
                <div className="space-y-2.5">
                  {selectedDetail.non_inclus.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <X size={14} className="text-[#333] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[#555]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            {(profile?.plan ?? 'gratuit') !== planDetail && planDetail !== 'gratuit' && (
              <Button className="w-full" onClick={() => { toast.success(`Redirection vers le paiement ${selectedPlan.name}...`); setPlanDetail(null) }}>
                Choisir {selectedPlan.name} — {selectedPlan.price}€/mois ⚡
              </Button>
            )}
            {(profile?.plan ?? 'gratuit') === planDetail && (
              <p className="text-center text-sm text-[#00FF87] font-medium">✓ C&apos;est ton plan actuel</p>
            )}
          </motion.div>
        </div>
      )}

      <Header title="Paramètres" subtitle="Gère ton compte et tes préférences" />
      <div className="p-6 max-w-4xl">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl w-fit mb-8">
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  tab === t.id
                    ? 'bg-[#00FF87] text-black'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Compte */}
        {tab === 'compte' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-6">Informations personnelles</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  value={form.prenom}
                  onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
                />
                <Input
                  label="Nom"
                  value={form.nom}
                  onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                />
                <Input
                  label="Entreprise"
                  value={form.entreprise}
                  onChange={e => setForm(f => ({ ...f, entreprise: e.target.value }))}
                  className="sm:col-span-2"
                />
              </div>
              <div className="mt-6">
                <Button loading={loading} onClick={saveProfile}>Enregistrer</Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Relances */}
        {tab === 'relances' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-6">Délais de relance</h3>
              <div className="space-y-4">
                {[
                  { label: 'Relance douce', key: 'J+30', default: 30, color: '#00FF87' },
                  { label: 'Relance ferme', key: 'J+45', default: 45, color: '#FFB800' },
                  { label: 'Relance urgente', key: 'J+60', default: 60, color: '#FF4444' },
                ].map(r => (
                  <div key={r.key} className="flex items-center justify-between p-4 border border-[#1A1A1A] rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-white">{r.label}</p>
                      <p className="text-xs text-[#888]">Envoyée automatiquement après {r.default} jours</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        defaultValue={r.default}
                        className="w-16 bg-[#141414] border border-[#1A1A1A] rounded-lg px-2 py-1.5 text-white text-sm text-center focus:outline-none focus:border-[#00FF87]"
                      />
                      <span className="text-xs text-[#888]">jours</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button onClick={() => toast.success('Délais enregistrés !')}>Enregistrer</Button>
              </div>
            </div>

            {/* Templates */}
            <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-6">Templates d&apos;emails</h3>
              <div className="space-y-3">
                {['Relance douce (J+30)', 'Relance ferme (J+45)', 'Relance urgente (J+60)'].map(t => (
                  <div key={t} className="flex items-center justify-between p-4 border border-[#1A1A1A] rounded-xl hover:border-[#252525] transition-colors">
                    <span className="text-sm text-white">{t}</span>
                    <Button variant="secondary" size="sm">
                      Modifier
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Intégrations */}
        {tab === 'integrations' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {[
              { name: 'Pennylane', desc: 'Synchronise tes factures automatiquement', icon: '🟣', connected: false },
              { name: 'QuickBooks', desc: 'Importe tes factures en temps réel', icon: '🟢', connected: false },
              { name: 'CSV / Excel', desc: 'Importe manuellement depuis un fichier', icon: '📄', connected: true },
            ].map(integration => (
              <div key={integration.name} className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{integration.name}</p>
                    <p className="text-xs text-[#888]">{integration.desc}</p>
                  </div>
                </div>
                <Button
                  variant={integration.connected ? 'danger' : 'secondary'}
                  size="sm"
                  onClick={() => toast.success(integration.connected ? 'Déconnecté' : `${integration.name} connecté !`)}
                >
                  {integration.connected ? 'Déconnecter' : 'Connecter'}
                </Button>
              </div>
            ))}
          </motion.div>
        )}

        {/* Abonnement */}
        {tab === 'abonnement' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Plan actuel */}
            <div className="bg-[#0D0D0D] border border-[rgba(0,255,135,0.2)] rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#888] uppercase tracking-wider mb-1">Plan actuel</p>
                  <p className="font-display font-bold text-2xl text-white capitalize">{profile?.plan ?? 'gratuit'}</p>
                  <p className="text-xs text-[#555] mt-1">
                    {profile?.plan === 'gratuit' || !profile?.plan
                      ? 'Limité à 1 client et 3 factures'
                      : profile?.plan === 'starter'
                      ? '10 clients · 30 factures/mois'
                      : 'Illimité'}
                  </p>
                </div>
                <span className="text-xs bg-[rgba(0,255,135,0.1)] text-[#00FF87] px-3 py-1.5 rounded-full font-medium">
                  ✓ Actif
                </span>
              </div>
            </div>

            {/* Grille des plans */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(PLANS).map(([key, plan]) => {
                const isCurrent = (profile?.plan ?? 'gratuit') === key
                const isPro = key === 'pro'
                const isDowngrade = key === 'gratuit' && (profile?.plan ?? 'gratuit') !== 'gratuit'

                return (
                  <div
                    key={key}
                    className={`relative border rounded-2xl p-5 flex flex-col transition-colors ${
                      isCurrent
                        ? 'border-[rgba(0,255,135,0.4)] bg-[rgba(0,255,135,0.04)]'
                        : isPro
                        ? 'border-[rgba(0,255,135,0.2)] bg-[#0D0D0D]'
                        : 'border-[#1A1A1A] bg-[#0D0D0D]'
                    }`}
                  >
                    {isPro && !isCurrent && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00FF87] text-black text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                        POPULAIRE
                      </span>
                    )}
                    <h4 className="font-semibold text-white mb-0.5">{plan.name}</h4>
                    <p className="font-display font-bold text-3xl text-white mt-1">
                      {plan.price}€<span className="text-sm text-[#888] font-normal">/mois</span>
                    </p>
                    <ul className="mt-3 mb-4 space-y-1.5 flex-1">
                      {plan.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="text-xs text-[#888] flex items-start gap-1.5">
                          <span className="text-[#00FF87] mt-0.5">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setPlanDetail(key)}
                      className="flex items-center gap-1 text-xs text-[#555] hover:text-[#00FF87] transition-colors mt-2 mb-3"
                    >
                      En savoir plus <ChevronRight size={11} />
                    </button>
                    {isCurrent ? (
                      <span className="block text-center text-xs text-[#00FF87] font-medium py-2">✓ Plan actuel</span>
                    ) : isDowngrade ? null : (
                      <Button
                        size="sm"
                        className="w-full"
                        variant={isPro ? 'primary' : 'secondary'}
                        onClick={() => toast.success(`Redirection vers le paiement ${plan.name}...`)}
                      >
                        {plan.cta} ⚡
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* CTA urgence */}
            {(profile?.plan === 'gratuit' || !profile?.plan) && (
              <div className="bg-[rgba(0,255,135,0.04)] border border-[rgba(0,255,135,0.15)] rounded-2xl p-6 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white mb-1">🚀 Passe au Starter et encaisse plus vite</p>
                  <p className="text-sm text-[#888]">Relances automatiques, 10 clients, 30 factures/mois. Dès 39€/mois.</p>
                </div>
                <Button
                  onClick={() => toast.success('Redirection vers le paiement...')}
                  className="flex-shrink-0"
                >
                  Commencer ⚡
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </>
  )
}
