// Plans disponibles
export const PLANS = {
  gratuit: {
    name: 'Gratuit',
    price: 0,
    priceId: '',
    description: 'Pour découvrir Dunly',
    limits: { clients: 1, factures: 3 },
    features: [
      '1 client maximum',
      '3 factures maximum',
      'Relances manuelles uniquement',
      'Tableau de bord basique',
      'Pas d\'export',
    ],
    cta: 'Commencer gratuitement',
  },
  starter: {
    name: 'Starter',
    price: 39,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || '',
    description: 'Pour les freelances et indépendants',
    limits: { clients: 10, factures: 30 },
    features: [
      '10 clients',
      '30 factures/mois',
      'Relances automatiques (3 niveaux)',
      'Templates d\'emails inclus',
      'Tableau de bord complet',
      'Support par email',
    ],
    cta: 'Choisir Starter',
  },
  pro: {
    name: 'Pro',
    price: 99,
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    description: 'Pour les PME et agences',
    limits: { clients: Infinity, factures: Infinity },
    features: [
      'Clients illimités',
      'Factures illimitées',
      'Relances automatiques avancées',
      'Templates d\'emails personnalisables',
      'Analytics & rapports',
      'Export PDF / CSV',
      'Support prioritaire',
    ],
    cta: 'Choisir Pro',
  },
  cabinet: {
    name: 'Cabinet',
    price: 249,
    priceId: process.env.STRIPE_CABINET_PRICE_ID || '',
    description: 'Pour les cabinets comptables',
    limits: { clients: Infinity, factures: Infinity },
    features: [
      'Tout le plan Pro inclus',
      'Multi-utilisateurs (5 comptes)',
      'Marque blanche sur les emails',
      'Intégrations Pennylane & QuickBooks',
      'Account manager dédié',
      'SLA garanti 99,9%',
    ],
    cta: 'Choisir Cabinet',
  },
} as const

export type PlanKey = keyof typeof PLANS

// Email admin — accès illimité sans abonnement
export const ADMIN_EMAIL = 'tantonsacha@gmail.com'

// Vérifie si un utilisateur peut ajouter plus de clients/factures
export function canAddMore(plan: string, email: string, type: 'clients' | 'factures', currentCount: number): boolean {
  if (email === ADMIN_EMAIL) return true
  const planKey = (plan in PLANS ? plan : 'gratuit') as PlanKey
  const limit = PLANS[planKey].limits[type]
  return currentCount < limit
}

// Lazy init — n'importe Stripe que dans les API routes server-side
export function getStripe() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Stripe = require('stripe')
  return new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2026-04-22.dahlia',
  })
}
