'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Check } from 'lucide-react'
import Link from 'next/link'

interface Props {
  open: boolean
  onClose: () => void
  type: 'clients' | 'factures'
}

export default function UpgradeModal({ open, onClose, type }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-[#0D0D0D] border border-[rgba(0,255,135,0.2)] rounded-3xl p-8 max-w-md w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#555] hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            {/* Icône */}
            <div className="w-14 h-14 rounded-2xl bg-[rgba(0,255,135,0.1)] flex items-center justify-center mb-6">
              <Zap size={24} className="text-[#00FF87]" />
            </div>

            <h2 className="font-display font-bold text-2xl text-white mb-2">
              Limite atteinte 🚀
            </h2>
            <p className="text-[#888] text-sm mb-6">
              Tu as atteint la limite de {type} du plan gratuit.
              Passe au plan <strong className="text-white">Starter</strong> pour continuer à développer ton activité.
            </p>

            {/* Features */}
            <div className="bg-[#141414] rounded-2xl p-5 mb-6 space-y-2.5">
              {[
                '10 clients au lieu de 1',
                '30 factures/mois au lieu de 3',
                'Relances automatiques activées',
                'Support par email inclus',
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm">
                  <Check size={13} className="text-[#00FF87] flex-shrink-0" />
                  <span className="text-white">{f}</span>
                </div>
              ))}
            </div>

            {/* Prix */}
            <div className="text-center mb-6">
              <span className="font-display font-bold text-4xl text-white">39€</span>
              <span className="text-[#888] text-sm">/mois</span>
            </div>

            <Link
              href="/dashboard/parametres"
              onClick={onClose}
              className="block w-full text-center btn-gradient text-black font-bold py-3.5 rounded-full text-sm"
            >
              Passer au Starter maintenant ⚡
            </Link>

            <button
              onClick={onClose}
              className="block w-full text-center text-[#555] text-xs mt-3 hover:text-white transition-colors"
            >
              Continuer avec le plan gratuit
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
