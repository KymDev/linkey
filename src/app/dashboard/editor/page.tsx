// src/app/dashboard/editor/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditorClient from './EditorClient'

export default async function EditorPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Busca página
  const { data: page } = await supabase
    .from('pages')
    .select('id, username, titulo, subtitulo, cidade, foto_url, tema_cor, cor_destaque')
    .eq('user_id', user.id)
    .single()

  if (!page) redirect('/onboarding')

  // Busca links ativos
  const { data: links } = await supabase
    .from('links')
    .select('id, emoji, titulo, tipo, ativo')
    .eq('page_id', page.id)
    .order('ordem', { ascending: true })

  // Busca perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('profissao, plano')
    .eq('id', user.id)
    .single()

  return (
    <EditorClient
      page={page}
      links={links ?? []}
      profissao={profile?.profissao ?? 'outro'}
      plano={profile?.plano ?? 'free'}
      userId={user.id}
    />
  )
}
