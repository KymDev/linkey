// src/app/dashboard/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/blocks/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nome, plano')
    .eq('id', user.id)
    .single()

  const { data: page } = await supabase
    .from('pages')
    .select('username, foto_url')
    .eq('user_id', user.id)
    .eq('ativo', true)
    .single()

  if (!page) redirect('/onboarding')

  return (
    <>
      <style>{`
        .dashboard-wrapper {
          display: flex;
          min-height: 100vh;
        }
        .dashboard-main {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
          max-width: calc(100vw - 240px);
          min-width: 0;
        }
        @media (max-width: 768px) {
          .dashboard-main {
            padding: 20px 16px;
            padding-bottom: calc(80px + env(safe-area-inset-bottom));
            max-width: 100vw;
          }
        }
      `}</style>

      <div className="dashboard-wrapper">
        <Sidebar
          username={page.username}
          nome={profile?.nome ?? user.email ?? 'Usuário'}
          plano={profile?.plano ?? 'free'}
          fotoUrl={page.foto_url}
        />
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </>
  )
}
