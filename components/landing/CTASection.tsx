'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(0,255,135,0.08),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(0,255,135,0.04),transparent)]" />

      {/* Texte DUNLY en background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="font-display font-bold text-[20vw] text-[rgba(0,255,135,0.03)] leading-none select-none whitespace-nowrap">
          DUNLY
        </span>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[rgba(0,255,135,0.2)] mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse" />
            <span className="text-sm text-[#00FF87]">14 jours gratuits, sans carte bancaire</span>
          </motion.div>

          <h2 className="font-display font-bold text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] mb-6">
            Arrête de courir<br />
            <span className="text-[#00FF87] text-glow">après ton argent.</span>
          </h2>

          <p className="text-[#888] text-xl max-w-xl mx-auto mb-12">
            Rejoins +2 400 entrepreneurs qui ont récupéré leur temps et leur trésorerie avec Dunly.
          </p>

          {/* Formulaire */}
          {!submitted ? (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.fr"
                required
                className="flex-1 w-full sm:w-auto bg-[#0D0D0D] border border-[#1A1A1A] rounded-full px-6 py-4 text-white placeholder-[#555] focus:outline-none focus:border-[#00FF87] transition-colors text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-gradient text-black font-bold px-8 py-4 rounded-full flex items-center gap-2 whitespace-nowrap disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Commencer gratuitement
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 text-[#00FF87]"
            >
              <CheckCircle size={24} />
              <span className="font-medium text-lg">C&apos;est parti ! Vérifie ta boîte mail.</span>
            </motion.div>
          )}

          {/* Garanties */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 mt-8 flex-wrap"
          >
            {['Sans carte bancaire', 'Annulation immédiate', 'Support 7j/7'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[#888]">
                <CheckCircle size={14} className="text-[#00FF87]" />
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
