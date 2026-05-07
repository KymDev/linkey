// src/app/dashboard/links/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LinksClient from './LinksClient'

export default async function LinksPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Busca página
  const { data: page } = await supabase
    .from('pages')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!page) redirect('/onboarding')

  // Busca todos os links (ativos e inativos) ordenados
  const { data: links } = await supabase
    .from('links')
    .select('id, emoji, titulo, url, tipo, ordem, ativo')
    .eq('page_id', page.id)
    .order('ordem', { ascending: true })

  // Busca plano do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('plano')
    .eq('id', user.id)
    .single()

  return (
    <LinksClient
      links={links ?? []}
      pageId={page.id}
      plano={profile?.plano ?? 'free'}
    />
  )
}
