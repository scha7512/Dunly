import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('prenom, entreprise, plan')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-[#050505]">
      <Sidebar profile={profile ?? undefined} />
      <main className="ml-[220px] min-h-screen">
        {children}
      </main>
    </div>
  )
}
