'use client'

import { motion } from 'framer-motion'
import { Send, Eye, MousePointer, Clock, CheckCircle } from 'lucide-react'
import { formatMontant } from '@/utils/format'

interface RelanceWithDetails {
  id: string
  type: string
  statut: string
  envoye_le: string | null
  created_at: string
  facture?: {
    numero: string
    montant: number
    client?: { nom: string } | null
  } | null
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  douce: { label: 'Relance douce', color: 'text-[#00FF87]' },
  ferme: { label: 'Relance ferme', color: 'text-[#FFB800]' },
  urgente: { label: 'Relance urgente', color: 'text-[#FF4444]' },
  manuelle: { label: 'Relance manuelle', color: 'text-[#888]' },
}

const STATUT_ICONS: Record<string, React.ReactNode> = {
  programmee: <Clock size={14} className="text-[#888]" />,
  envoyee: <Send size={14} className="text-[#00FF87]" />,
  ouverte: <Eye size={14} className="text-[#FFB800]" />,
  cliquee: <MousePointer size={14} className="text-[#00FF87]" />,
}

const STATUT_LABELS: Record<string, string> = {
  programmee: 'Programmée',
  envoyee: 'Envoyée',
  ouverte: 'Ouverte',
  cliquee: 'Cliquée',
}

function groupByDate(relances: RelanceWithDetails[]) {
  const groups: Record<string, RelanceWithDetails[]> = {}
  relances.forEach(r => {
    const date = new Date(r.envoye_le ?? r.created_at).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    })
    if (!groups[date]) groups[date] = []
    groups[date].push(r)
  })
  return groups
}

export default function RelancesTimeline({ relances }: { relances: RelanceWithDetails[] }) {
  if (relances.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-5xl mb-4">📬</div>
        <p className="text-white font-medium mb-2">Aucune relance encore</p>
        <p className="text-[#888] text-sm">Les relances apparaîtront ici une fois qu&apos;elles seront envoyées.</p>
      </div>
    )
  }

  const groups = groupByDate(relances)

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Stats rapides */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: relances.length, icon: <Send size={14} /> },
          { label: 'Envoyées', value: relances.filter(r => r.statut === 'envoyee').length, icon: <CheckCircle size={14} /> },
          { label: 'Ouvertes', value: relances.filter(r => r.statut === 'ouverte').length, icon: <Eye size={14} /> },
          { label: 'Cliquées', value: relances.filter(r => r.statut === 'cliquee').length, icon: <MousePointer size={14} /> },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-4"
          >
            <div className="flex items-center gap-2 text-[#888] text-xs mb-2">
              {stat.icon}
              {stat.label}
            </div>
            <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Timeline */}
      {Object.entries(groups).map(([date, items]) => (
        <div key={date}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-[#1A1A1A]" />
            <span className="text-xs text-[#555] font-medium">{date}</span>
            <div className="h-px flex-1 bg-[#1A1A1A]" />
          </div>

          <div className="space-y-3">
            {items.map((r, i) => {
              const typeInfo = TYPE_LABELS[r.type] ?? { label: r.type, color: 'text-[#888]' }
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-4 bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-4 hover:border-[#252525] transition-colors"
                >
                  {/* Icône statut */}
                  <div className="w-8 h-8 rounded-xl bg-[#141414] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {STATUT_ICONS[r.statut]}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      <span className="text-xs text-[#555]">
                        {STATUT_LABELS[r.statut]}
                      </span>
                    </div>
                    {r.facture && (
                      <div className="flex items-center gap-3 text-xs text-[#888]">
                        <span>Facture #{r.facture.numero}</span>
                        {r.facture.client && <span>· {r.facture.client.nom}</span>}
                        <span className="ml-auto font-mono text-white">
                          {formatMontant(r.facture.montant)}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
