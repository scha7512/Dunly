import { NextResponse } from 'next/server'
import { getResend } from '@/lib/resend/client'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'tantonsacha@gmail.com'

function emailFacturePayee(data: {
  clientNom: string
  numeroFacture: string
  montant: string
  userEmail: string
}): string {
  return `
  <div style="background:#050505;padding:40px 20px;font-family:'Helvetica Neue',Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#0D0D0D;border:1px solid #1A1A1A;border-radius:24px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#00FF87,#00CC6A);padding:32px 40px;">
        <h1 style="margin:0;font-size:28px;font-weight:900;color:#050505;">DUNLY</h1>
        <p style="margin:6px 0 0;color:#003D20;font-size:13px;">Notification de paiement</p>
      </div>
      <div style="padding:40px;">
        <div style="font-size:48px;text-align:center;margin-bottom:16px;">💰</div>
        <h2 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 8px;text-align:center;">Facture payée !</h2>
        <p style="color:#888;font-size:14px;text-align:center;margin:0 0 32px;">Tu viens de recevoir un paiement sur Dunly</p>

        <div style="background:#141414;border:1px solid #1A1A1A;border-radius:16px;padding:20px;margin-bottom:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="color:#888;font-size:13px;padding:8px 0;border-bottom:1px solid #1A1A1A;">Client</td>
              <td style="color:#fff;font-size:13px;font-weight:600;padding:8px 0;border-bottom:1px solid #1A1A1A;text-align:right;">${data.clientNom}</td>
            </tr>
            <tr>
              <td style="color:#888;font-size:13px;padding:8px 0;border-bottom:1px solid #1A1A1A;">Facture</td>
              <td style="color:#fff;font-size:13px;font-weight:600;padding:8px 0;border-bottom:1px solid #1A1A1A;text-align:right;">${data.numeroFacture}</td>
            </tr>
            <tr>
              <td style="color:#888;font-size:13px;padding:12px 0 4px;">Montant reçu</td>
              <td style="color:#00FF87;font-size:20px;font-weight:900;padding:12px 0 4px;text-align:right;">${data.montant}</td>
            </tr>
          </table>
        </div>

        <p style="color:#555;font-size:12px;text-align:center;margin:0;">
          Compte utilisateur : ${data.userEmail}
        </p>
      </div>
      <div style="border-top:1px solid #1A1A1A;padding:20px 40px;text-align:center;">
        <p style="color:#333;font-size:11px;margin:0;">© 2025 Dunly</p>
      </div>
    </div>
  </div>`
}

function emailFactureCritique(data: {
  clientNom: string
  numeroFacture: string
  montant: string
  joursRetard: number
  userEmail: string
}): string {
  return `
  <div style="background:#050505;padding:40px 20px;font-family:'Helvetica Neue',Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#0D0D0D;border:1px solid #1A1A1A;border-radius:24px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#FF4444,#CC0000);padding:32px 40px;">
        <h1 style="margin:0;font-size:28px;font-weight:900;color:#fff;">DUNLY</h1>
        <p style="margin:6px 0 0;color:#ffaaaa;font-size:13px;">⚠️ Alerte facture critique</p>
      </div>
      <div style="padding:40px;">
        <div style="font-size:48px;text-align:center;margin-bottom:16px;">🚨</div>
        <h2 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 8px;text-align:center;">Facture en retard critique</h2>
        <p style="color:#888;font-size:14px;text-align:center;margin:0 0 32px;">Une facture dépasse ${data.joursRetard} jours de retard</p>

        <div style="background:#141414;border:1px solid rgba(255,68,68,0.3);border-radius:16px;padding:20px;margin-bottom:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="color:#888;font-size:13px;padding:8px 0;border-bottom:1px solid #1A1A1A;">Client</td>
              <td style="color:#fff;font-size:13px;font-weight:600;padding:8px 0;border-bottom:1px solid #1A1A1A;text-align:right;">${data.clientNom}</td>
            </tr>
            <tr>
              <td style="color:#888;font-size:13px;padding:8px 0;border-bottom:1px solid #1A1A1A;">Facture</td>
              <td style="color:#fff;font-size:13px;font-weight:600;padding:8px 0;border-bottom:1px solid #1A1A1A;text-align:right;">${data.numeroFacture}</td>
            </tr>
            <tr>
              <td style="color:#888;font-size:13px;padding:8px 0;border-bottom:1px solid #1A1A1A;">Montant</td>
              <td style="color:#FF4444;font-size:20px;font-weight:900;padding:8px 0;border-bottom:1px solid #1A1A1A;text-align:right;">${data.montant}</td>
            </tr>
            <tr>
              <td style="color:#888;font-size:13px;padding:12px 0 4px;">Retard</td>
              <td style="color:#FF4444;font-size:16px;font-weight:700;padding:12px 0 4px;text-align:right;">+${data.joursRetard} jours</td>
            </tr>
          </table>
        </div>

        <p style="color:#555;font-size:12px;text-align:center;margin:0;">
          Compte utilisateur : ${data.userEmail}
        </p>
      </div>
      <div style="border-top:1px solid #1A1A1A;padding:20px 40px;text-align:center;">
        <p style="color:#333;font-size:11px;margin:0;">© 2025 Dunly</p>
      </div>
    </div>
  </div>`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body
    const resend = getResend()

    if (type === 'facture_payee') {
      await resend.emails.send({
        from: 'Dunly <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `💰 Facture payée — ${data.numeroFacture} (${data.montant})`,
        html: emailFacturePayee(data),
      })
    }

    if (type === 'facture_critique') {
      await resend.emails.send({
        from: 'Dunly <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `🚨 URGENT — Facture ${data.numeroFacture} en retard de ${data.joursRetard} jours`,
        html: emailFactureCritique(data),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json({ error: 'Erreur envoi notification' }, { status: 500 })
  }
}
