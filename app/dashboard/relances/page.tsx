import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/dashboard/Header'
import RelancesTimeline from '@/components/dashboard/RelancesTimeline'

export default async function RelancesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: relances } = await supabase
    .from('relances')
    .select(`
      *,
      facture:factures(numero, montant, client:clients(nom))
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <>
      <Header title="Historique des relances" subtitle="Toutes tes relances envoyées et programmées" />
      <div className="p-6">
        <RelancesTimeline relances={relances ?? []} />
      </div>
    </>
  )
}
