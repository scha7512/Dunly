'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Download, CheckCircle, AlertCircle, FileText, Loader2, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface Props {
  open: boolean
  onClose: () => void
  userId: string
  onImported: () => void
}

interface CSVRow {
  numero: string
  montant: string
  client_nom: string
  client_email: string
  date_emission: string
  date_echeance: string
  statut: string
  notes: string
  _valid: boolean
  _errors: string[]
}

const TEMPLATE_CSV = `numero,montant,client_nom,client_email,date_emission,date_echeance,statut,notes
FAC-2025-001,1500,Acme Corp,contact@acme.fr,2025-01-01,2025-02-01,en-attente,
FAC-2025-002,2800,TechStart SAS,finance@techstart.fr,2025-01-15,2025-02-15,payee,Payé en avance
FAC-2025-003,950,Design Studio,hello@design.fr,2025-02-01,2025-03-01,en-attente,`

function parseCSV(text: string): CSVRow[] {
  const lines = text.trim().split('\n').filter(l => l.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const rows: CSVRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const row: Partial<CSVRow> = { _valid: true, _errors: [] }

    headers.forEach((h, idx) => {
      // @ts-expect-error dynamic assignment
      row[h] = values[idx] ?? ''
    })

    const errors: string[] = []

    if (!row.numero) errors.push('Numéro manquant')
    if (!row.montant || isNaN(Number(row.montant))) errors.push('Montant invalide')
    if (!row.client_nom) errors.push('Nom client manquant')
    if (row.statut && !['en-attente', 'relancee', 'payee', 'litige'].includes(row.statut)) {
      errors.push('Statut invalide (en-attente, relancee, payee, litige)')
    }

    row._errors = errors
    row._valid = errors.length === 0

    rows.push(row as CSVRow)
  }

  return rows
}

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'dunly-factures-template.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function CSVImportModal({ open, onClose, userId, onImported }: Props) {
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'done'>('upload')
  const [rows, setRows] = useState<CSVRow[]>([])
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState({ success: 0, errors: 0 })
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const parsed = parseCSV(text)
      if (parsed.length === 0) {
        toast.error('Fichier vide ou format incorrect')
        return
      }
      setRows(parsed)
      setStep('preview')
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.name.endsWith('.csv')) handleFile(file)
    else toast.error('Fichier CSV uniquement')
  }

  const handleImport = async () => {
    setImporting(true)
    setStep('importing')

    const validRows = rows.filter(r => r._valid)
    let success = 0
    let errors = 0

    for (const row of validRows) {
      try {
        // Chercher ou créer le client
        let clientId: string | null = null

        if (row.client_nom) {
          const { data: existing } = await supabase
            .from('clients')
            .select('id')
            .eq('user_id', userId)
            .ilike('nom', row.client_nom.trim())
            .limit(1)
            .single()

          if (existing) {
            clientId = existing.id
          } else {
            const { data: newClient } = await supabase
              .from('clients')
              .insert({ user_id: userId, nom: row.client_nom.trim(), email: row.client_email || null })
              .select('id')
              .single()
            clientId = newClient?.id ?? null
          }
        }

        await supabase.from('factures').insert({
          user_id: userId,
          client_id: clientId,
          numero: row.numero.trim(),
          montant: Number(row.montant),
          date_emission: row.date_emission || null,
          date_echeance: row.date_echeance || null,
          statut: (row.statut as 'en-attente' | 'relancee' | 'payee' | 'litige') || 'en-attente',
          notes: row.notes || null,
        })

        success++
      } catch {
        errors++
      }
    }

    setResults({ success, errors })
    setStep('done')
    setImporting(false)
  }

  const handleClose = () => {
    setStep('upload')
    setRows([])
    setResults({ success: 0, errors: 0 })
    onClose()
    if (results.success > 0) onImported()
  }

  const validCount = rows.filter(r => r._valid).length
  const invalidCount = rows.filter(r => !r._valid).length

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1A1A1A] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[rgba(0,255,135,0.1)] flex items-center justify-center">
                  <FileText size={16} className="text-[#00FF87]" />
                </div>
                <div>
                  <h2 className="font-semibold text-white text-sm">Importer des factures</h2>
                  <p className="text-xs text-[#555]">Fichier CSV</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-[#555] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-y-auto p-6">

              {/* ÉTAPE 1 — Upload */}
              {step === 'upload' && (
                <div className="space-y-5">
                  {/* Template download */}
                  <div className="flex items-center justify-between bg-[rgba(0,255,135,0.03)] border border-[rgba(0,255,135,0.1)] rounded-2xl p-4">
                    <div>
                      <p className="text-sm font-medium text-white">📋 Template CSV</p>
                      <p className="text-xs text-[#555] mt-0.5">Télécharge le modèle et remplis-le</p>
                    </div>
                    <button
                      onClick={downloadTemplate}
                      className="flex items-center gap-1.5 text-xs text-[#00FF87] border border-[rgba(0,255,135,0.3)] px-3 py-2 rounded-xl hover:bg-[rgba(0,255,135,0.05)] transition-colors"
                    >
                      <Download size={13} /> Télécharger
                    </button>
                  </div>

                  {/* Zone de drop */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-[#1A1A1A] hover:border-[#00FF87] rounded-2xl p-10 text-center cursor-pointer transition-colors group"
                  >
                    <Upload size={32} className="mx-auto text-[#333] group-hover:text-[#00FF87] transition-colors mb-3" />
                    <p className="text-white text-sm font-medium mb-1">Glisse ton fichier ici</p>
                    <p className="text-[#555] text-xs">ou clique pour parcourir · CSV uniquement</p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
                    />
                  </div>

                  {/* Guide colonnes */}
                  <div className="bg-[#141414] rounded-2xl p-4">
                    <p className="text-xs text-[#555] uppercase tracking-wider mb-3">Colonnes acceptées</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { col: 'numero', req: true, ex: 'FAC-2025-001' },
                        { col: 'montant', req: true, ex: '1500' },
                        { col: 'client_nom', req: true, ex: 'Acme Corp' },
                        { col: 'client_email', req: false, ex: 'contact@acme.fr' },
                        { col: 'date_emission', req: false, ex: '2025-01-01' },
                        { col: 'date_echeance', req: false, ex: '2025-02-01' },
                        { col: 'statut', req: false, ex: 'en-attente' },
                        { col: 'notes', req: false, ex: 'Commentaire...' },
                      ].map(c => (
                        <div key={c.col} className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${c.req ? 'bg-[rgba(0,255,135,0.1)] text-[#00FF87]' : 'bg-[#1A1A1A] text-[#555]'}`}>
                            {c.req ? 'REQ' : 'OPT'}
                          </span>
                          <span className="text-xs font-mono text-white">{c.col}</span>
                          <span className="text-xs text-[#333] truncate">{c.ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 — Prévisualisation */}
              {step === 'preview' && (
                <div className="space-y-4">
                  {/* Résumé */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#141414] rounded-xl p-3 text-center">
                      <p className="font-bold text-white text-xl">{rows.length}</p>
                      <p className="text-xs text-[#555] mt-0.5">Lignes détectées</p>
                    </div>
                    <div className="bg-[rgba(0,255,135,0.05)] border border-[rgba(0,255,135,0.1)] rounded-xl p-3 text-center">
                      <p className="font-bold text-[#00FF87] text-xl">{validCount}</p>
                      <p className="text-xs text-[#555] mt-0.5">Prêtes à importer</p>
                    </div>
                    <div className={`rounded-xl p-3 text-center ${invalidCount > 0 ? 'bg-[rgba(255,68,68,0.05)] border border-[rgba(255,68,68,0.1)]' : 'bg-[#141414]'}`}>
                      <p className={`font-bold text-xl ${invalidCount > 0 ? 'text-[#FF4444]' : 'text-[#333]'}`}>{invalidCount}</p>
                      <p className="text-xs text-[#555] mt-0.5">Avec erreurs</p>
                    </div>
                  </div>

                  {/* Tableau preview */}
                  <div className="border border-[#1A1A1A] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto max-h-64">
                      <table className="w-full text-xs min-w-[500px]">
                        <thead>
                          <tr className="bg-[#141414] border-b border-[#1A1A1A]">
                            <th className="text-left px-3 py-2.5 text-[#555] font-medium">Statut</th>
                            <th className="text-left px-3 py-2.5 text-[#555] font-medium">Numéro</th>
                            <th className="text-left px-3 py-2.5 text-[#555] font-medium">Client</th>
                            <th className="text-left px-3 py-2.5 text-[#555] font-medium">Montant</th>
                            <th className="text-left px-3 py-2.5 text-[#555] font-medium">Échéance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, i) => (
                            <tr key={i} className={`border-b border-[#111] ${row._valid ? '' : 'bg-[rgba(255,68,68,0.03)]'}`}>
                              <td className="px-3 py-2.5">
                                {row._valid
                                  ? <CheckCircle size={13} className="text-[#00FF87]" />
                                  : <div title={row._errors.join(', ')}><AlertCircle size={13} className="text-[#FF4444]" /></div>
                                }
                              </td>
                              <td className="px-3 py-2.5 text-white font-mono">{row.numero || '—'}</td>
                              <td className="px-3 py-2.5 text-[#888]">{row.client_nom || '—'}</td>
                              <td className="px-3 py-2.5 text-white">{row.montant ? `${Number(row.montant).toLocaleString('fr-FR')} €` : '—'}</td>
                              <td className="px-3 py-2.5 text-[#888]">{row.date_echeance || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Erreurs détaillées */}
                  {invalidCount > 0 && (
                    <div className="bg-[rgba(255,68,68,0.05)] border border-[rgba(255,68,68,0.15)] rounded-xl p-4">
                      <p className="text-xs font-semibold text-[#FF4444] mb-2">⚠️ Lignes avec erreurs (ignorées à l&apos;import)</p>
                      {rows.filter(r => !r._valid).map((r, i) => (
                        <p key={i} className="text-xs text-[#888]">• {r.numero || `Ligne ${i+1}`} : {r._errors.join(', ')}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ÉTAPE 3 — Import en cours */}
              {step === 'importing' && (
                <div className="text-center py-12">
                  <Loader2 size={40} className="text-[#00FF87] animate-spin mx-auto mb-4" />
                  <p className="text-white font-semibold">Import en cours...</p>
                  <p className="text-[#555] text-sm mt-1">Création des clients et factures</p>
                </div>
              )}

              {/* ÉTAPE 4 — Résultat */}
              {step === 'done' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-[rgba(0,255,135,0.1)] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-[#00FF87]" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Import terminé !</h3>
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="text-center">
                      <p className="font-bold text-[#00FF87] text-3xl">{results.success}</p>
                      <p className="text-xs text-[#555]">factures importées</p>
                    </div>
                    {results.errors > 0 && (
                      <div className="text-center">
                        <p className="font-bold text-[#FF4444] text-3xl">{results.errors}</p>
                        <p className="text-xs text-[#555]">erreurs</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-[#1A1A1A] flex justify-between items-center flex-shrink-0">
              {step === 'upload' && (
                <>
                  <p className="text-xs text-[#333]">Format : CSV avec virgules</p>
                  <button onClick={handleClose} className="text-sm text-[#555] hover:text-white transition-colors">Annuler</button>
                </>
              )}
              {step === 'preview' && (
                <>
                  <button onClick={() => setStep('upload')} className="text-sm text-[#555] hover:text-white transition-colors">← Retour</button>
                  <button
                    onClick={handleImport}
                    disabled={validCount === 0}
                    className="flex items-center gap-2 btn-gradient text-black font-bold px-5 py-2.5 rounded-full text-sm disabled:opacity-40"
                  >
                    Importer {validCount} facture{validCount > 1 ? 's' : ''} <ChevronRight size={15} />
                  </button>
                </>
              )}
              {step === 'done' && (
                <button onClick={handleClose} className="w-full btn-gradient text-black font-bold py-3 rounded-full text-sm">
                  Voir mes factures →
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
