'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Plug, Bot, Euro } from 'lucide-react'

const STEPS = [
  {
    icon: Plug,
    number: '01',
    title: 'Connecter',
    description: 'Lie ton logiciel de facturation (Pennylane, QuickBooks, ou importe un CSV). Tes factures apparaissent instantanément.',
    color: '#00FF87',
  },
  {
    icon: Bot,
    number: '02',
    title: 'Dunly relance',
    description: 'À J+30, J+45 et J+60, Dunly envoie automatiquement des emails calibrés — du rappel bienveillant à la relance ferme.',
    color: '#00FF87',
  },
  {
    icon: Euro,
    number: '03',
    title: 'Encaisser',
    description: 'Tu reçois une notification quand ton client paie. Tu interviens uniquement si la situation est vraiment bloquée.',
    color: '#00FF87',
  },
]

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.8], ['0%', '100%'])

  return (
    <section id="how" ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <span className="text-sm text-[#888] uppercase tracking-widest">Processus</span>
          <h2 className="font-display font-bold text-[clamp(2rem,5vw,4rem)] mt-4 leading-tight">
            3 étapes, <span className="text-[#00FF87]">zéro effort</span>
          </h2>
          <p className="text-[#888] text-lg mt-4 max-w-xl mx-auto">
            De la connexion à l&apos;encaissement, Dunly s&apos;occupe de tout.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Ligne horizontale animée */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-px bg-[#1A1A1A]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00FF87] to-[rgba(0,255,135,0.3)]"
              style={{ width: lineWidth }}
            />
          </div>

          {/* Étapes */}
          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.2 + i * 0.2, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  className="relative"
                >
                  {/* Numéro + icône */}
                  <div className="flex flex-col items-center md:items-start mb-6">
                    <div className="relative">
                      {/* Cercle background */}
                      <div className="w-12 h-12 rounded-full bg-[#0D0D0D] border border-[#1A1A1A] flex items-center justify-center mb-4 relative z-10 animate-pulse-glow">
                        <Icon size={20} className="text-[#00FF87]" />
                      </div>
                      {/* Point sur la ligne */}
                      <div className="hidden md:block absolute top-4 left-6 w-2 h-2 rounded-full bg-[#00FF87] -translate-x-1/2 -translate-y-1/2 z-20" />
                    </div>
                    <span className="font-display font-bold text-5xl text-[rgba(0,255,135,0.15)] leading-none -mt-2">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-white mb-3 text-center md:text-left">
                    {step.title}
                  </h3>
                  <p className="text-[#888] leading-relaxed text-center md:text-left">
                    {step.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
