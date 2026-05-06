import { NextResponse } from 'next/server'
import { getResend } from '@/lib/resend/client'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'tantonsacha@gmail.com'

function emailFacturePayee(data: {
  clientNom: string
  numeroFacture: string
  montant: string
  userEmail: string
}): string {
  const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(new Date())
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Facture payée</title></head>
<body style="margin:0;padding:0;background:#050505;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-1px;">DUNL<span style="color:#00FF87;">Y</span></span>
    </div>

    <!-- Card principale -->
    <div style="background:#0D0D0D;border:1px solid #1A1A1A;border-radius:24px;overflow:hidden;">

      <!-- Header vert -->
      <div style="background:linear-gradient(135deg,#00FF87 0%,#00CC6A 100%);padding:40px;text-align:center;">
        <div style="font-size:52px;margin-bottom:12px;">💰</div>
        <h1 style="margin:0;font-size:26px;font-weight:900;color:#050505;letter-spacing:-0.5px;">Paiement reçu !</h1>
        <p style="margin:8px 0 0;color:#003D20;font-size:14px;">Une facture vient d'être marquée comme payée</p>
      </div>

      <!-- Contenu -->
      <div style="padding:40px;">

        <!-- Date -->
        <p style="color:#555;font-size:12px;text-align:center;margin:0 0 28px;text-transform:uppercase;letter-spacing:1px;">${date}</p>

        <!-- Détails facture -->
        <div style="background:#141414;border:1px solid #1A1A1A;border-radius:16px;padding:24px;margin-bottom:24px;">
          <p style="color:#555;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">Détails du paiement</p>

          <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #1A1A1A;">
            <span style="color:#888;font-size:13px;">👤 Client</span>
            <span style="color:#ffffff;font-size:14px;font-weight:700;">${data.clientNom}</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #1A1A1A;">
            <span style="color:#888;font-size:13px;">📄 Numéro de facture</span>
            <span style="color:#ffffff;font-size:14px;font-weight:700;">${data.numeroFacture}</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 0 4px;">
            <span style="color:#888;font-size:13px;">💵 Montant encaissé</span>
            <span style="color:#00FF87;font-size:28px;font-weight:900;">${data.montant}</span>
          </div>
        </div>

        <!-- Stat positive -->
        <div style="background:rgba(0,255,135,0.05);border:1px solid rgba(0,255,135,0.15);border-radius:12px;padding:16px;text-align:center;margin-bottom:28px;">
          <p style="color:#00FF87;font-size:13px;font-weight:600;margin:0;">✓ Ton taux de recouvrement s'améliore</p>
          <p style="color:#555;font-size:12px;margin:4px 0 0;">Continue comme ça — Dunly travaille pour toi 🚀</p>
        </div>

        <!-- CTA -->
        <div style="text-align:center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://dunly.netlify.app'}/dashboard"
             style="display:inline-block;background:#00FF87;color:#050505;font-weight:800;font-size:14px;padding:14px 32px;border-radius:100px;text-decoration:none;letter-spacing:-0.3px;">
            Voir le dashboard →
          </a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:28px;">
      <p style="color:#333;font-size:11px;margin:0;">Dunly — Notification automatique · <a href="#" style="color:#333;">Se désabonner</a></p>
    </div>
  </div>
</body>
</html>`
}

function emailFactureCritique(data: {
  clientNom: string
  numeroFacture: string
  montant: string
  joursRetard: number
  userEmail: string
}): string {
  const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(new Date())
  const urgenceLabel = data.joursRetard >= 90 ? '🔴 CRITIQUE' : data.joursRetard >= 60 ? '🟠 URGENT' : '🟡 ATTENTION'
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Facture en retard critique</title></head>
<body style="margin:0;padding:0;background:#050505;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-1px;">DUNL<span style="color:#00FF87;">Y</span></span>
    </div>

    <!-- Card principale -->
    <div style="background:#0D0D0D;border:1px solid rgba(255,68,68,0.3);border-radius:24px;overflow:hidden;">

      <!-- Header rouge -->
      <div style="background:linear-gradient(135deg,#FF4444 0%,#CC0000 100%);padding:40px;text-align:center;">
        <div style="font-size:52px;margin-bottom:12px;">🚨</div>
        <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:100px;padding:4px 16px;margin-bottom:12px;">
          <span style="color:#ffffff;font-size:11px;font-weight:700;letter-spacing:1px;">${urgenceLabel}</span>
        </div>
        <h1 style="margin:8px 0 0;font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Facture en retard critique</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">Action requise de ta part</p>
      </div>

      <!-- Contenu -->
      <div style="padding:40px;">

        <!-- Date -->
        <p style="color:#555;font-size:12px;text-align:center;margin:0 0 28px;text-transform:uppercase;letter-spacing:1px;">${date}</p>

        <!-- Alerte retard -->
        <div style="background:rgba(255,68,68,0.08);border:1px solid rgba(255,68,68,0.2);border-radius:12px;padding:16px;text-align:center;margin-bottom:24px;">
          <p style="color:#FF4444;font-size:32px;font-weight:900;margin:0;">+${data.joursRetard} jours</p>
          <p style="color:#888;font-size:13px;margin:4px 0 0;">de retard sur cette facture</p>
        </div>

        <!-- Détails facture -->
        <div style="background:#141414;border:1px solid #1A1A1A;border-radius:16px;padding:24px;margin-bottom:24px;">
          <p style="color:#555;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">Détails de la facture</p>

          <div style="padding:12px 0;border-bottom:1px solid #1A1A1A;">
            <div style="display:flex;justify-content:space-between;">
              <span style="color:#888;font-size:13px;">👤 Client</span>
              <span style="color:#ffffff;font-size:14px;font-weight:700;">${data.clientNom}</span>
            </div>
          </div>
          <div style="padding:12px 0;border-bottom:1px solid #1A1A1A;">
            <div style="display:flex;justify-content:space-between;">
              <span style="color:#888;font-size:13px;">📄 Numéro</span>
              <span style="color:#ffffff;font-size:14px;font-weight:700;">${data.numeroFacture}</span>
            </div>
          </div>
          <div style="padding:12px 0;border-bottom:1px solid #1A1A1A;">
            <div style="display:flex;justify-content:space-between;">
              <span style="color:#888;font-size:13px;">📅 Retard</span>
              <span style="color:#FF4444;font-size:14px;font-weight:700;">+${data.joursRetard} jours</span>
            </div>
          </div>
          <div style="padding:16px 0 4px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="color:#888;font-size:13px;">💵 Montant dû</span>
              <span style="color:#FF4444;font-size:28px;font-weight:900;">${data.montant}</span>
            </div>
          </div>
        </div>

        <!-- Que faire -->
        <div style="background:#141414;border:1px solid #1A1A1A;border-radius:16px;padding:24px;margin-bottom:28px;">
          <p style="color:#555;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">💡 Que faire ?</p>
          <div style="space-y:8px;">
            <p style="color:#888;font-size:13px;margin:0 0 8px;line-height:1.6;">1. Vérifie si une relance urgente a bien été envoyée automatiquement</p>
            <p style="color:#888;font-size:13px;margin:0 0 8px;line-height:1.6;">2. Contacte directement le client par téléphone</p>
            <p style="color:#888;font-size:13px;margin:0;line-height:1.6;">3. Envisage un recours si pas de réponse sous 48h</p>
          </div>
        </div>

        <!-- CTA -->
        <div style="text-align:center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://dunly.netlify.app'}/dashboard/factures"
             style="display:inline-block;background:#FF4444;color:#ffffff;font-weight:800;font-size:14px;padding:14px 32px;border-radius:100px;text-decoration:none;letter-spacing:-0.3px;">
            Gérer cette facture →
          </a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:28px;">
      <p style="color:#333;font-size:11px;margin:0;">Dunly — Notification automatique · <a href="#" style="color:#333;">Se désabonner</a></p>
    </div>
  </div>
</body>
</html>`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body
    const resend = getResend()

    if (type === 'facture_payee') {
      await resend.emails.send({
        from: 'Dunly Notifications <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `💰 Facture payée — ${data.numeroFacture} · ${data.montant}`,
        html: emailFacturePayee(data),
      })
    }

    if (type === 'facture_critique') {
      await resend.emails.send({
        from: 'Dunly Notifications <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `🚨 URGENT — Facture ${data.numeroFacture} en retard de ${data.joursRetard} jours · ${data.montant}`,
        html: emailFactureCritique(data),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json({ error: 'Erreur envoi notification' }, { status: 500 })
  }
}
