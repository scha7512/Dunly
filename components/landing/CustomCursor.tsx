'use client'

import { useEffect, useRef } from 'react'

// Cercle vert qui suit la souris avec lag — uniquement sur desktop
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const cursorPos = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>()

  useEffect(() => {
    // Ne pas afficher sur tactile
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
      }
    }

    const animate = () => {
      // Interpolation douce (lag effect)
      cursorPos.current.x += (pos.current.x - cursorPos.current.x) * 0.12
      cursorPos.current.y += (pos.current.y - cursorPos.current.y) * 0.12

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x - 16}px, ${cursorPos.current.y - 16}px)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    const onEnterLink = () => {
      cursorRef.current?.classList.add('scale-150')
      dotRef.current?.classList.add('opacity-0')
    }

    const onLeaveLink = () => {
      cursorRef.current?.classList.remove('scale-150')
      dotRef.current?.classList.remove('opacity-0')
    }

    window.addEventListener('mousemove', onMove)

    // Agrandir au survol des éléments interactifs
    document.querySelectorAll('a, button, [data-cursor-large]').forEach(el => {
      el.addEventListener('mouseenter', onEnterLink)
      el.addEventListener('mouseleave', onLeaveLink)
    })

    // Observer les nouveaux éléments
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', onEnterLink)
        el.addEventListener('mouseleave', onLeaveLink)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* Cercle lag */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] transition-[transform,opacity] duration-100 ease-out will-change-transform"
        style={{ transform: 'translate(-100px, -100px)' }}
      >
        <div className="w-full h-full rounded-full border border-[#00FF87] opacity-60 transition-all duration-200 ease-out" />
      </div>
      {/* Point précis */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9999] will-change-transform transition-opacity duration-150"
        style={{ transform: 'translate(-100px, -100px)' }}
      >
        <div className="w-full h-full rounded-full bg-[#00FF87]" />
      </div>
    </>
  )
}
