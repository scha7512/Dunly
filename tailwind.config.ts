import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        accent: '#00FF87',
        'accent-dim': '#00CC6A',
        surface: '#0D0D0D',
        'surface-2': '#141414',
        border: '#1A1A1A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#888888',
        danger: '#FF4444',
        warning: '#FFB800',
      },
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        body: ['Cabinet Grotesk', 'sans-serif'],
      },
      animation: {
        'gradient-rotate': 'gradient-rotate 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'counter': 'counter 1s ease-out forwards',
      },
      keyframes: {
        'gradient-rotate': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 135, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 135, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
    },
  },
  plugins: [],
}

export default config
