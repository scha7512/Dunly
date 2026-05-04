'use client'

import { Bell, Search } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-16 border-b border-[#1A1A1A] bg-[#080808] flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="font-semibold text-white text-lg leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-[#888] mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Recherche */}
        <div className="hidden md:flex items-center gap-2 bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-3 py-2 w-56 focus-within:border-[#00FF87] transition-colors">
          <Search size={14} className="text-[#555] flex-shrink-0" />
          <input
            placeholder="Rechercher..."
            className="bg-transparent text-sm text-white placeholder-[#555] focus:outline-none flex-1"
          />
        </div>

        {/* Notifs */}
        <button className="relative w-9 h-9 rounded-xl bg-[#0D0D0D] border border-[#1A1A1A] flex items-center justify-center hover:border-[#333] transition-colors">
          <Bell size={15} className="text-[#888]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00FF87] text-black text-[9px] font-bold flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </header>
  )
}
