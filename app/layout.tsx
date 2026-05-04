import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://dunly.io'),
  title: 'Dunly — Tes factures se paient enfin.',
  description: 'Dunly relance tes clients impayés automatiquement — au bon moment, avec le bon ton. Stop à la perte de temps, encaisse plus vite.',
  keywords: ['relance factures', 'impayés', 'automatisation', 'gestion factures', 'trésorerie'],
  authors: [{ name: 'Dunly' }],
  creator: 'Dunly',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://dunly.io',
    siteName: 'Dunly',
    title: 'Dunly — Tes factures se paient enfin.',
    description: 'Relance automatique des factures impayées. Réduis tes délais de 52 à 18 jours.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dunly — Relance automatique de factures',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dunly — Tes factures se paient enfin.',
    description: 'Relance automatique des factures impayées.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-background text-white font-body antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#141414',
              color: '#fff',
              border: '1px solid #1A1A1A',
              fontFamily: 'Cabinet Grotesk, sans-serif',
            },
            success: {
              iconTheme: { primary: '#00FF87', secondary: '#050505' },
            },
            error: {
              iconTheme: { primary: '#FF4444', secondary: '#050505' },
            },
          }}
        />
      </body>
    </html>
  )
}
