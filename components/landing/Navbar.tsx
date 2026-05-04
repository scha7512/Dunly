'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const LETTERS = ['D', 'U', 'N', 'L', 'Y']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoVisible, setLogoVisible] = useState(false)

  useEffect(() => {
    setLogoVisible(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'nav-blur py-3' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo animé lettre par lettre */}
        <Link href="/" className="flex items-center gap-0.5">
          <div className="flex">
            {LETTERS.map((letter, i) => (
              <motion.span
                key={letter}
                initial={{ opacity: 0, y: -20 }}
                animate={logoVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="font-display font-bold text-2xl text-white"
              >
                {letter === 'Y' ? (
                  <span className="text-[#00FF87]">{letter}</span>
                ) : letter}
              </motion.span>
            ))}
          </div>
        </Link>

        {/* Navigation desktop */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Comment ça marche', href: '#how' },
            { label: 'Tarifs', href: '#pricing' },
            { label: 'FAQ', href: '#faq' },
          ].map((item, i) => (
            <motion.a
              key={item.href}
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="text-sm text-[#888] hover:text-white transition-colors duration-200 relative group"
            >
              {item.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#00FF87] group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="hidden md:flex items-center gap-3"
        >
          <Link
            href="/auth/login"
            className="text-sm text-[#888] hover:text-white transition-colors px-4 py-2"
          >
            Se connecter
          </Link>
          <Link
            href="/auth/signup"
            className="btn-gradient text-black font-semibold text-sm px-5 py-2.5 rounded-full"
          >
            Essayer gratuitement →
          </Link>
        </motion.div>

        {/* Menu mobile */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menu mobile déroulant */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden nav-blur border-t border-[#1A1A1A] overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <a href="#how" className="text-[#888] hover:text-white" onClick={() => setMobileOpen(false)}>Comment ça marche</a>
              <a href="#pricing" className="text-[#888] hover:text-white" onClick={() => setMobileOpen(false)}>Tarifs</a>
              <a href="#faq" className="text-[#888] hover:text-white" onClick={() => setMobileOpen(false)}>FAQ</a>
              <div className="flex flex-col gap-3 pt-2 border-t border-[#1A1A1A]">
                <Link href="/auth/login" className="text-center text-[#888] hover:text-white py-2">Se connecter</Link>
                <Link href="/auth/signup" className="btn-gradient text-black font-semibold text-center py-3 rounded-full">
                  Essayer gratuitement →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
