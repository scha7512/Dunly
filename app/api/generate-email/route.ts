import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { type, context } = await request.json()

    const typeLabels: Record<string, string> = {
      douce: 'relance douce (J+30, ton amical et professionnel)',
      ferme: 'relance ferme (J+45, ton plus sérieux mais respectueux)',
      urgente: 'relance urgente (J+60, ton urgent et direct)',
    }

    const prompt = `Tu es un expert en recouvrement de créances pour une entreprise française.
Rédige un email de ${typeLabels[type] || 'relance'} pour une facture impayée.

${context ? `Contexte de l'entreprise : ${context}` : ''}

L'email doit utiliser ces variables entre crochets exactement comme écrit :
- [prenom] = prénom du client
- [nom] = nom du client
- [entreprise_client] = nom de l'entreprise du client
- [numero_facture] = numéro de la facture
- [montant] = montant dû en euros
- [date_echeance] = date d'échéance
- [jours_retard] = nombre de jours de retard
- [mon_entreprise] = nom de mon entreprise
- [mon_prenom] = mon prénom
- [mon_email] = mon adresse email

Règles :
- Email professionnel en français
- Maximum 150 mots
- Commence par "Objet :" sur la première ligne
- Puis une ligne vide
- Puis le corps de l'email
- Termine par une formule de politesse et [mon_prenom] de [mon_entreprise]
- Pas de markdown, texte brut uniquement`

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      // Fallback si pas de clé API — retourne un template par défaut
      const defaults: Record<string, string> = {
        douce: `Objet : Rappel facture [numero_facture] — [montant]

Bonjour [prenom],

J'espère que vous allez bien. Je me permets de vous contacter au sujet de la facture [numero_facture] d'un montant de [montant], dont l'échéance était le [date_echeance].

Il est possible que ce règlement vous ait échappé. Pourriez-vous procéder au virement dans les meilleurs délais ?

N'hésitez pas à me contacter si vous avez la moindre question.

Bien cordialement,
[mon_prenom] — [mon_entreprise]
[mon_email]`,
        ferme: `Objet : Relance — Facture [numero_facture] en attente de règlement

Bonjour [prenom],

Malgré mon précédent message, la facture [numero_facture] de [montant] reste impayée depuis [jours_retard] jours (échéance : [date_echeance]).

Je vous demande de bien vouloir régulariser cette situation dans un délai de 7 jours.

Sans retour de votre part, je serai contraint de prendre des mesures supplémentaires.

Cordialement,
[mon_prenom] — [mon_entreprise]
[mon_email]`,
        urgente: `Objet : ⚠️ URGENT — Facture [numero_facture] impayée depuis [jours_retard] jours

Bonjour [prenom],

La facture [numero_facture] de [montant] est toujours impayée malgré mes relances précédentes. L'échéance était le [date_echeance], soit [jours_retard] jours de retard.

Sans règlement sous 48h, je serai dans l'obligation de transmettre ce dossier à mon service contentieux.

[mon_prenom] — [mon_entreprise]
[mon_email]`,
      }
      return NextResponse.json({ email: defaults[type] || defaults.douce })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const email = data.content?.[0]?.text || ''

    return NextResponse.json({ email })
  } catch (error) {
    console.error('Generate email error:', error)
    return NextResponse.json({ error: 'Erreur lors de la génération' }, { status: 500 })
  }
}
