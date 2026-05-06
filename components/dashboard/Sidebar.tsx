'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, FileText, Users, Send, Settings,
  LogOut, ChevronRight, Zap,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { href: '/dashboard/factures', label: 'Factures', icon: FileText },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/relances', label: 'Relances', icon: Send },
  { href: '/dashboard/parametres', label: 'Paramètres', icon: Settings },
]

interface SidebarProps {
  profile?: { prenom?: string | null; entreprise?: string | null; plan?: string }
}

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Déconnecté')
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-[#080808] border-r border-[#1A1A1A] flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-[#1A1A1A]">
        <Link href="/dashboard" className="font-display font-bold text-xl text-white">
          DUNL<span className="text-[#00FF87]">Y</span>
        </Link>
        {profile?.plan && (
          <span className="ml-2 text-xs bg-[rgba(0,255,135,0.1)] text-[#00FF87] px-2 py-0.5 rounded-full capitalize">
            {profile.plan}
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    active
                      ? 'bg-[rgba(0,255,135,0.1)] text-[#00FF87]'
                      : 'text-[#888] hover:text-white hover:bg-[#141414]'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute inset-0 bg-[rgba(0,255,135,0.1)] rounded-xl"
                    />
                  )}
                  <Icon size={16} className="relative z-10 flex-shrink-0" />
                  <span className="relative z-10">{item.label}</span>
                  {active && (
                    <ChevronRight size={12} className="relative z-10 ml-auto text-[#00FF87]" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Upgrade banner pour plan gratuit */}
      {(!profile?.plan || profile.plan === 'gratuit') && (
        <div className="mx-3 mb-3">
          <Link
            href="/dashboard/parametres"
            className="block bg-[rgba(0,255,135,0.08)] border border-[rgba(0,255,135,0.2)] rounded-2xl p-3 hover:bg-[rgba(0,255,135,0.12)] transition-colors group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Zap size={13} className="text-[#00FF87]" />
              <span className="text-xs font-bold text-[#00FF87]">Passer au Pro</span>
            </div>
            <p className="text-[10px] text-[#555] leading-relaxed">
              Débloquer les relances automatiques et clients illimités
            </p>
            <div className="mt-2 text-[10px] font-bold text-black bg-[#00FF87] rounded-full px-2 py-0.5 text-center">
              Dès 39€/mois ⚡
            </div>
          </Link>
        </div>
      )}

      {/* User + logout */}
      <div className="p-3 border-t border-[#1A1A1A]">
        {profile && (
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-[rgba(0,255,135,0.15)] flex items-center justify-center text-xs font-bold text-[#00FF87] flex-shrink-0">
              {profile.prenom?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">{profile.prenom ?? 'Utilisateur'}</div>
              <div className="text-xs text-[#888] truncate">{profile.entreprise ?? '—'}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#888] hover:text-[#FF4444] hover:bg-[rgba(255,68,68,0.05)] transition-all duration-200"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
