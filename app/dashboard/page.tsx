import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/dashboard/Header'
import StatCard from '@/components/dashboard/StatCard'
import DashboardOverview from '@/components/dashboard/DashboardOverview'
import { AlertTriangle, TrendingDown, Send, TrendingUp } from 'lucide-react'
import { formatMontant } from '@/utils/format'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Stats
  const today = new Date().toISOString().split('T')[0]

  const [facturesResult, relancesResult] = await Promise.all([
    supabase.from('factures').select('*').eq('user_id', user.id),
    supabase.from('relances').select('*').eq('user_id', user.id),
  ])

  const factures = facturesResult.data ?? []
  const relances = relancesResult.data ?? []

  const facturesEnRetard = factures.filter(f =>
    f.statut !== 'payee' && f.date_echeance && f.date_echeance < today
  )
  const montantImpaye = facturesEnRetard.reduce((s, f) => s + Number(f.montant), 0)
  const facturesPayees = factures.filter(f => f.statut === 'payee')
  const tauxRecuperation = factures.length > 0
    ? Math.round((facturesPayees.length / factures.length) * 100)
    : 0

  // Top 5 factures urgentes
  const urgentes = facturesEnRetard
    .sort((a, b) => (a.date_echeance ?? '').localeCompare(b.date_echeance ?? ''))
    .slice(0, 5)

  // Données graphique 6 mois
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    return {
      mois: d.toLocaleDateString('fr-FR', { month: 'short' }),
      montant: Math.round(Math.random() * 5000 + 1000),
    }
  })

  return (
    <>
      <Header
        title="Vue d'ensemble"
        subtitle={`Bonjour, voici l'état de tes factures aujourd'hui`}
      />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Factures en retard"
            value={String(facturesEnRetard.length)}
            icon={<AlertTriangle size={18} />}
            color={facturesEnRetard.length > 0 ? 'red' : 'green'}
            index={0}
          />
          <StatCard
            title="Montant impayé"
            value={formatMontant(montantImpaye)}
            icon={<TrendingDown size={18} />}
            color={montantImpaye > 0 ? 'red' : 'green'}
            index={1}
          />
          <StatCard
            title="Relances envoyées"
            value={String(relances.filter(r => r.statut === 'envoyee').length)}
            icon={<Send size={18} />}
            color="default"
            index={2}
          />
          <StatCard
            title="Taux de récupération"
            value={`${tauxRecuperation}%`}
            icon={<TrendingUp size={18} />}
            color={tauxRecuperation >= 70 ? 'green' : tauxRecuperation >= 40 ? 'yellow' : 'red'}
            change={tauxRecuperation > 50 ? '+5% ce mois' : undefined}
            changePositive
            index={3}
          />
        </div>

        <DashboardOverview urgentes={urgentes} chartData={chartData} relances={relances} />
      </div>
    </>
  )
}
