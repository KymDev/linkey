// src/app/dashboard/dominio/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DominioClient from './DominioClient'

export default async function DominioPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plano')
    .eq('id', user.id)
    .single()

  const plano = profile?.plano ?? 'free'

  // Busca domínio já cadastrado (se houver)
  const { data: dominioData } = await supabase
    .from('dominios_personalizados')
    .select('dominio, verificado, criado_em')
    .eq('user_id', user.id)
    .single()

  return (
    <DominioClient
      plano={plano}
      dominioAtual={dominioData?.dominio ?? null}
      verificado={dominioData?.verificado ?? false}
    />
  )
}
