// src/app/[username]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import PublicPageClient from './PublicPageClient'

interface Props {
  params: { username: string }
}

// ─── METADATA DINÂMICA ───────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('pages')
    .select('titulo, subtitulo, cidade, foto_url')
    .eq('username', params.username)
    .eq('ativo', true)
    .single()

  if (!page) {
    return { title: 'Página não encontrada | LinKey' }
  }

  const description = [page.subtitulo, page.cidade]
    .filter(Boolean)
    .join(' • ')

  return {
    title: `${page.titulo} | LinKey`,
    description: description || `Veja todos os links de ${page.titulo}`,
    openGraph: {
      title: page.titulo,
      description: description || `Links de ${page.titulo}`,
      images: page.foto_url ? [page.foto_url] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: page.titulo,
      description: description || '',
      images: page.foto_url ? [page.foto_url] : [],
    },
  }
}

// ─── SERVER COMPONENT ────────────────────────────────
export default async function UsernamePage({ params }: Props) {
  const supabase = await createClient()

  // Busca página
  const { data: page } = await supabase
    .from('pages')
    .select(`
      id,
      username,
      titulo,
      subtitulo,
      cidade,
      foto_url,
      tema_cor,
      cor_destaque,
      user_id
    `)
    .eq('username', params.username)
    .eq('ativo', true)
    .single()

  if (!page) notFound()

  // Busca links ativos ordenados
  const { data: links } = await supabase
    .from('links')
    .select('id, emoji, titulo, url, tipo')
    .eq('page_id', page.id)
    .eq('ativo', true)
    .or(`expira_em.is.null,expira_em.gt.${new Date().toISOString()}`)
    .order('ordem', { ascending: true })

  // Busca profissão do perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('profissao, plano')
    .eq('id', page.user_id)
    .single()

  // Busca dados All-Star se for plano allstar
  let allstarData = null
  if (profile?.plano === 'allstar') {
    const { data } = await supabase
      .from('allstar_data')
      .select('*')
      .eq('user_id', page.user_id)
      .single()
    allstarData = data
  }

  return (
    <PublicPageClient
      page={page}
      links={links ?? []}
      profissao={profile?.profissao ?? 'outro'}
      plano={profile?.plano ?? 'free'}
      allstarData={allstarData}
    />
  )
}
