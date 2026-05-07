// src/app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StatCard from '@/components/blocks/StatCard'
import BarChart from '@/components/blocks/BarChart'

// ─── HELPERS ─────────────────────────────────────────
function diasDaSemana() {
  const dias   = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const hoje   = new Date()
  const result = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(hoje)
    d.setDate(d.getDate() - i)
    result.push({ date: d.toISOString().split('T')[0], label: dias[d.getDay()] })
  }
  return result
}

function calcVariacao(atual: number, anterior: number): number {
  if (anterior === 0) return atual > 0 ? 100 : 0
  return Math.round(((atual - anterior) / anterior) * 100)
}

// ─── PAGE ─────────────────────────────────────────────
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { novo?: string }
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Busca página do usuário
  const { data: page } = await supabase
    .from('pages')
    .select('id, username, titulo, cor_destaque')
    .eq('user_id', user.id)
    .single()

  if (!page) redirect('/onboarding')

  // ── Datas para queries ──
  const agora     = new Date()
  const ini30     = new Date(agora); ini30.setDate(ini30.getDate() - 30)
  const ini60     = new Date(agora); ini60.setDate(ini60.getDate() - 60)
  const ini7      = new Date(agora); ini7.setDate(ini7.getDate()  -  7)

  // ── Cliques total do mês atual ──
  const { count: cliquesTotal } = await supabase
    .from('clicks')
    .select('*', { count: 'exact', head: true })
    .eq('page_id', page.id)
    .gte('criado_em', ini30.toISOString())

  // ── Cliques mês anterior (para variação) ──
  const { count: cliquesAnterior } = await supabase
    .from('clicks')
    .select('*', { count: 'exact', head: true })
    .eq('page_id', page.id)
    .gte('criado_em', ini60.toISOString())
    .lt('criado_em', ini30.toISOString())

  // ── Cliques no WhatsApp (tipo whatsapp) ──
  const { data: linksWpp } = await supabase
    .from('links')
    .select('id')
    .eq('page_id', page.id)
    .eq('tipo', 'whatsapp')

  const wppIds = linksWpp?.map(l => l.id) ?? []

  const { count: cliquesWpp } = await supabase
    .from('clicks')
    .select('*', { count: 'exact', head: true })
    .eq('page_id', page.id)
    .in('link_id', wppIds.length ? wppIds : ['00000000-0000-0000-0000-000000000000'])
    .gte('criado_em', ini30.toISOString())

  // ── Top links clicados ──
  const { data: todosLinks } = await supabase
    .from('links')
    .select('id, emoji, titulo, tipo')
    .eq('page_id', page.id)
    .eq('ativo', true)
    .order('ordem')

  // Contagem de cliques por link
  const linkStats = await Promise.all(
    (todosLinks ?? []).slice(0, 6).map(async link => {
      const { count } = await supabase
        .from('clicks')
        .select('*', { count: 'exact', head: true })
        .eq('link_id', link.id)
        .gte('criado_em', ini30.toISOString())
      return { ...link, cliques: count ?? 0 }
    })
  )

  const linkStatsOrdenados = linkStats
    .sort((a, b) => b.cliques - a.cliques)

  const totalLinkCliques = linkStatsOrdenados.reduce((s, l) => s + l.cliques, 0)

  // ── Visitas por dia (últimos 7 dias) ──
  const semana = diasDaSemana()

  const { data: clicksSemana } = await supabase
    .from('clicks')
    .select('criado_em')
    .eq('page_id', page.id)
    .is('link_id', null)  // só visitas de página, não cliques em links
    .gte('criado_em', ini7.toISOString())

  const visitasPorDia = semana.map(dia => ({
    label: dia.label,
    valor: (clicksSemana ?? []).filter(c =>
      c.criado_em.startsWith(dia.date)
    ).length,
  }))

  // ── Origens ──
  const { data: clicksOrigem } = await supabase
    .from('clicks')
    .select('origem')
    .eq('page_id', page.id)
    .gte('criado_em', ini30.toISOString())

  const origensMap: Record<string, number> = {}
  ;(clicksOrigem ?? []).forEach(c => {
    origensMap[c.origem] = (origensMap[c.origem] ?? 0) + 1
  })

  const origens = Object.entries(origensMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const totalOrigens = origens.reduce((s, [, v]) => s + v, 0)

  const origensCores: Record<string, string> = {
    instagram: '#E1306C',
    whatsapp:  '#25D366',
    google:    '#4285F4',
    tiktok:    '#69C9D0',
    facebook:  '#1877F2',
    twitter:   '#1DA1F2',
    direto:    '#7C6FFF',
    outro:     '#666',
  }

  const origenEmoji: Record<string, string> = {
    instagram: '📱', whatsapp: '💬', google: '🔍',
    tiktok: '🎵', facebook: '📘', twitter: '🐦',
    direto: '🔗', outro: '🌐',
  }

  const variacao = calcVariacao(cliquesTotal ?? 0, cliquesAnterior ?? 0)

  const cor = page.cor_destaque ?? '#7C6FFF'

  return (
    <div>

      {/* Banner de boas-vindas (só na primeira vez) */}
      {searchParams.novo === '1' && (
        <div
          className="animate-fade-up"
          style={{
            padding: '20px 24px',
            background: 'rgba(124,111,255,0.12)',
            border: '1px solid rgba(124,111,255,0.25)',
            borderRadius: '16px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <span style={{ fontSize: '32px' }}>🎉</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
              Sua página está no ar!
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
              Compartilhe seu link e comece a receber visitas agora.
            </div>
          </div>
          <a
            href={`/${page.username}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginLeft: 'auto',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #7C6FFF, #9c6fff)',
              color: '#fff',
              borderRadius: '100px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Ver página ↗
          </a>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '4px' }}>
            Visão geral
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
            Últimos 30 dias
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href={`/${page.username}`} target="_blank"
            style={{
              padding: '9px 18px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '100px',
              textDecoration: 'none',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            Ver página ↗
          </Link>
          <Link href="/dashboard/editor"
            style={{
              padding: '9px 18px',
              background: 'linear-gradient(135deg,#7C6FFF,#9c6fff)',
              borderRadius: '100px',
              textDecoration: 'none',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 4px 16px rgba(124,111,255,0.35)',
            }}
          >
            ✏️ Editar página
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <StatCard
          emoji="👁️"
          numero={cliquesTotal ?? 0}
          label="Visitas no mês"
          variacao={variacao}
          cor="purple"
          delay={0}
        />
        <StatCard
          emoji="📲"
          numero={cliquesWpp ?? 0}
          label="Cliques no WhatsApp"
          cor="green"
          delay={80}
        />
        <StatCard
          emoji="🔗"
          numero={todosLinks?.length ?? 0}
          label="Links ativos"
          cor="cyan"
          delay={160}
        />
      </div>

      {/* Gráfico + Origens */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '24px',
      }}>

        {/* Visitas por dia */}
        <div style={{
          padding: '24px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
                Visitas por dia
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700 }}>
                {visitasPorDia.reduce((s, d) => s + d.valor, 0).toLocaleString('pt-BR')}
              </div>
            </div>
            <span style={{
              padding: '4px 10px',
              background: 'rgba(111,255,150,0.12)',
              border: '1px solid rgba(111,255,150,0.2)',
              borderRadius: '100px',
              fontSize: '11px',
              color: '#6fff96',
              fontWeight: 600,
            }}>
              7 dias
            </span>
          </div>
          <BarChart dados={visitasPorDia} cor={cor} altura={80} />
        </div>

        {/* Origens */}
        <div style={{
          padding: '24px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>
            De onde vêm
          </div>

          {origens.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
              Sem dados ainda.<br/>Compartilhe seu link!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {origens.map(([origem, count]) => {
                const pct = totalOrigens > 0 ? Math.round((count / totalOrigens) * 100) : 0
                return (
                  <div key={origem}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{origenEmoji[origem] ?? '🌐'}</span>
                        <span style={{ textTransform: 'capitalize' }}>{origem}</span>
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
                        {pct}%
                      </span>
                    </div>
                    <div style={{
                      height: '5px',
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: origensCores[origem] ?? '#7C6FFF',
                        borderRadius: '3px',
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Links performance */}
      <div style={{
        padding: '24px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
            Performance dos links
          </div>
          <Link href="/dashboard/links" style={{
            fontSize: '12px', color: '#b4aeff', textDecoration: 'none',
            padding: '5px 12px',
            background: 'rgba(124,111,255,0.1)',
            border: '1px solid rgba(124,111,255,0.2)',
            borderRadius: '100px',
          }}>
            Gerenciar →
          </Link>
        </div>

        {linkStatsOrdenados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
            Nenhum link ainda.{' '}
            <Link href="/dashboard/links" style={{ color: '#b4aeff' }}>Adicionar links →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {linkStatsOrdenados.map((link, i) => {
              const pct = totalLinkCliques > 0
                ? Math.round((link.cliques / totalLinkCliques) * 100)
                : 0
              return (
                <div
                  key={link.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', width: '16px', textAlign: 'right' }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '18px', width: '32px', textAlign: 'center' }}>
                    {link.emoji}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                      {link.titulo}
                    </div>
                    <div style={{
                      height: '4px',
                      background: 'rgba(255,255,255,0.07)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${cor}, ${cor}88)`,
                        borderRadius: '2px',
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>
                      {link.cliques.toLocaleString('pt-BR')}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
                      {pct}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
