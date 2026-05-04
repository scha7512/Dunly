import * as React from 'react'

interface Props {
  clientNom: string
  factureNumero: string
  factureMontant: string
  dateEcheance: string
  joursRetard: number
  entrepriseNom: string
  lienPaiement?: string
}

// Template email relance ferme (J+45) — ton professionnel mais direct
export function RelanceFermeEmail({
  clientNom, factureNumero, factureMontant, dateEcheance, joursRetard, entrepriseNom, lienPaiement
}: Props) {
  return (
    <html>
      <head><meta charSet="utf-8" /></head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ backgroundColor: '#050505', padding: '32px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '2px' }}>
                DUNL<span style={{ color: '#00FF87' }}>Y</span>
              </div>
            </div>

            {/* Bandeau retard */}
            <div style={{ backgroundColor: '#FFF8E7', padding: '12px 40px', borderBottom: '1px solid #FFE082' }}>
              <p style={{ color: '#856404', fontSize: '13px', margin: 0, fontWeight: 'bold' }}>
                ⚠️ Paiement en retard de {joursRetard} jours
              </p>
            </div>

            <div style={{ padding: '40px' }}>
              <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
                Bonjour {clientNom},
              </p>
              <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                Malgré notre précédent rappel, nous n&apos;avons pas encore reçu le règlement de la facture{' '}
                <strong style={{ color: '#333' }}>{factureNumero}</strong> pour un montant de{' '}
                <strong style={{ color: '#333' }}>{factureMontant}</strong>, échue le {dateEcheance}.
              </p>
              <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6', marginBottom: '30px' }}>
                Nous vous remercions de bien vouloir procéder au règlement dans les plus brefs délais.
                Si un problème particulier retarde ce paiement, nous vous invitons à nous contacter immédiatement.
              </p>

              {lienPaiement && (
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <a
                    href={lienPaiement}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#00FF87',
                      color: '#000',
                      padding: '14px 32px',
                      borderRadius: '50px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '15px',
                    }}
                  >
                    Régler maintenant →
                  </a>
                </div>
              )}

              <p style={{ color: '#555', fontSize: '15px' }}>
                Cordialement,<br />
                <strong>{entrepriseNom}</strong>
              </p>
            </div>

            <div style={{ backgroundColor: '#f9f9f9', padding: '20px 40px', borderTop: '1px solid #eee' }}>
              <p style={{ color: '#aaa', fontSize: '12px', textAlign: 'center', margin: 0 }}>
                Rappel automatique via Dunly · Facture {factureNumero}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
