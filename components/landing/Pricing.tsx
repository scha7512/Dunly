'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { PLANS } from '@/lib/stripe/client'

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [annual, setAnnual] = useState(false)
  const discount = 0.8

  const planEntries = Object.entries(PLANS)

  return (
    <section id="pricing" ref={ref} className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-sm text-[#888] uppercase tracking-widest">Tarifs</span>
          <h2 className="font-display font-bold text-[clamp(2rem,5vw,4rem)] mt-4 leading-tight">
            Simple, <span className="text-[#00FF87]">transparent</span>
          </h2>
          <p className="text-[#888] text-lg mt-4 max-w-xl mx-auto">
            Commence gratuitement. Passe à la vitesse supérieure quand tu es prêt.
          </p>

          {/* Toggle mensuel/annuel */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${!annual ? 'text-white' : 'text-[#888]'}`}>Mensuel</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${annual ? 'bg-[#00FF87]' : 'bg-[#1A1A1A]'}`}
            >
              <motion.div
                animate={{ x: annual ? 28 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`absolute top-1 w-5 h-5 rounded-full ${annual ? 'bg-black' : 'bg-white'}`}
              />
            </button>
            <span className={`text-sm ${annual ? 'text-white' : 'text-[#888]'}`}>
              Annuel <span className="text-[#00FF87] text-xs ml-1">-20%</span>
            </span>
          </div>
        </motion.div>

        {/* Cards de prix */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {planEntries.map(([key, plan], i) => {
            const isPro = key === 'pro'
            const isGratuit = key === 'gratuit'
            const price = isGratuit ? 0 : (annual ? Math.round(plan.price * discount) : plan.price)

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.7 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`relative rounded-3xl p-7 border transition-all duration-300 group flex flex-col ${
                  isPro
                    ? 'border-[rgba(0,255,135,0.4)] bg-[rgba(0,255,135,0.04)]'
                    : 'border-[#1A1A1A] bg-[#0D0D0D] hover:border-[rgba(0,255,135,0.2)]'
                }`}
              >
                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-[#00FF87] text-black text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                      LE PLUS POPULAIRE
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="font-display font-bold text-lg text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-[#555] mb-4">{plan.description}</p>
                  <div className="flex items-end gap-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={price}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="font-display font-bold text-4xl text-white"
                      >
                        {price}€
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-[#888] mb-1.5 text-sm">/mois</span>
                  </div>
                  {annual && !isGratuit && (
                    <p className="text-xs text-[#888] mt-1">Facturé {price * 12}€/an</p>
                  )}
                </div>

                <Link
                  href="/auth/signup"
                  className={`block text-center py-3 rounded-full font-semibold text-sm mb-6 transition-all duration-200 ${
                    isPro
                      ? 'btn-gradient text-black'
                      : isGratuit
                      ? 'border border-[#1A1A1A] text-[#888] hover:border-[#333] hover:text-white'
                      : 'border border-[#00FF87] text-[#00FF87] hover:bg-[#00FF87] hover:text-black'
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((feature, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0 }}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      {isGratuit && j >= 2 ? (
                        <X size={13} className="text-[#333] mt-0.5 flex-shrink-0" />
                      ) : (
                        <Check size={13} className={`mt-0.5 flex-shrink-0 ${isPro ? 'text-[#00FF87]' : 'text-[#555]'}`} />
                      )}
                      <span className={`${isPro ? 'text-white' : isGratuit && j >= 2 ? 'text-[#333]' : 'text-[#888] group-hover:text-white transition-colors'}`}>
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-[#888] text-sm mt-8"
        >
          ✓ Sans engagement &nbsp;·&nbsp; ✓ Annulation à tout moment &nbsp;·&nbsp; ✓ Paiement sécurisé
        </motion.p>
      </div>
    </section>
  )
}
