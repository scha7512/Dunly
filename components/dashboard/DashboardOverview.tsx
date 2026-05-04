'use client'

import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatMontant, formatDate, joursRetard, getStatutLabel } from '@/utils/format'
import type { Facture, Relance } from '@/types'

interface Props {
  urgentes: Facture[]
  chartData: { mois: string; montant: number }[]
  relances: Relance[]
}

// Tooltip custom du graphique
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{value: number}>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#141414] border border-[#1A1A1A] rounded-xl px-4 py-3">
      <p className="text-xs text-[#888] mb-1">{label}</p>
      <p className="text-sm font-bold text-white">{formatMontant(payload[0].value)}</p>
    </div>
  )
}

export default function DashboardOverview({ urgentes, chartData, relances }: Props) {
  const prochainesRelances = relances
    .filter(r => r.statut === 'programmee')
    .slice(0, 5)

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Tableau urgentes + graphique — 2/3 */}
      <div className="lg:col-span-2 space-y-6">
        {/* Tableau factures urgentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A1A]">
            <h3 className="font-semibold text-white text-sm">Factures urgentes</h3>
            {urgentes.length > 0 && (
              <span className="text-xs bg-[rgba(255,68,68,0.1)] text-[#FF4444] px-2 py-1 rounded-full">
                {urgentes.length} en retard
              </span>
            )}
          </div>

          {urgentes.length === 0 ? (
            <div className="py-12 text-center text-[#555] text-sm">
              <span className="text-3xl block mb-3">🎉</span>
              Aucune facture en retard !
            </div>
          ) : (
            <div className="divide-y divide-[#111]">
              {urgentes.map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-[#111] transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{f.numero}</p>
                    <p className="text-xs text-[#888]">Éch. {formatDate(f.date_echeance)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{formatMontant(f.montant)}</p>
                    <p className="text-xs text-[#FF4444]">+{joursRetard(f.date_echeance)}j</p>
                  </div>
                  <div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[rgba(0,255,135,0.1)] text-[#00FF87]">
                      {getStatutLabel(f.statut)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Graphique */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5"
        >
          <h3 className="font-semibold text-white text-sm mb-6">Évolution des impayés (6 mois)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMontant" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF87" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00FF87" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
              <XAxis dataKey="mois" tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="montant"
                stroke="#00FF87"
                strokeWidth={2}
                fill="url(#colorMontant)"
                dot={false}
                activeDot={{ fill: '#00FF87', r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Prochaines relances — 1/3 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl"
      >
        <div className="px-5 py-4 border-b border-[#1A1A1A]">
          <h3 className="font-semibold text-white text-sm">Prochaines relances</h3>
        </div>
        {prochainesRelances.length === 0 ? (
          <div className="py-12 text-center text-[#555] text-sm px-5">
            <span className="text-3xl block mb-3">📅</span>
            Aucune relance programmée
          </div>
        ) : (
          <div className="divide-y divide-[#111]">
            {prochainesRelances.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="px-5 py-3.5"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white">Relance {r.type}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(255,184,0,0.1)] text-[#FFB800]">
                    Programmée
                  </span>
                </div>
                <p className="text-xs text-[#888]">Facture #{r.facture_id.slice(0, 8)}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
