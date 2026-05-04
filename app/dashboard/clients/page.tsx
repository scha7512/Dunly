import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/dashboard/Header'
import ClientsTable from '@/components/dashboard/ClientsTable'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: clients } = await supabase
    .from('clients')
    .select('*, factures(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <Header title="Clients" subtitle="Gère tes clients et leur score de risque" />
      <div className="p-6">
        <ClientsTable clients={clients ?? []} userId={user.id} />
      </div>
    </>
  )
}
