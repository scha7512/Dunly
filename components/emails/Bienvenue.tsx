import * as React from 'react'

interface Props {
  prenom: string
}

// Email de bienvenue envoyé à l'inscription
export function BienvenueEmail({ prenom }: Props) {
  return (
    <html>
      <head><meta charSet="utf-8" /></head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#050505', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ backgroundColor: '#0D0D0D', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1A1A1A' }}>
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '3px', marginBottom: '8px' }}>
                DUNL<span style={{ color: '#00FF87' }}>Y</span>
              </div>
              <div style={{ width: '40px', height: '2px', backgroundColor: '#00FF87', margin: '0 auto 32px' }} />

              <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎉</div>
              <h1 style={{ color: '#ffffff', fontSize: '24px', margin: '0 0 16px', fontWeight: 'bold' }}>
                Bienvenue, {prenom} !
              </h1>
              <p style={{ color: '#888', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
                Ton compte Dunly est créé. Tu peux maintenant connecter tes factures
                et laisser Dunly travailler pour toi.
              </p>

              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#00FF87',
                  color: '#000',
                  padding: '14px 32px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  marginBottom: '32px',
                }}
              >
                Accéder à mon dashboard →
              </a>

              <div style={{ borderTop: '1px solid #1A1A1A', paddingTop: '24px' }}>
                <p style={{ color: '#555', fontSize: '13px' }}>
                  Des questions ? Réponds directement à cet email ou écris-nous à{' '}
                  <a href="mailto:hello@dunly.io" style={{ color: '#00FF87' }}>hello@dunly.io</a>
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: '#080808', padding: '20px', textAlign: 'center', borderTop: '1px solid #1A1A1A' }}>
              <p style={{ color: '#555', fontSize: '11px', margin: 0 }}>
                © 2025 Dunly SAS · 1 rue de la Facturation, Paris
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
