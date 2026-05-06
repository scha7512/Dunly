'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Plus, Search, Filter, Trash2, Edit2, Send, CheckCircle, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatMontant, formatDate, joursRetard, getStatutLabel } from '@/utils/format'
import type { Facture, Client } from '@/types'
import Button from '@/components/ui/Button'

interface Props {
  factures: (Facture & { client?: Partial<Client> | null })[]
  clients: Pick<Client, 'id' | 'nom'>[]
  userId: string
}

const STATUTS = ['tous', 'en-attente', 'relancee', 'payee', 'litige']
const PER_PAGE = 10

const STATUT_COLORS: Record<string, string> = {
  'en-attente': 'bg-[rgba(255,184,0,0.1)] text-[#FFB800]',
  'relancee': 'bg-[rgba(0,255,135,0.1)] text-[#00FF87]',
  'payee': 'bg-[rgba(0,255,135,0.15)] text-[#00FF87]',
  'litige': 'bg-[rgba(255,68,68,0.1)] text-[#FF4444]',
}

export default function FacturesTable({ factures: initial, clients, userId }: Props) {
  const supabase = createClient()
  const [factures, setFactures] = useState(initial)
  const [search, setSearch] = useState('')
  const [statut, setStatut] = useState('tous')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingFacture, setEditingFacture] = useState<Facture | null>(null)
  const [loading, setLoading] = useState(false)

  // Filtre + recherche
  const filtered = useMemo(() => {
    return factures.filter(f => {
      const matchSearch = !search ||
        f.numero.toLowerCase().includes(search.toLowerCase()) ||
        f.client?.nom?.toLowerCase().includes(search.toLowerCase())
      const matchStatut = statut === 'tous' || f.statut === statut
      return matchSearch && matchStatut
    })
  }, [factures, search, statut])

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const markAsPaid = async (id: string) => {
    const facture = factures.find(f => f.id === id)
    const { error } = await supabase.from('factures').update({ statut: 'payee' }).eq('id', id)
    if (!error) {
      setFactures(f => f.map(x => x.id === id ? { ...x, statut: 'payee' } : x))
      toast.success('Facture marquée comme payée !')
      // Notification email au gérant
      if (facture) {
        fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'facture_payee',
            data: {
              clientNom: (facture.client as { nom?: string } | null)?.nom ?? 'Client inconnu',
              numeroFacture: facture.numero,
              montant: `${facture.montant.toLocaleString('fr-FR')} €`,
              userEmail: '',
            },
          }),
        }).catch(() => {})
      }
    }
  }

  const deleteFacture = async (id: string) => {
    if (!confirm('Supprimer cette facture ?')) return
    const { error } = await supabase.from('factures').delete().eq('id', id)
    if (!error) {
      setFactures(f => f.filter(x => x.id !== id))
      toast.success('Facture supprimée')
    }
  }

  const relancerManuellement = async (f: Facture) => {
    setLoading(true)
    try {
      await supabase.from('relances').insert({
        user_id: userId,
        facture_id: f.id,
        type: 'manuelle',
        statut: 'envoyee',
        envoye_le: new Date().toISOString(),
      })
      await supabase.from('factures').update({ statut: 'relancee' }).eq('id', f.id)
      setFactures(facs => facs.map(x => x.id === f.id ? { ...x, statut: 'relancee' as const } : x))
      toast.success('Relance manuelle envoyée !')
    } catch {
      toast.error('Erreur lors de la relance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Recherche */}
          <div className="flex items-center gap-2 bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-3 py-2 focus-within:border-[#00FF87] transition-colors">
            <Search size={14} className="text-[#555]" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Rechercher..."
              className="bg-transparent text-sm text-white placeholder-[#555] focus:outline-none w-40"
            />
          </div>

          {/* Filtre statut */}
          <div className="flex items-center gap-1 flex-wrap">
            {STATUTS.map(s => (
              <button
                key={s}
                onClick={() => { setStatut(s); setPage(1) }}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors capitalize ${
                  statut === s
                    ? 'bg-[#00FF87] text-black font-medium'
                    : 'bg-[#0D0D0D] text-[#888] border border-[#1A1A1A] hover:border-[#333]'
                }`}
              >
                {s === 'tous' ? 'Tous' : getStatutLabel(s)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-xs text-[#888] border border-[#1A1A1A] px-3 py-2 rounded-xl hover:border-[#333] transition-colors">
            <Upload size={13} />
            Import CSV
          </button>
          <Button onClick={() => { setEditingFacture(null); setShowModal(true) }} size="sm">
            <Plus size={14} />
            Nouvelle facture
          </Button>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {['Numéro', 'Client', 'Montant', 'Échéance', 'Retard', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs text-[#888] font-medium uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111]">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#555] text-sm">
                    {search || statut !== 'tous' ? 'Aucun résultat' : 'Aucune facture — crée-en une !'}
                  </td>
                </tr>
              ) : (
                paginated.map((f, i) => {
                  const jours = joursRetard(f.date_echeance)
                  return (
                    <motion.tr
                      key={f.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-[#111] transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm font-medium text-white">{f.numero}</td>
                      <td className="px-5 py-3.5 text-sm text-[#ccc]">{f.client?.nom ?? '—'}</td>
                      <td className="px-5 py-3.5 text-sm font-mono text-white">{formatMontant(f.montant)}</td>
                      <td className="px-5 py-3.5 text-sm text-[#888]">{formatDate(f.date_echeance)}</td>
                      <td className="px-5 py-3.5">
                        {f.statut !== 'payee' && jours > 0 ? (
                          <span className="text-xs text-[#FF4444] font-medium">+{jours}j</span>
                        ) : (
                          <span className="text-xs text-[#555]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUT_COLORS[f.statut] ?? ''}`}>
                          {getStatutLabel(f.statut)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            title="Modifier"
                            onClick={() => { setEditingFacture(f); setShowModal(true) }}
                            className="p-1.5 rounded-lg text-[#555] hover:text-white hover:bg-[#1A1A1A] transition-colors"
                          >
                            <Edit2 size={13} />
                          </button>
                          {f.statut !== 'payee' && (
                            <>
                              <button
                                title="Relancer"
                                onClick={() => relancerManuellement(f)}
                                className="p-1.5 rounded-lg text-[#555] hover:text-[#00FF87] hover:bg-[rgba(0,255,135,0.1)] transition-colors"
                              >
                                <Send size={13} />
                              </button>
                              <button
                                title="Marquer payée"
                                onClick={() => markAsPaid(f.id)}
                                className="p-1.5 rounded-lg text-[#555] hover:text-[#00FF87] hover:bg-[rgba(0,255,135,0.1)] transition-colors"
                              >
                                <CheckCircle size={13} />
                              </button>
                            </>
                          )}
                          <button
                            title="Supprimer"
                            onClick={() => deleteFacture(f.id)}
                            className="p-1.5 rounded-lg text-[#555] hover:text-[#FF4444] hover:bg-[rgba(255,68,68,0.1)] transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#1A1A1A]">
            <span className="text-xs text-[#888]">
              {filtered.length} factures · page {page}/{totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs rounded-lg bg-[#141414] text-[#888] border border-[#1A1A1A] hover:border-[#333] disabled:opacity-40 transition-colors"
              >
                ← Précédent
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs rounded-lg bg-[#141414] text-[#888] border border-[#1A1A1A] hover:border-[#333] disabled:opacity-40 transition-colors"
              >
                Suivant →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal nouvelle facture */}
      <AnimatePresence>
        {showModal && (
          <FactureModal
            facture={editingFacture}
            clients={clients}
            userId={userId}
            onClose={() => setShowModal(false)}
            onSave={(f) => {
              if (editingFacture) {
                setFactures(facs => facs.map(x => x.id === f.id ? f : x))
              } else {
                setFactures(facs => [f, ...facs])
              }
              setShowModal(false)
              toast.success(editingFacture ? 'Facture modifiée' : 'Facture créée !')
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Modal création / édition facture
function FactureModal({ facture, clients, userId, onClose, onSave }: {
  facture: Facture | null
  clients: Pick<Client, 'id' | 'nom'>[]
  userId: string
  onClose: () => void
  onSave: (f: Facture) => void
}) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    numero: facture?.numero ?? '',
    montant: facture?.montant?.toString() ?? '',
    client_id: facture?.client_id ?? '',
    date_emission: facture?.date_emission ?? new Date().toISOString().split('T')[0],
    date_echeance: facture?.date_echeance ?? '',
    statut: facture?.statut ?? 'en-attente',
  })

  const handleSave = async () => {
    if (!form.numero || !form.montant) {
      toast.error('Numéro et montant requis')
      return
    }
    setLoading(true)
    try {
      if (facture) {
        const { data, error } = await supabase
          .from('factures')
          .update({ ...form, montant: Number(form.montant) })
          .eq('id', facture.id)
          .select()
          .single()
        if (error) throw error
        onSave(data)
      } else {
        const { data, error } = await supabase
          .from('factures')
          .insert({ ...form, montant: Number(form.montant), user_id: userId })
          .select()
          .single()
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-3xl p-6 w-full max-w-md"
      >
        <h3 className="font-semibold text-white text-lg mb-6">
          {facture ? 'Modifier la facture' : 'Nouvelle facture'}
        </h3>

        <div className="space-y-4">
          {[
            { label: 'Numéro de facture', key: 'numero', placeholder: 'FAC-2025-001', type: 'text' },
            { label: 'Montant (€)', key: 'montant', placeholder: '1500', type: 'number' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs text-[#888] mb-1.5">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full bg-[#141414] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF87] transition-colors"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs text-[#888] mb-1.5">Client</label>
            <select
              value={form.client_id}
              onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))}
              className="w-full bg-[#141414] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF87] transition-colors"
            >
              <option value="">Sélectionner un client</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Date d\'émission', key: 'date_emission' },
              { label: 'Date d\'échéance', key: 'date_echeance' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs text-[#888] mb-1.5">{field.label}</label>
                <input
                  type="date"
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  className="w-full bg-[#141414] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF87] transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Annuler</Button>
          <Button className="flex-1" loading={loading} onClick={handleSave}>
            {facture ? 'Enregistrer' : 'Créer'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
