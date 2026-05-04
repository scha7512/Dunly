'use client'

import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          // Variantes
          variant === 'primary' && 'btn-gradient text-black',
          variant === 'secondary' && 'bg-[#141414] text-white border border-[#1A1A1A] hover:border-[#00FF87] hover:text-[#00FF87]',
          variant === 'ghost' && 'text-[#888] hover:text-white',
          variant === 'danger' && 'bg-[rgba(255,68,68,0.1)] text-[#FF4444] border border-[rgba(255,68,68,0.2)] hover:bg-[rgba(255,68,68,0.2)]',
          // Tailles
          size === 'sm' && 'text-sm px-4 py-2',
          size === 'md' && 'text-sm px-6 py-3',
          size === 'lg' && 'text-base px-8 py-4',
          className
        )}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
