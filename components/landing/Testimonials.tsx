'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Marie Dupont',
    role: 'Fondatrice, AgenceWeb',
    avatar: 'MD',
    rating: 5,
    text: 'J\'ai récupéré 8 400€ d\'impayés le premier mois. Dunly m\'a sauvé la mise, littéralement.',
  },
  {
    name: 'Thomas Bernard',
    role: 'Freelance développeur',
    avatar: 'TB',
    rating: 5,
    text: 'Fini les conversations gênantes avec mes clients. Dunly fait le sale boulot à ma place, avec le bon ton.',
  },
  {
    name: 'Sophie Leclerc',
    role: 'Comptable indépendante',
    avatar: 'SL',
    rating: 5,
    text: 'Mes délais sont passés de 65 jours à 22 jours en moyenne. ROI immédiat dès le premier mois.',
  },
  {
    name: 'Lucas Martin',
    role: 'CEO, Studio Design',
    avatar: 'LM',
    rating: 5,
    text: 'L\'interface est magnifique et les relances sont vraiment bien écrites. Mes clients ne se doutent de rien.',
  },
  {
    name: 'Emma Petit',
    role: 'Consultante RH',
    avatar: 'EP',
    rating: 5,
    text: '3 factures récupérées en 2 semaines. Je recommande à tous mes collègues consultants.',
  },
  {
    name: 'Antoine Roux',
    role: 'Architecte indépendant',
    avatar: 'AR',
    rating: 5,
    text: 'Simple, efficace, et ça marche vraiment. Mon trésorier est ravi depuis qu\'on utilise Dunly.',
  },
  {
    name: 'Clara Simon',
    role: 'Photographe professionnelle',
    avatar: 'CS',
    rating: 5,
    text: 'En 6 mois, j\'ai économisé plus de 40h de relances manuelles. Dunly vaut chaque centime.',
  },
  {
    name: 'Julien Moreau',
    role: 'Directeur Financier',
    avatar: 'JM',
    rating: 5,
    text: 'On gère 200+ factures par mois. Dunly nous a permis de diviser notre DSO par 2.',
  },
]

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div className="w-80 flex-shrink-0 glass border border-[#1A1A1A] rounded-2xl p-6 mx-3">
      <div className="flex items-center gap-0.5 mb-3">
        {[...Array(t.rating)].map((_, i) => (
          <Star key={i} size={12} fill="#00FF87" className="text-[#00FF87]" />
        ))}
      </div>
      <p className="text-sm text-[#ccc] leading-relaxed mb-4">"{t.text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[rgba(0,255,135,0.15)] flex items-center justify-center text-xs font-bold text-[#00FF87]">
          {t.avatar}
        </div>
        <div>
          <div className="text-sm font-medium text-white">{t.name}</div>
          <div className="text-xs text-[#888]">{t.role}</div>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  // Dupliquer pour le marquee infini
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section ref={ref} className="py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center"
        >
          <span className="text-sm text-[#888] uppercase tracking-widest">Témoignages</span>
          <h2 className="font-display font-bold text-[clamp(2rem,5vw,4rem)] mt-4 leading-tight">
            Ils ont arrêté de <span className="text-[#00FF87]">courir après leur argent</span>
          </h2>
        </motion.div>
      </div>

      {/* Marquee ligne 1 */}
      <div className="marquee-container mb-4">
        <div className="marquee-track">
          {doubled.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>

      {/* Marquee ligne 2 inversée */}
      <div className="marquee-container">
        <div className="marquee-track" style={{ animationDirection: 'reverse', animationDuration: '25s' }}>
          {[...doubled].reverse().map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
