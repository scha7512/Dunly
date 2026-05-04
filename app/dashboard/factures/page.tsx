import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/dashboard/Header'
import FacturesTable from '@/components/dashboard/FacturesTable'

export default async function FacturesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: factures } = await supabase
    .from('factures')
    .select('*, client:clients(nom, email)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: clients } = await supabase
    .from('clients')
    .select('id, nom')
    .eq('user_id', user.id)
    .order('nom')

  return (
    <>
      <Header title="Factures" subtitle="Gère et suis toutes tes factures" />
      <div className="p-6">
        <FacturesTable
          factures={factures ?? []}
          clients={clients ?? []}
          userId={user.id}
        />
      </div>
    </>
  )
}
