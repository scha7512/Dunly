'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { User, Bell, Plug, CreditCard } from 'lucide-react'
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

export default function ParametresPage() {
  const [tab, setTab] = useState('compte')
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

  return (
    <>
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-[#0D0D0D] border border-[rgba(0,255,135,0.2)] rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#888] uppercase tracking-wider mb-1">Plan actuel</p>
                  <p className="font-display font-bold text-2xl text-white capitalize">{profile?.plan ?? 'starter'}</p>
                </div>
                <span className="text-xs bg-[rgba(0,255,135,0.1)] text-[#00FF87] px-3 py-1.5 rounded-full font-medium">
                  Actif
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {Object.entries(PLANS).map(([key, plan]) => {
                const isCurrent = profile?.plan === key
                return (
                  <div
                    key={key}
                    className={`border rounded-2xl p-5 transition-colors ${
                      isCurrent
                        ? 'border-[rgba(0,255,135,0.3)] bg-[rgba(0,255,135,0.04)]'
                        : 'border-[#1A1A1A] bg-[#0D0D0D]'
                    }`}
                  >
                    <h4 className="font-semibold text-white mb-1">{plan.name}</h4>
                    <p className="font-display font-bold text-3xl text-white mb-4">{plan.price}€<span className="text-sm text-[#888] font-normal">/mois</span></p>
                    {isCurrent ? (
                      <span className="text-xs text-[#00FF87]">✓ Plan actuel</span>
                    ) : (
                      <Button size="sm" className="w-full" onClick={() => toast.success('Redirection vers Stripe...')}>
                        Passer à {plan.name}
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </>
  )
}
