// Fonctions de génération HTML pour les emails — pas de React/JSX dans les routes API

interface BaseParams {
  clientNom: string
  factureNumero: string
  factureMontant: string
  dateEcheance: string
  entrepriseNom: string
  lienPaiement?: string
}

interface RelanceFermeParams extends BaseParams {
  joursRetard: number
}

const HEADER = `
<div style="background:#050505;padding:32px 40px;text-align:center">
  <div style="font-size:24px;font-weight:bold;color:#ffffff;letter-spacing:2px">DUNL<span style="color:#00FF87">Y</span></div>
</div>`

const FOOTER = (factureNumero: string) => `
<div style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #eee">
  <p style="color:#aaa;font-size:12px;text-align:center;margin:0">
    Relance automatique via Dunly · Facture ${factureNumero}
  </p>
</div>`

const CARD_OPEN = `<div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)">`
const CARD_CLOSE = `</div>`
const WRAPPER_OPEN = `<div style="max-width:600px;margin:0 auto;padding:40px 20px">`
const WRAPPER_CLOSE = `</div>`

const ctaButton = (href: string, label: string, bg = '#00FF87', color = '#000') => `
<div style="text-align:center;margin-bottom:32px">
  <a href="${href}" style="display:inline-block;background:${bg};color:${color};padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px">
    ${label}
  </a>
</div>`

export function emailRelanceDouce(p: BaseParams): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
${WRAPPER_OPEN}
${CARD_OPEN}
${HEADER}
<div style="padding:40px">
  <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:20px">Bonjour ${p.clientNom},</p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin-bottom:20px">
    J'espère que vous allez bien. Je me permets de vous contacter concernant la facture
    <strong style="color:#333">${p.factureNumero}</strong> d'un montant de
    <strong style="color:#333">${p.factureMontant}</strong>, dont l'échéance était le
    <strong style="color:#333">${p.dateEcheance}</strong>.
  </p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin-bottom:30px">
    Il s'agit peut-être d'un simple oubli. N'hésitez pas à me faire signe si vous avez la moindre question.
  </p>
  ${p.lienPaiement ? ctaButton(p.lienPaiement, 'Régler la facture →') : ''}
  <p style="color:#555;font-size:15px">Cordialement,<br><strong style="color:#333">${p.entrepriseNom}</strong></p>
</div>
${FOOTER(p.factureNumero)}
${CARD_CLOSE}
${WRAPPER_CLOSE}
</body></html>`
}

export function emailRelanceFerme(p: RelanceFermeParams): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
${WRAPPER_OPEN}
${CARD_OPEN}
${HEADER}
<div style="background:#FFF8E7;padding:12px 40px;border-bottom:1px solid #FFE082">
  <p style="color:#856404;font-size:13px;margin:0;font-weight:bold">⚠️ Paiement en retard de ${p.joursRetard} jours</p>
</div>
<div style="padding:40px">
  <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:20px">Bonjour ${p.clientNom},</p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin-bottom:20px">
    Malgré notre précédent rappel, nous n'avons pas encore reçu le règlement de la facture
    <strong style="color:#333">${p.factureNumero}</strong> pour un montant de
    <strong style="color:#333">${p.factureMontant}</strong>, échue le ${p.dateEcheance}.
  </p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin-bottom:30px">
    Nous vous remercions de bien vouloir procéder au règlement dans les plus brefs délais.
  </p>
  ${p.lienPaiement ? ctaButton(p.lienPaiement, 'Régler maintenant →') : ''}
  <p style="color:#555;font-size:15px">Cordialement,<br><strong>${p.entrepriseNom}</strong></p>
</div>
${FOOTER(p.factureNumero)}
${CARD_CLOSE}
${WRAPPER_CLOSE}
</body></html>`
}

export function emailRelanceUrgente(p: RelanceFermeParams): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
${WRAPPER_OPEN}
${CARD_OPEN}
${HEADER}
<div style="background:#FEE2E2;padding:12px 40px;border-bottom:1px solid #FECACA">
  <p style="color:#991B1B;font-size:13px;margin:0;font-weight:bold">🚨 DERNIER RAPPEL — ${p.joursRetard} jours de retard</p>
</div>
<div style="padding:40px">
  <p style="color:#333;font-size:16px;font-weight:bold;margin-bottom:20px">Objet : Mise en demeure — Facture ${p.factureNumero}</p>
  <p style="color:#333;font-size:15px;line-height:1.6;margin-bottom:20px">Monsieur / Madame ${p.clientNom},</p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin-bottom:20px">
    Nous avons contacté votre entreprise à plusieurs reprises concernant le règlement de la facture
    <strong style="color:#333">${p.factureNumero}</strong> d'un montant de
    <strong style="color:#FF4444">${p.factureMontant}</strong>, échue le ${p.dateEcheance} et en retard de
    <strong style="color:#FF4444">${p.joursRetard} jours</strong>.
  </p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin-bottom:20px">
    Sans régularisation sous <strong>72 heures</strong>, nous engagerons des procédures de recouvrement.
  </p>
  ${p.lienPaiement ? ctaButton(p.lienPaiement, 'Régler immédiatement →', '#FF4444', '#fff') : ''}
  <p style="color:#555;font-size:14px;border-top:1px solid #eee;padding-top:20px;margin-top:20px">
    ${p.entrepriseNom}<br>
    <em style="color:#aaa;font-size:12px">Ce document peut servir de preuve en cas de procédure judiciaire.</em>
  </p>
</div>
${FOOTER(p.factureNumero)}
${CARD_CLOSE}
${WRAPPER_CLOSE}
</body></html>`
}

export function emailBienvenue(prenom: string, appUrl: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#050505;font-family:Arial,sans-serif">
${WRAPPER_OPEN}
<div style="background:#0D0D0D;border-radius:16px;overflow:hidden;border:1px solid #1A1A1A">
  <div style="padding:40px;text-align:center">
    <div style="font-size:32px;font-weight:bold;color:#fff;letter-spacing:3px;margin-bottom:8px">DUNL<span style="color:#00FF87">Y</span></div>
    <div style="width:40px;height:2px;background:#00FF87;margin:0 auto 32px"></div>
    <div style="font-size:40px;margin-bottom:16px">🎉</div>
    <h1 style="color:#fff;font-size:24px;margin:0 0 16px;font-weight:bold">Bienvenue, ${prenom} !</h1>
    <p style="color:#888;font-size:15px;line-height:1.6;margin-bottom:32px">
      Ton compte Dunly est créé. Tu peux maintenant connecter tes factures et laisser Dunly travailler pour toi.
    </p>
    ${ctaButton(`${appUrl}/dashboard`, 'Accéder à mon dashboard →')}
    <div style="border-top:1px solid #1A1A1A;padding-top:24px">
      <p style="color:#555;font-size:13px">Des questions ? Réponds à cet email ou écris-nous à <a href="mailto:hello@dunly.io" style="color:#00FF87">hello@dunly.io</a></p>
    </div>
  </div>
  <div style="background:#080808;padding:20px;text-align:center;border-top:1px solid #1A1A1A">
    <p style="color:#555;font-size:11px;margin:0">© 2025 Dunly SAS</p>
  </div>
</div>
${WRAPPER_CLOSE}
</body></html>`
}
