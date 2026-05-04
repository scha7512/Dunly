'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Plus, Trash2, Edit2, Mail, Phone } from 'lucide-react'
import { createClient as createSupabase } from '@/lib/supabase/client'
import { formatDate, getScoreLabel } from '@/utils/format'
import type { Client } from '@/types'
import Button from '@/components/ui/Button'

interface Props {
  // Supabase retourne le count comme string dans les agrégats
  clients: (Client & { factures?: [{ count: string | number }] | null })[]
  userId: string
}

const SCORE_COLORS: Record<string, string> = {
  bon: 'bg-[rgba(0,255,135,0.1)] text-[#00FF87]',
  moyen: 'bg-[rgba(255,184,0,0.1)] text-[#FFB800]',
  risque: 'bg-[rgba(255,68,68,0.1)] text-[#FF4444]',
}

export default function ClientsTable({ clients: initial, userId }: Props) {
  const supabase = createSupabase()
  const [clients, setClients] = useState(initial)
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [search, setSearch] = useState('')

  const filtered = clients.filter(c =>
    !search || c.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  const deleteClient = async (id: string) => {
    if (!confirm('Supprimer ce client et toutes ses factures ?')) return
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (!error) {
      setClients(c => c.filter(x => x.id !== id))
      toast.success('Client supprimé')
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-3 py-2 focus-within:border-[#00FF87] transition-colors">
          <Mail size={14} className="text-[#555]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un client..."
            className="bg-transparent text-sm text-white placeholder-[#555] focus:outline-none w-48"
          />
        </div>
        <Button onClick={() => { setEditingClient(null); setShowModal(true) }} size="sm">
          <Plus size={14} />
          Nouveau client
        </Button>
      </div>

      {/* Tableau */}
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1A1A1A]">
              {['Client', 'Email', 'Téléphone', 'Factures', 'Score', 'Depuis', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs text-[#888] font-medium uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-[#555] text-sm">
                  {search ? 'Aucun résultat' : 'Aucun client — ajoute-en un !'}
                </td>
              </tr>
            ) : (
              filtered.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-[#111] transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[rgba(0,255,135,0.1)] flex items-center justify-center text-xs font-bold text-[#00FF87]">
                        {c.nom[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-white">{c.nom}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#888]">
                    {c.email ? (
                      <a href={`mailto:${c.email}`} className="hover:text-white transition-colors flex items-center gap-1">
                        <Mail size={12} />
                        {c.email}
                      </a>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#888]">
                    {c.telephone ? (
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {c.telephone}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#888]">
                    {Number(c.factures?.[0]?.count ?? 0)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${SCORE_COLORS[c.score] ?? ''}`}>
                      {getScoreLabel(c.score)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#888]">{formatDate(c.created_at)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditingClient(c); setShowModal(true) }}
                        className="p-1.5 rounded-lg text-[#555] hover:text-white hover:bg-[#1A1A1A] transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => deleteClient(c.id)}
                        className="p-1.5 rounded-lg text-[#555] hover:text-[#FF4444] hover:bg-[rgba(255,68,68,0.1)] transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <ClientModal
            client={editingClient}
            userId={userId}
            onClose={() => setShowModal(false)}
            onSave={(c) => {
              if (editingClient) {
                setClients(cs => cs.map(x => x.id === c.id ? { ...x, ...c } : x))
              } else {
                setClients(cs => [c, ...cs])
              }
              setShowModal(false)
              toast.success(editingClient ? 'Client modifié' : 'Client ajouté !')
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ClientModal({ client, userId, onClose, onSave }: {
  client: Client | null
  userId: string
  onClose: () => void
  onSave: (c: Client) => void
}) {
  const supabase = createSupabase()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nom: client?.nom ?? '',
    email: client?.email ?? '',
    telephone: client?.telephone ?? '',
    score: client?.score ?? 'bon',
  })

  const handleSave = async () => {
    if (!form.nom) { toast.error('Nom requis'); return }
    setLoading(true)
    try {
      if (client) {
        const { data, error } = await supabase.from('clients').update(form).eq('id', client.id).select().single()
        if (error) throw error
        onSave(data)
      } else {
        const { data, error } = await supabase.from('clients').insert({ ...form, user_id: userId }).select().single()
        if (error) throw error
        onSave(data)
      }
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-3xl p-6 w-full max-w-md"
      >
        <h3 className="font-semibold text-white text-lg mb-6">{client ? 'Modifier le client' : 'Nouveau client'}</h3>
        <div className="space-y-4">
          {[
            { label: 'Nom de l\'entreprise / client', key: 'nom', placeholder: 'Acme Corp' },
            { label: 'Email', key: 'email', placeholder: 'contact@acme.fr' },
            { label: 'Téléphone', key: 'telephone', placeholder: '+33 6 00 00 00 00' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs text-[#888] mb-1.5">{f.label}</label>
              <input
                type="text"
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-[#141414] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF87] transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs text-[#888] mb-1.5">Score de risque</label>
            <div className="flex gap-2">
              {(['bon', 'moyen', 'risque'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm(x => ({ ...x, score: s }))}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                    form.score === s ? SCORE_COLORS[s] + ' border border-current' : 'bg-[#141414] text-[#888] border border-[#1A1A1A]'
                  }`}
                >
                  {getScoreLabel(s)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Annuler</Button>
          <Button className="flex-1" loading={loading} onClick={handleSave}>{client ? 'Enregistrer' : 'Créer'}</Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
