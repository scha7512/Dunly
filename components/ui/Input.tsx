'use client'

import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#ccc] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-[#0D0D0D] border rounded-xl px-4 py-3 text-white placeholder-[#555] text-sm',
              'focus:outline-none focus:ring-1 transition-all duration-200',
              error
                ? 'border-[#FF4444] focus:border-[#FF4444] focus:ring-[#FF4444]'
                : 'border-[#1A1A1A] focus:border-[#00FF87] focus:ring-[#00FF87]',
              icon && 'pl-11',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-[#FF4444] mt-1.5">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
