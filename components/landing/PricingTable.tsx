'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, X, Minus } from 'lucide-react'
import Link from 'next/link'

const FEATURES = [
  { category: 'Limites', items: [
    { label: 'Clients', gratuit: '1', starter: '10', pro: 'Illimité', cabinet: 'Illimité' },
    { label: 'Factures / mois', gratuit: '3', starter: '30', pro: 'Illimité', cabinet: 'Illimité' },
    { label: 'Utilisateurs', gratuit: '1', starter: '1', pro: '1', cabinet: '5' },
  ]},
  { category: 'Relances', items: [
    { label: 'Relances automatiques', gratuit: false, starter: true, pro: true, cabinet: true },
    { label: 'Relance douce (J+30)', gratuit: false, starter: true, pro: true, cabinet: true },
    { label: 'Relance ferme (J+45)', gratuit: false, starter: true, pro: true, cabinet: true },
    { label: 'Relance urgente (J+60)', gratuit: false, starter: true, pro: true, cabinet: true },
    { label: 'Templates personnalisables', gratuit: false, starter: false, pro: true, cabinet: true },
    { label: 'Génération IA des emails', gratuit: false, starter: false, pro: true, cabinet: true },
  ]},
  { category: 'Fonctionnalités', items: [
    { label: 'Tableau de bord analytics', gratuit: false, starter: true, pro: true, cabinet: true },
    { label: 'Export PDF / CSV', gratuit: false, starter: false, pro: true, cabinet: true },
    { label: 'Historique des relances', gratuit: false, starter: true, pro: true, cabinet: true },
    { label: 'Score de risque client', gratuit: false, starter: false, pro: true, cabinet: true },
    { label: 'Notifications email gérant', gratuit: false, starter: true, pro: true, cabinet: true },
    { label: 'Multi-devises', gratuit: false, starter: false, pro: true, cabinet: true },
  ]},
  { category: 'Intégrations', items: [
    { label: 'Import CSV', gratuit: false, starter: true, pro: true, cabinet: true },
    { label: 'Pennylane', gratuit: false, starter: false, pro: false, cabinet: true },
    { label: 'QuickBooks', gratuit: false, starter: false, pro: false, cabinet: true },
    { label: 'Marque blanche emails', gratuit: false, starter: false, pro: false, cabinet: true },
  ]},
  { category: 'Support', items: [
    { label: 'Support email', gratuit: false, starter: true, pro: true, cabinet: true },
    { label: 'Support prioritaire', gratuit: false, starter: false, pro: true, cabinet: true },
    { label: 'Account manager dédié', gratuit: false, starter: false, pro: false, cabinet: true },
    { label: 'SLA garanti 99,9%', gratuit: false, starter: false, pro: false, cabinet: true },
  ]},
]

const PLANS = [
  { key: 'gratuit', label: 'Gratuit', price: '0€', color: '#555', popular: false },
  { key: 'starter', label: 'Starter', price: '39€', color: '#00CC6A', popular: false },
  { key: 'pro', label: 'Pro', price: '99€', color: '#00FF87', popular: true },
  { key: 'cabinet', label: 'Cabinet', price: '249€', color: '#FFB800', popular: false },
]

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === 'string') {
    return <span style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{value}</span>
  }
  if (value === true) return <Check size={16} className="text-[#00FF87] mx-auto" />
  return <X size={14} className="text-[#333] mx-auto" />
}

export default function PricingTable() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20 border-t border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-sm text-[#888] uppercase tracking-widest">Comparatif</span>
          <h2 className="font-display font-bold text-[clamp(1.8rem,4vw,3rem)] mt-4 leading-tight">
            Tout ce qui est <span className="text-[#00FF87]">inclus</span>
          </h2>
          <p className="text-[#888] text-base mt-3 max-w-lg mx-auto">
            Comparaison complète des plans pour choisir celui qui correspond à tes besoins.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto rounded-2xl border border-[#1A1A1A]"
        >
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                <th className="text-left p-5 text-sm text-[#555] font-medium w-[35%]">Fonctionnalités</th>
                {PLANS.map(plan => (
                  <th key={plan.key} className="p-5 text-center relative">
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-[#00FF87] text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          POPULAIRE
                        </span>
                      </div>
                    )}
                    <div className="font-display font-bold text-white text-base">{plan.label}</div>
                    <div className="font-bold mt-1" style={{ color: plan.color }}>
                      {plan.price}<span className="text-[#555] text-xs font-normal">/mois</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((section, si) => (
                <>
                  <tr key={`cat-${si}`} className="border-b border-[#1A1A1A]">
                    <td colSpan={5} className="px-5 py-3 bg-[#0A0A0A]">
                      <span className="text-xs text-[#555] uppercase tracking-widest font-semibold">{section.category}</span>
                    </td>
                  </tr>
                  {section.items.map((item, ii) => (
                    <tr
                      key={`${si}-${ii}`}
                      className="border-b border-[#111] hover:bg-[#0A0A0A] transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm text-[#888]">{item.label}</td>
                      {PLANS.map(plan => (
                        <td key={plan.key} className={`px-5 py-3.5 text-center ${plan.popular ? 'bg-[rgba(0,255,135,0.02)]' : ''}`}>
                          <Cell value={item[plan.key as keyof typeof item] as boolean | string} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
              {/* CTA row */}
              <tr className="bg-[#0A0A0A]">
                <td className="p-5 text-sm text-[#555]">Commencer</td>
                {PLANS.map(plan => (
                  <td key={plan.key} className="p-5 text-center">
                    <Link
                      href="/auth/signup"
                      className={`inline-block text-xs font-bold px-4 py-2 rounded-full transition-all ${
                        plan.popular
                          ? 'btn-gradient text-black'
                          : 'border border-[#1A1A1A] text-[#888] hover:border-[#333] hover:text-white'
                      }`}
                    >
                      {plan.key === 'gratuit' ? 'Gratuit' : `Choisir ${plan.label}`}
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}
