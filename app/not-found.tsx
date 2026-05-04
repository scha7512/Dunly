import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="text-center">
        <div
          className="font-display font-bold text-[20vw] text-[rgba(0,255,135,0.04)] leading-none select-none mb-8"
        >
          404
        </div>
        <h1 className="font-display font-bold text-4xl text-white mb-4">
          Page introuvable
        </h1>
        <p className="text-[#888] text-lg mb-8 max-w-md mx-auto">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="btn-gradient text-black font-bold px-8 py-4 rounded-full inline-block"
        >
          Retour à l&apos;accueil →
        </Link>
      </div>
    </div>
  )
}
