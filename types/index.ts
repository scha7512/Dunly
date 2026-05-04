export interface Profile {
  id: string
  prenom: string | null
  nom: string | null
  entreprise: string | null
  plan: 'starter' | 'pro' | 'cabinet'
  created_at: string
}

export interface Client {
  id: string
  user_id: string
  nom: string
  email: string | null
  telephone: string | null
  score: 'bon' | 'moyen' | 'risque'
  created_at: string
}

export interface Facture {
  id: string
  user_id: string
  client_id: string | null
  numero: string
  montant: number
  date_emission: string | null
  date_echeance: string | null
  statut: 'en-attente' | 'relancee' | 'payee' | 'litige'
  created_at: string
  client?: Client
}

export interface Relance {
  id: string
  user_id: string
  facture_id: string
  type: 'douce' | 'ferme' | 'urgente' | 'manuelle'
  statut: 'programmee' | 'envoyee' | 'ouverte' | 'cliquee'
  envoye_le: string | null
  created_at: string
  facture?: Facture
}

export interface DashboardStats {
  facturesEnRetard: number
  montantImpaye: number
  relancesEnvoyees: number
  tauxRecuperation: number
}
