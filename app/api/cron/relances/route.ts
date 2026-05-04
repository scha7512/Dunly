import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { resend, FROM_EMAIL } from '@/lib/resend/client'
import { emailRelanceDouce, emailRelanceFerme, emailRelanceUrgente } from '@/lib/resend/emailTemplates'

// Sécurité : valide le secret cron Vercel
function isAuthorized(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  return authHeader === `Bearer ${process.env.CRON_SECRET}`
}

// Détermine le type de relance selon les jours de retard
function getTypeRelance(joursRetard: number): 'douce' | 'ferme' | 'urgente' | null {
  if (joursRetard >= 60) return 'urgente'
  if (joursRetard >= 45) return 'ferme'
  if (joursRetard >= 30) return 'douce'
  return null
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Client Supabase avec service role key pour contourner RLS
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  const today = new Date().toISOString().split('T')[0]

  // Récupère toutes les factures en retard non payées
  const { data: factures, error } = await supabase
    .from('factures')
    .select(`
      id, numero, montant, date_echeance, user_id,
      client:clients(nom, email),
      profile:profiles(entreprise)
    `)
    .in('statut', ['en-attente', 'relancee'])
    .lt('date_echeance', today)

  if (error) {
    console.error('Cron error fetching factures:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let sent = 0
  let skipped = 0
  const errors: string[] = []

  for (const facture of factures ?? []) {
    const echeance = new Date(facture.date_echeance)
    const joursRetard = Math.floor((Date.now() - echeance.getTime()) / (1000 * 60 * 60 * 24))
    const type = getTypeRelance(joursRetard)

    if (!type) { skipped++; continue }

    // Vérifier qu'une relance de ce type n'a pas déjà été envoyée pour cette facture
    const { data: existing } = await supabase
      .from('relances')
      .select('id')
      .eq('facture_id', facture.id)
      .eq('type', type)
      .limit(1)

    if (existing && existing.length > 0) { skipped++; continue }

    const client = facture.client as unknown as { nom: string; email: string } | null
    const profile = facture.profile as unknown as { entreprise: string } | null

    if (!client?.email) { skipped++; continue }

    const montantFormate = new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency: 'EUR'
    }).format(Number(facture.montant))

    const dateFormatee = new Intl.DateTimeFormat('fr-FR').format(new Date(facture.date_echeance))

    const baseParams = {
      clientNom: client.nom,
      factureNumero: facture.numero,
      factureMontant: montantFormate,
      dateEcheance: dateFormatee,
      entrepriseNom: profile?.entreprise ?? 'Votre fournisseur',
    }

    let html: string
    if (type === 'douce') {
      html = emailRelanceDouce(baseParams)
    } else if (type === 'ferme') {
      html = emailRelanceFerme({ ...baseParams, joursRetard })
    } else {
      html = emailRelanceUrgente({ ...baseParams, joursRetard })
    }

    const subjects = {
      douce: `Rappel de paiement — Facture ${facture.numero}`,
      ferme: `RELANCE — Facture ${facture.numero} en retard de ${joursRetard}j`,
      urgente: `URGENT — Mise en demeure facture ${facture.numero}`,
    }

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: client.email,
        subject: subjects[type],
        html,
      })

      await supabase.from('relances').insert({
        user_id: facture.user_id,
        facture_id: facture.id,
        type,
        statut: 'envoyee',
        envoye_le: new Date().toISOString(),
        contenu_email: html,
      })

      await supabase
        .from('factures')
        .update({ statut: 'relancee' })
        .eq('id', facture.id)

      sent++
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      errors.push(`Facture ${facture.id}: ${msg}`)
      console.error(`Relance failed for facture ${facture.id}:`, err)
    }
  }

  return NextResponse.json({
    success: true,
    sent,
    skipped,
    errors,
    total: factures?.length ?? 0,
    timestamp: new Date().toISOString(),
  })
}
