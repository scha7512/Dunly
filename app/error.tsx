'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Loguer l'erreur en production (ajouter Sentry ici)
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="font-display font-bold text-3xl text-white mb-4">
          Une erreur est survenue
        </h2>
        <p className="text-[#888] mb-8">
          {error.message || 'Une erreur inattendue s\'est produite. Nos équipes ont été notifiées.'}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="btn-gradient text-black font-bold px-6 py-3 rounded-full"
          >
            Réessayer
          </button>
          <Link
            href="/dashboard"
            className="text-[#888] hover:text-white transition-colors"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
