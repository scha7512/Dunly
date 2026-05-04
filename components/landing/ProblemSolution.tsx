'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { X, Check } from 'lucide-react'

const PROBLEMS = [
  'Tu passes des heures à relancer manuellement',
  'Ton client se sent visé et se vexe',
  'Tu oublies de suivre certaines factures',
  'Tu es trop gentil par peur de froisser',
  'Tes impayés s\'accumulent silencieusement',
  '25% des faillites sont dues aux impayés',
]

const SOLUTIONS = [
  'Relances automatiques, tu n\'y penses plus',
  'Ton nom ne s\'y voit plus — c\'est Dunly qui relance',
  'Zéro oubli, tout est suivi en temps réel',
  'Le ton est adapté et calibré pour payer',
  'Tableau de bord clair, chaque centime tracé',
  'Tu encaisses en moyenne 30 jours plus vite',
]

export default function ProblemSolution() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Ligne de séparation centrale */}
      <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#1A1A1A] to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-sm text-[#888] uppercase tracking-widest">Avant / Après</span>
          <h2 className="font-display font-bold text-[clamp(2rem,5vw,4rem)] mt-4 leading-tight">
            La réalité des <span className="text-[#FF4444]">impayés</span>{' '}
            <br />
            vs la solution <span className="text-[#00FF87]">Dunly</span>
          </h2>
        </motion.div>

        {/* Deux colonnes */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Colonne problème */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="rounded-3xl border border-[rgba(255,68,68,0.2)] bg-[rgba(255,68,68,0.03)] p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-[rgba(255,68,68,0.15)] flex items-center justify-center">
                <X size={18} className="text-[#FF4444]" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">Sans Dunly</h3>
            </div>
            <ul className="space-y-4">
              {PROBLEMS.map((p, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full border border-[rgba(255,68,68,0.3)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X size={10} className="text-[#FF4444]" />
                  </div>
                  <span className="text-[#888] leading-relaxed">{p}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Colonne solution */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="rounded-3xl border border-[rgba(0,255,135,0.2)] bg-[rgba(0,255,135,0.03)] p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-[rgba(0,255,135,0.15)] flex items-center justify-center">
                <Check size={18} className="text-[#00FF87]" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">Avec Dunly</h3>
            </div>
            <ul className="space-y-4">
              {SOLUTIONS.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-[rgba(0,255,135,0.2)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={10} className="text-[#00FF87]" />
                  </div>
                  <span className="text-white leading-relaxed">{s}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
