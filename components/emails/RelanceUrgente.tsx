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

// Template email relance urgente (J+60) — ton sérieux, mention des recours
export function RelanceUrgenteEmail({
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

            <div style={{ backgroundColor: '#FEE2E2', padding: '12px 40px', borderBottom: '1px solid #FECACA' }}>
              <p style={{ color: '#991B1B', fontSize: '13px', margin: 0, fontWeight: 'bold' }}>
                🚨 DERNIER RAPPEL — Paiement en retard de {joursRetard} jours
              </p>
            </div>

            <div style={{ padding: '40px' }}>
              <p style={{ color: '#333', fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>
                Objet : Mise en demeure — Facture {factureNumero}
              </p>
              <p style={{ color: '#333', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                Monsieur / Madame {clientNom},
              </p>
              <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                Nous avons contacté votre entreprise à plusieurs reprises concernant le règlement de la facture{' '}
                <strong style={{ color: '#333' }}>{factureNumero}</strong> d&apos;un montant de{' '}
                <strong style={{ color: '#FF4444' }}>{factureMontant}</strong>, échue le {dateEcheance} et en retard de{' '}
                <strong style={{ color: '#FF4444' }}>{joursRetard} jours</strong>.
              </p>
              <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                Sans régularisation sous <strong>72 heures</strong>, nous nous verrons dans l&apos;obligation d&apos;engager
                des procédures de recouvrement, pouvant inclure :
              </p>
              <ul style={{ color: '#555', fontSize: '14px', lineHeight: '2', marginBottom: '24px', paddingLeft: '20px' }}>
                <li>Lettre recommandée avec accusé de réception</li>
                <li>Transmission à notre service juridique</li>
                <li>Signalement à un organisme de recouvrement</li>
              </ul>

              {lienPaiement && (
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <a
                    href={lienPaiement}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#FF4444',
                      color: '#fff',
                      padding: '14px 32px',
                      borderRadius: '50px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '15px',
                    }}
                  >
                    Régler immédiatement →
                  </a>
                </div>
              )}

              <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px' }}>
                {entrepriseNom}<br />
                <em style={{ color: '#aaa', fontSize: '12px' }}>
                  Ce document peut servir de preuve en cas de procédure judiciaire.
                </em>
              </p>
            </div>

            <div style={{ backgroundColor: '#f9f9f9', padding: '20px 40px', borderTop: '1px solid #eee' }}>
              <p style={{ color: '#aaa', fontSize: '12px', textAlign: 'center', margin: 0 }}>
                Relance urgente via Dunly · Facture {factureNumero} · {factureMontant}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
