// src/app/dashboard/qrcode/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import QRCodeClient from './QRCodeClient'

export default async function QRCodePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plano')
    .eq('id', user.id)
    .single()

  const { data: page } = await supabase
    .from('pages')
    .select('username, titulo, foto_url, cor_destaque')
    .eq('user_id', user.id)
    .eq('ativo', true)
    .single()

  if (!page) redirect('/onboarding')

  return (
    <QRCodeClient
      username={page.username}
      titulo={page.titulo}
      fotoUrl={page.foto_url}
      corDestaque={page.cor_destaque}
      plano={profile?.plano ?? 'free'}
    />
  )
}
