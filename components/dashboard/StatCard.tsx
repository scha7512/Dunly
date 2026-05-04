'use client'

import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface StatCardProps {
  title: string
  value: string
  change?: string
  changePositive?: boolean
  icon: React.ReactNode
  color?: 'green' | 'red' | 'yellow' | 'default'
  index?: number
}

export default function StatCard({
  title, value, change, changePositive, icon, color = 'default', index = 0
}: StatCardProps) {
  const colorMap = {
    green: 'text-[#00FF87] bg-[rgba(0,255,135,0.1)]',
    red: 'text-[#FF4444] bg-[rgba(255,68,68,0.1)]',
    yellow: 'text-[#FFB800] bg-[rgba(255,184,0,0.1)]',
    default: 'text-[#888] bg-[#141414]',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5 hover:border-[#252525] transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-[#888] uppercase tracking-wider mb-1">{title}</p>
          <p className={cn(
            'font-display font-bold text-2xl',
            color === 'red' ? 'text-[#FF4444]' :
            color === 'yellow' ? 'text-[#FFB800]' :
            color === 'green' ? 'text-[#00FF87]' :
            'text-white'
          )}>
            {value}
          </p>
        </div>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colorMap[color])}>
          {icon}
        </div>
      </div>
      {change && (
        <p className={`text-xs ${changePositive ? 'text-[#00FF87]' : 'text-[#FF4444]'}`}>
          {changePositive ? '↑' : '↓'} {change}
        </p>
      )}
    </motion.div>
  )
}
