'use client'

import { motion } from 'framer-motion'
import { Zap, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface Props {
  plan: string
  type: 'clients' | 'factures'
  limit: number
  current: number
}

export default function UpgradeBanner({ plan, type, limit, current }: Props) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed || plan !== 'gratuit') return null

  const percent = Math.round((current / limit) * 100)
  const isAtLimit = current >= limit

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl p-4 mb-6 border flex items-center gap-4 ${
        isAtLimit
          ? 'bg-[rgba(255,68,68,0.05)] border-[rgba(255,68,68,0.2)]'
          : 'bg-[rgba(0,255,135,0.03)] border-[rgba(0,255,135,0.15)]'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isAtLimit ? 'bg-[rgba(255,68,68,0.1)]' : 'bg-[rgba(0,255,135,0.1)]'
      }`}>
        <Zap size={18} className={isAtLimit ? 'text-[#FF4444]' : 'text-[#00FF87]'} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">
          {isAtLimit
            ? `Limite atteinte — ${current}/${limit} ${type}`
            : `${current}/${limit} ${type} utilisés (${percent}%)`
          }
        </p>
        <p className="text-xs text-[#888] mt-0.5">
          {isAtLimit
            ? `Passe au plan Starter pour débloquer jusqu\'à 30 factures et 10 clients.`
            : `Il te reste ${limit - current} ${type} sur ton plan gratuit.`
          }
        </p>
        {/* Barre de progression */}
        <div className="mt-2 h-1 bg-[#1A1A1A] rounded-full overflow-hidden w-48">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percent, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${isAtLimit ? 'bg-[#FF4444]' : 'bg-[#00FF87]'}`}
          />
        </div>
      </div>

      <Link
        href="/dashboard/parametres"
        className="flex-shrink-0 bg-[#00FF87] text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-[#00CC6A] transition-colors whitespace-nowrap"
      >
        Passer au Pro ⚡
      </Link>

      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 text-[#555] hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}
