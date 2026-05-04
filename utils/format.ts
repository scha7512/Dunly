export function formatMontant(montant: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(montant)
}

export function formatDate(date: string | null): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function joursRetard(dateEcheance: string | null): number {
  if (!dateEcheance) return 0
  const today = new Date()
  const echeance = new Date(dateEcheance)
  const diff = today.getTime() - echeance.getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

export function getStatutLabel(statut: string): string {
  const labels: Record<string, string> = {
    'en-attente': 'En attente',
    'relancee': 'Relancée',
    'payee': 'Payée',
    'litige': 'Litige',
  }
  return labels[statut] || statut
}

export function getScoreLabel(score: string): string {
  const labels: Record<string, string> = {
    'bon': 'Bon payeur',
    'moyen': 'Attention',
    'risque': 'À risque',
  }
  return labels[score] || score
}
