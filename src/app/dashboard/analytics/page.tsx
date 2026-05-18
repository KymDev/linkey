// src/app/dashboard/analytics/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PLANOS } from '@/lib/utils'
import AnalyticsClient from './AnalyticsClient'

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { periodo?: string }
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Busca página e perfil
  const { data: page } = await supabase
    .from('pages')
    .select('id, username, titulo, cor_destaque')
    .eq('user_id', user.id)
    .single()

  if (!page) redirect('/onboarding')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plano')
    .eq('id', user.id)
    .single()

  const plano   = profile?.plano ?? 'free'
  const periodo = searchParams.periodo ?? '30'

  // Limite de histórico por plano — fonte única: PLANOS em utils.ts
  const diasMax  = PLANOS[plano as keyof typeof PLANOS]?.analytics ?? 7
  const diasReal = Math.min(parseInt(periodo), diasMax)

  const agora = new Date()
  const inicio = new Date(agora)
  inicio.setDate(inicio.getDate() - diasReal)

  const inicioAnterior = new Date(inicio)
  inicioAnterior.setDate(inicioAnterior.getDate() - diasReal)

  // ── Todos os cliques do período ──
  const { data: cliques } = await supabase
    .from('clicks')
    .select('criado_em, link_id, origem, dispositivo')
    .eq('page_id', page.id)
    .gte('criado_em', inicio.toISOString())
    .order('criado_em', { ascending: true })

  // ── Cliques período anterior (para variação) ──
  const { count: cliquesAnterior } = await supabase
    .from('clicks')
    .select('*', { count: 'exact', head: true })
    .eq('page_id', page.id)
    .gte('criado_em', inicioAnterior.toISOString())
    .lt('criado_em', inicio.toISOString())

  // ── Links com nome para o relatório ──
  const { data: links } = await supabase
    .from('links')
    .select('id, emoji, titulo, tipo')
    .eq('page_id', page.id)
    .order('ordem')

  // ── Processa dados no servidor ──

  // Visitas por dia (cliques sem link_id = visita à página)
  const visitasPorDia = gerarSerie(
    diasReal,
    (cliques ?? []).filter(c => !c.link_id),
    'criado_em'
  )

  // Cliques por link
  const linkMap: Record<string, { emoji: string; titulo: string; tipo: string; cliques: number }> = {}
  ;(links ?? []).forEach(l => {
    linkMap[l.id] = { emoji: l.emoji, titulo: l.titulo, tipo: l.tipo, cliques: 0 }
  })
  ;(cliques ?? []).forEach(c => {
    if (c.link_id && linkMap[c.link_id]) {
      linkMap[c.link_id].cliques++
    }
  })
  const topLinks = Object.entries(linkMap)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.cliques - a.cliques)
    .slice(0, 8)

  // Origens
  const origensMap: Record<string, number> = {}
  ;(cliques ?? []).forEach(c => {
    origensMap[c.origem] = (origensMap[c.origem] ?? 0) + 1
  })
  const origens = Object.entries(origensMap)
    .sort((a, b) => b[1] - a[1])
    .map(([origem, total]) => ({ origem, total }))

  // Dispositivos
  const dispMap: Record<string, number> = {}
  ;(cliques ?? []).forEach(c => {
    dispMap[c.dispositivo] = (dispMap[c.dispositivo] ?? 0) + 1
  })
  const dispositivos = Object.entries(dispMap)
    .map(([dispositivo, total]) => ({ dispositivo, total }))

  // Horário de pico
  const horasMap: Record<number, number> = {}
  ;(cliques ?? []).forEach(c => {
    const h = new Date(c.criado_em).getHours()
    horasMap[h] = (horasMap[h] ?? 0) + 1
  })
  const horaPico = Object.entries(horasMap)
    .sort((a, b) => Number(b[1]) - Number(a[1]))[0]

  const totalVisitas  = (cliques ?? []).filter(c => !c.link_id).length
  const totalCliques  = (cliques ?? []).filter(c =>  c.link_id).length
  const taxaEngaj     = totalVisitas > 0 ? Math.round((totalCliques / totalVisitas) * 100) : 0

  return (
    <AnalyticsClient
      periodo={String(diasReal)}
      plano={plano}
      diasMax={diasMax}
      cor={page.cor_destaque ?? '#7C6FFF'}
      username={page.username}
      pageTitle={page.titulo ?? page.username}
      totalVisitas={totalVisitas}
      totalCliques={totalCliques}
      cliquesAnterior={cliquesAnterior ?? 0}
      taxaEngajamento={taxaEngaj}
      horaPico={horaPico ? `${horaPico[0]}h` : '—'}
      visitasPorDia={visitasPorDia}
      topLinks={topLinks}
      origens={origens}
      dispositivos={dispositivos}
    />
  )
}

// ── Helper: gera série temporal por dia ──────────────
function gerarSerie(
  dias: number,
  dados: Array<{ criado_em: string }>,
  campo: string
): Array<{ label: string; data: string; valor: number }> {
  const hoje  = new Date()
  const serie = []

  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(hoje)
    d.setDate(d.getDate() - i)
    const dataStr = d.toISOString().split('T')[0]

    const diasSemana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
    const meses      = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

    const label = dias <= 14
      ? diasSemana[d.getDay()]
      : `${d.getDate()} ${meses[d.getMonth()]}`

    const valor = dados.filter(item =>
      item.criado_em.startsWith(dataStr)
    ).length

    serie.push({ label, data: dataStr, valor })
  }

  return serie
}
