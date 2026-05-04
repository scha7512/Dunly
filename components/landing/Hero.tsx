'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ParticleBackground from './ParticleBackground'
import { ArrowRight, Play } from 'lucide-react'

const HERO_WORDS = ['Tes', 'factures', 'se', 'paient', 'enfin.']

// Compteur animé type "compteur kilométrique"
function AnimatedCounter({ from, to, suffix = '' }: { from: number; to: number; suffix?: string }) {
  const [value, setValue] = useState(from)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const duration = 2000
    const steps = 60
    const increment = (to - from) / steps
    let current = from
    let step = 0

    const timer = setInterval(() => {
      step++
      current = from + (to - from) * (1 - Math.pow(1 - step / steps, 3))
      setValue(Math.round(current))
      if (step >= steps) {
        setValue(to)
        clearInterval(timer)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [started, from, to])

  return <span ref={ref} className="number-roll">{value}{suffix}</span>
}

export default function Hero() {
  const mockupRef = useRef<HTMLDivElement>(null)

  // Tilt 3D du mockup selon position souris
  useEffect(() => {
    const el = mockupRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (window.innerWidth / 2)
      const dy = (e.clientY - cy) / (window.innerHeight / 2)

      el.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) scale(1.02)`
    }

    const onLeave = () => {
      el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)'
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* Fond particules */}
      <ParticleBackground />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-gradient-radial from-[rgba(0,255,135,0.06)] via-transparent to-transparent pointer-events-none" />

      {/* Grille subtile */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Tag pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[rgba(0,255,135,0.2)] mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse" />
          <span className="text-sm text-[#00FF87] font-medium">Relances automatiques de factures</span>
        </motion.div>

        {/* Titre split-text */}
        <h1 className="font-display font-bold text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-tight mb-6">
          {HERO_WORDS.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              className={`inline-block mr-4 ${word === 'paient' ? 'text-[#00FF87] text-glow' : 'text-white'}`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="text-[#888] text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Dunly relance tes clients impayés automatiquement — au bon moment, avec le bon ton.{' '}
          <span className="text-white">Tu n&apos;interviens que quand c&apos;est vraiment bloqué.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/auth/signup"
            className="btn-gradient text-black font-bold text-base px-8 py-4 rounded-full flex items-center gap-2 group"
          >
            Essayer gratuitement — 14 jours sans CB
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#demo"
            className="flex items-center gap-2 text-[#888] hover:text-white transition-colors px-6 py-4 rounded-full border border-[#1A1A1A] hover:border-[#00FF87] group"
          >
            <div className="w-8 h-8 rounded-full bg-[rgba(0,255,135,0.1)] flex items-center justify-center group-hover:bg-[rgba(0,255,135,0.2)] transition-colors">
              <Play size={12} fill="currentColor" className="text-[#00FF87] ml-0.5" />
            </div>
            Voir une démo
          </a>
        </motion.div>

        {/* Stats avec compteur animé */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-20"
        >
          {[
            { label: 'délai moyen en France', value: '52j', highlight: true },
            { label: 'faillites dues aux impayés', value: '25%', highlight: false },
            { label: 'heures perdues/mois', value: '8h', highlight: false },
            { label: 'réduction avec Dunly', value: '-30j', highlight: true },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-4 border border-[#1A1A1A]">
              <div className={`font-display font-bold text-2xl mb-1 ${stat.highlight ? 'text-[#00FF87]' : 'text-white'}`}>
                {stat.value}
              </div>
              <div className="text-xs text-[#888]">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Compteur kilométrique : 52 → 18 jours */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.7 }}
          className="inline-flex items-center gap-4 glass border border-[rgba(0,255,135,0.15)] rounded-2xl px-8 py-5 mb-20"
        >
          <div className="text-center">
            <div className="font-display font-bold text-4xl text-[#FF4444] line-through opacity-60">52j</div>
            <div className="text-xs text-[#888] mt-1">délai actuel</div>
          </div>
          <div className="text-[#00FF87] text-2xl font-bold">→</div>
          <div className="text-center">
            <div className="font-display font-bold text-4xl text-[#00FF87]">
              <AnimatedCounter from={52} to={18} suffix="j" />
            </div>
            <div className="text-xs text-[#888] mt-1">avec Dunly</div>
          </div>
        </motion.div>

        {/* Mockup dashboard 3D */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="relative max-w-5xl mx-auto"
        >
          <div
            ref={mockupRef}
            className="transition-transform duration-100 ease-out will-change-transform"
            style={{ transform: 'perspective(1000px) rotateX(2deg)' }}
          >
            {/* Frame mockup */}
            <div className="glass rounded-2xl border border-[rgba(0,255,135,0.1)] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
              {/* Barre de titre */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1A1A1A] bg-[#0D0D0D]">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                <div className="ml-4 text-xs text-[#888] bg-[#1A1A1A] rounded px-3 py-1">app.dunly.io/dashboard</div>
              </div>
              {/* Contenu mockup */}
              <DashboardMockup />
            </div>
            {/* Reflet */}
            <div className="absolute -bottom-20 left-0 right-0 h-20 bg-gradient-to-b from-[rgba(0,255,135,0.03)] to-transparent blur-xl" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Mini mockup du dashboard dans le hero
function DashboardMockup() {
  return (
    <div className="bg-[#080808] p-6 flex gap-4" style={{ minHeight: '300px' }}>
      {/* Sidebar mini */}
      <div className="w-12 flex flex-col gap-3 items-center pt-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${i === 0 ? 'bg-[rgba(0,255,135,0.15)]' : 'bg-[#1A1A1A]'}`}
          >
            <div className={`w-3 h-3 rounded-sm ${i === 0 ? 'bg-[#00FF87]' : 'bg-[#333]'}`} />
          </div>
        ))}
      </div>
      {/* Contenu */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Impayés', value: '12 340 €', color: '#FF4444' },
            { label: 'Relances', value: '8', color: '#00FF87' },
            { label: 'En retard', value: '5', color: '#FFB800' },
            { label: 'Récupération', value: '73%', color: '#00FF87' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 + i * 0.15 }}
              className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-lg p-3"
            >
              <div className="text-[10px] text-[#888] mb-1">{stat.label}</div>
              <div className="font-display font-bold text-sm" style={{ color: stat.color }}>{stat.value}</div>
            </motion.div>
          ))}
        </div>
        {/* Tableau */}
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-lg overflow-hidden flex-1">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1A1A1A]">
            <span className="text-xs font-medium text-white">Factures urgentes</span>
            <span className="text-[10px] text-[#00FF87] bg-[rgba(0,255,135,0.1)] px-2 py-0.5 rounded-full">5 en retard</span>
          </div>
          {[
            { client: 'Acme Corp', montant: '4 500 €', jours: '+42j', statut: 'Relancée' },
            { client: 'TechStart', montant: '2 300 €', jours: '+28j', statut: 'En attente' },
            { client: 'Design Co.', montant: '1 890 €', jours: '+15j', statut: 'Programmée' },
          ].map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.3 + i * 0.2 }}
              className="flex items-center justify-between px-4 py-2.5 border-b border-[#111] hover:bg-[#111] transition-colors"
            >
              <span className="text-xs text-white">{row.client}</span>
              <span className="text-xs font-mono text-white">{row.montant}</span>
              <span className="text-[10px] text-[#FF4444]">{row.jours}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(0,255,135,0.1)] text-[#00FF87]">{row.statut}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
