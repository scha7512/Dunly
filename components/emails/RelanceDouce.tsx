import * as React from 'react'

interface Props {
  clientNom: string
  factureNumero: string
  factureMontant: string
  dateEcheance: string
  entrepriseNom: string
  lienPaiement?: string
}

// Template email relance douce (J+30) — ton bienveillant
export function RelanceDouceEmail({
  clientNom, factureNumero, factureMontant, dateEcheance, entrepriseNom, lienPaiement
}: Props) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Card */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            {/* Header */}
            <div style={{ backgroundColor: '#050505', padding: '32px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '2px' }}>
                DUNL<span style={{ color: '#00FF87' }}>Y</span>
              </div>
            </div>

            {/* Contenu */}
            <div style={{ padding: '40px' }}>
              <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
                Bonjour {clientNom},
              </p>
              <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                J&apos;espère que vous allez bien. Je me permets de vous contacter concernant la facture{' '}
                <strong style={{ color: '#333' }}>{factureNumero}</strong> d&apos;un montant de{' '}
                <strong style={{ color: '#333' }}>{factureMontant}</strong>, dont l&apos;échéance était le{' '}
                <strong style={{ color: '#333' }}>{dateEcheance}</strong>.
              </p>
              <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6', marginBottom: '30px' }}>
                Il s&apos;agit peut-être d&apos;un simple oubli. N&apos;hésitez pas à me faire signe si vous avez la moindre question.
              </p>

              {/* CTA */}
              {lienPaiement && (
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <a
                    href={lienPaiement}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#00FF87',
                      color: '#000000',
                      padding: '14px 32px',
                      borderRadius: '50px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '15px',
                    }}
                  >
                    Régler la facture →
                  </a>
                </div>
              )}

              <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6' }}>
                Cordialement,<br />
                <strong style={{ color: '#333' }}>{entrepriseNom}</strong>
              </p>
            </div>

            {/* Footer */}
            <div style={{ backgroundColor: '#f9f9f9', padding: '20px 40px', borderTop: '1px solid #eee' }}>
              <p style={{ color: '#aaa', fontSize: '12px', textAlign: 'center', margin: 0 }}>
                Ce rappel est envoyé automatiquement via Dunly · Si vous pensez recevoir cet email par erreur, contactez-nous.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
