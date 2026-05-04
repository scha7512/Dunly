// Plans disponibles (pas besoin de Stripe pour l'affichage)
export const PLANS = {
  starter: {
    name: 'Starter',
    price: 29,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || '',
    features: [
      'Jusqu\'à 50 factures/mois',
      '3 séquences de relance',
      'Emails automatiques',
      'Tableau de bord basique',
      'Support email',
    ],
  },
  pro: {
    name: 'Pro',
    price: 89,
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    features: [
      'Factures illimitées',
      'Séquences illimitées',
      'Personnalisation des emails',
      'Analytics avancés',
      'Intégrations (Pennylane, QuickBooks)',
      'Support prioritaire',
    ],
  },
  cabinet: {
    name: 'Cabinet',
    price: 199,
    priceId: process.env.STRIPE_CABINET_PRICE_ID || '',
    features: [
      'Tout le plan Pro',
      'Multi-comptes (jusqu\'à 10)',
      'White-label',
      'API accès',
      'Manager dédié',
      'SLA garanti',
    ],
  },
} as const

// Lazy init — n'importe Stripe que dans les API routes server-side
export function getStripe() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Stripe = require('stripe')
  return new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2026-04-22.dahlia',
  })
}
