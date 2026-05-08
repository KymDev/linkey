'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DiaData    { label: string; data: string; valor: number }
interface LinkData   { id: string; emoji: string; titulo: string; tipo: string; cliques: number }
interface OrigemData { origem: string; total: number }
interface DispData   { dispositivo: string; total: number }

interface Props {
  periodo:        string
  plano:          string
  diasMax:        number
  cor:            string
  username:       string
  pageTitle:      string
  totalVisitas:   number
  totalCliques:   number
  cliquesAnterior: number
  taxaEngajamento: number
  horaPico:       string
  visitasPorDia:  DiaData[]
  topLinks:       LinkData[]
  origens:        OrigemData[]
  dispositivos:   DispData[]
}

// ── Helpers de export ─────────────────────────────────

function baixarCSV(conteudo: string, nomeArquivo: string) {
  const bom  = '\uFEFF' // BOM para Excel reconhecer UTF-8
  const blob = new Blob([bom + conteudo], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = nomeArquivo
  a.click()
  URL.revokeObjectURL(url)
}

function gerarCSV(dados: {
  username:      string
  pageTitle:     string
  periodo:       string
  totalVisitas:  number
  totalCliques:  number
  taxaEngajamento: number
  horaPico:      string
  visitasPorDia: DiaData[]
  topLinks:      LinkData[]
  origens:       OrigemData[]
  dispositivos:  DispData[]
}): string {
  const linhas: string[] = []
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`

  // Cabeçalho do relatório
  linhas.push(esc(`Relatório LinKey — @${dados.username} (${dados.pageTitle})`))
  linhas.push(esc(`Período: últimos ${dados.periodo} dias`))
  linhas.push(esc(`Gerado em: ${new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })}`))
  linhas.push('')

  // Resumo geral
  linhas.push('RESUMO GERAL')
  linhas.push(['Métrica','Valor'].map(esc).join(','))
  linhas.push([esc('Total de visitas'),    esc(dados.totalVisitas)].join(','))
  linhas.push([esc('Total de cliques'),    esc(dados.totalCliques)].join(','))
  linhas.push([esc('Taxa de engajamento'), esc(`${dados.taxaEngajamento}%`)].join(','))
  linhas.push([esc('Horário de pico'),     esc(dados.horaPico)].join(','))
  linhas.push('')

  // Visitas por dia
  linhas.push('VISITAS POR DIA')
  linhas.push(['Data','Visitas'].map(esc).join(','))
  dados.visitasPorDia.forEach(d => {
    linhas.push([esc(d.data), esc(d.valor)].join(','))
  })
  linhas.push('')

  // Top links
  linhas.push('TOP LINKS CLICADOS')
  linhas.push(['Posição','Link','Tipo','Cliques'].map(esc).join(','))
  dados.topLinks.forEach((l, i) => {
    linhas.push([esc(i + 1), esc(`${l.emoji} ${l.titulo}`), esc(l.tipo), esc(l.cliques)].join(','))
  })
  linhas.push('')

  // Origens
  linhas.push('ORIGENS DE TRÁFEGO')
  linhas.push(['Origem','Visitas'].map(esc).join(','))
  dados.origens.forEach(o => {
    linhas.push([esc(o.origem), esc(o.total)].join(','))
  })
  linhas.push('')

  // Dispositivos
  linhas.push('DISPOSITIVOS')
  linhas.push(['Dispositivo','Visitas'].map(esc).join(','))
  dados.dispositivos.forEach(d => {
    linhas.push([esc(d.dispositivo), esc(d.total)].join(','))
  })

  return linhas.join('\n')
}

const PERIODOS = [
  { label: '7 dias',   valor: '7',   planos: ['free','pro','business'] },
  { label: '30 dias',  valor: '30',  planos: ['pro','business'] },
  { label: '90 dias',  valor: '90',  planos: ['pro','business'] },
  { label: '1 ano',    valor: '365', planos: ['business'] },
]

const ORIGENS_COR: Record<string, string> = {
  instagram: '#E1306C', whatsapp: '#25D366', google: '#4285F4',
  tiktok:    '#69C9D0', facebook: '#1877F2', twitter: '#1DA1F2',
  direto:    '#7C6FFF', youtube:  '#FF0000', linkedin: '#0A66C2',
  outro:     '#666666',
}

const ORIGENS_EMOJI: Record<string, string> = {
  instagram: '📱', whatsapp: '💬', google: '🔍', tiktok: '🎵',
  facebook:  '📘', twitter:  '🐦', direto: '🔗', youtube: '▶️',
  linkedin:  '💼', outro:    '🌐',
}

function calcVariacao(atual: number, anterior: number): number {
  if (anterior === 0) return atual > 0 ? 100 : 0
  return Math.round(((atual - anterior) / anterior) * 100)
}

export default function AnalyticsClient({
  periodo, plano, diasMax, cor, username, pageTitle,
  totalVisitas, totalCliques, cliquesAnterior,
  taxaEngajamento, horaPico,
  visitasPorDia, topLinks, origens, dispositivos,
}: Props) {
  const router = useRouter()

  const variacaoVisitas = calcVariacao(totalVisitas, cliquesAnterior)
  const totalOrigens    = origens.reduce((s, o) => s + o.total, 0)
  const totalLinks      = topLinks.reduce((s, l) => s + l.cliques, 0)
  const maxVisitas      = Math.max(...visitasPorDia.map(d => d.valor), 1)

  const exportBloqueado = plano === 'free'

  function mudarPeriodo(p: string) {
    router.push(`/dashboard/analytics?periodo=${p}`)
  }

  function handleExportCSV() {
    if (exportBloqueado) return
    const csv = gerarCSV({
      username, pageTitle, periodo,
      totalVisitas, totalCliques, taxaEngajamento, horaPico,
      visitasPorDia, topLinks, origens, dispositivos,
    })
    const data = new Date().toISOString().split('T')[0]
    baixarCSV(csv, `linkey-${username}-${data}.csv`)
  }

  return (
    <div>

      {/* Header */}
      <div className="analytics-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '4px' }}>
            Analytics
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
            linkey.cloud/<strong style={{ color: 'rgba(255,255,255,0.7)' }}>{username}</strong>
          </p>
        </div>

        {/* Seletor de período + Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* Botão Export CSV */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleExportCSV}
              title={exportBloqueado ? 'Export disponível no plano Pro' : 'Exportar relatório CSV'}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '9px 16px',
                background: exportBloqueado
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(111,255,150,0.08)',
                border: exportBloqueado
                  ? '1px solid rgba(255,255,255,0.08)'
                  : '1px solid rgba(111,255,150,0.25)',
                borderRadius: '100px',
                color: exportBloqueado ? 'rgba(255,255,255,0.25)' : '#6fff96',
                fontSize: '13px', fontWeight: 600,
                cursor: exportBloqueado ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => {
                if (!exportBloqueado) e.currentTarget.style.background = 'rgba(111,255,150,0.14)'
              }}
              onMouseOut={e => {
                if (!exportBloqueado) e.currentTarget.style.background = 'rgba(111,255,150,0.08)'
              }}
            >
              {/* Ícone download */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              CSV
              {exportBloqueado && (
                <span style={{
                  fontSize: '10px', fontWeight: 700,
                  padding: '1px 6px',
                  background: 'rgba(255,213,128,0.12)',
                  border: '1px solid rgba(255,213,128,0.25)',
                  borderRadius: '100px',
                  color: '#FFD580',
                }}>
                  Pro
                </span>
              )}
            </button>
          </div>

          {/* Seletor de período */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '100px',
            padding: '4px', gap: '2px',
          }}>
          {PERIODOS.map(p => {
            const liberado = p.planos.includes(plano)
            const ativo    = periodo === p.valor

            return (
              <button
                key={p.valor}
                onClick={() => liberado && mudarPeriodo(p.valor)}
                title={!liberado ? `Disponível no plano Pro ou Business` : ''}
                style={{
                  padding: '7px 14px',
                  borderRadius: '100px',
                  border: 'none',
                  background: ativo ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: !liberado
                    ? 'rgba(255,255,255,0.2)'
                    : ativo ? '#fff' : 'rgba(255,255,255,0.5)',
                  fontSize: '12px', fontWeight: ativo ? 600 : 400,
                  cursor: liberado ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                {p.label}
                {!liberado && <span style={{ fontSize: '10px' }}>🔒</span>}
              </button>
            )
          })}
        </div>
        </div> {/* fim flex period+export */}
      </div>

      {/* Banner upgrade se plano free */}
      {plano === 'free' && (
        <div style={{
          padding: '14px 20px',
          background: 'rgba(124,111,255,0.08)',
          border: '1px solid rgba(124,111,255,0.2)',
          borderRadius: '14px',
          marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          fontSize: '13px',
        }}>
          <span>⭐</span>
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>
            No plano Free você vê os últimos 7 dias.{' '}
            <Link href="/dashboard/planos" style={{ color: '#b4aeff', textDecoration: 'none', fontWeight: 600 }}>
              Faça upgrade para 90 dias ou 1 ano →
            </Link>
          </span>
        </div>
      )}

      {/* KPIs */}
      <div className="analytics-stats-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: '14px', marginBottom: '20px',
      }}>
        {[
          {
            emoji: '👁️', label: 'Visitas totais',
            valor: totalVisitas.toLocaleString('pt-BR'),
            variacao: variacaoVisitas, cor: '#7C6FFF',
          },
          {
            emoji: '🖱️', label: 'Cliques em links',
            valor: totalCliques.toLocaleString('pt-BR'),
            variacao: undefined, cor: '#FF6FBD',
          },
          {
            emoji: '📊', label: 'Taxa de engajamento',
            valor: `${taxaEngajamento}%`,
            variacao: undefined, cor: '#6FFFE9',
          },
          {
            emoji: '🕐', label: 'Horário de pico',
            valor: horaPico,
            variacao: undefined, cor: '#FFD580',
          },
        ].map((kpi, i) => (
          <div
            key={i}
            className="animate-fade-up"
            style={{
              animationDelay: `${i * 60}ms`,
              padding: '20px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '18px',
            }}
          >
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: `${kpi.cor}18`,
              border: `1px solid ${kpi.cor}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', marginBottom: '12px',
            }}>
              {kpi.emoji}
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1, marginBottom: '4px' }}>
              {kpi.valor}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
              {kpi.label}
            </div>
            {kpi.variacao !== undefined && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                marginTop: '8px', padding: '2px 8px', borderRadius: '100px',
                fontSize: '11px', fontWeight: 600,
                background: kpi.variacao >= 0
                  ? 'rgba(111,255,150,0.12)' : 'rgba(255,111,111,0.12)',
                color: kpi.variacao >= 0 ? '#6fff96' : '#ff9696',
              }}>
                {kpi.variacao >= 0 ? '↑' : '↓'} {Math.abs(kpi.variacao)}%
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Gráfico de visitas */}
      <div style={{
        padding: '24px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
              Visitas por dia
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-1px' }}>
              {totalVisitas.toLocaleString('pt-BR')}
              <span style={{ fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.45)', marginLeft: '8px' }}>
                nos últimos {periodo} dias
              </span>
            </div>
          </div>
        </div>

        {/* Gráfico de barras */}
        {visitasPorDia.length === 0 || visitasPorDia.every(d => d.valor === 0) ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.25)', fontSize: '14px' }}>
            Nenhuma visita ainda. Compartilhe seu link!
          </div>
        ) : (
          <div>
            <div style={{
              display: 'flex', alignItems: 'flex-end',
              gap: visitasPorDia.length > 30 ? '3px' : '6px',
              height: '120px',
              width: '100%',
            }}>
              {visitasPorDia.map((dia, i) => {
                const pct   = (dia.valor / maxVisitas) * 100
                const ehHoje = i === visitasPorDia.length - 1
                return (
                  <div
                    key={i}
                    title={`${dia.data}: ${dia.valor} visitas`}
                    style={{
                      flex: 1, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: '6px', height: '100%',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: `${Math.max(pct, 3)}%`,
                      background: ehHoje
                        ? `linear-gradient(180deg,${cor},${cor}88)`
                        : `linear-gradient(180deg,${cor}55,${cor}22)`,
                      borderRadius: '4px 4px 0 0',
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                    }}
                      onMouseOver={e => { e.currentTarget.style.opacity = '0.75' }}
                      onMouseOut={e => { e.currentTarget.style.opacity = '1' }}
                    />
                    {/* Labels — só mostra se não for muitos dias */}
                    {visitasPorDia.length <= 14 && (
                      <span style={{
                        fontSize: '10px',
                        color: ehHoje ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)',
                        fontWeight: ehHoje ? 600 : 400,
                      }}>
                        {dia.label}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legenda pra períodos longos */}
            {visitasPorDia.length > 14 && (
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginTop: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.3)',
              }}>
                <span>{visitasPorDia[0]?.data}</span>
                <span>Hoje</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Linha inferior: Top Links + Origens + Dispositivos */}
      <div className="analytics-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* Top Links */}
        <div style={{
          padding: '24px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>
            Top links clicados
          </div>

          {topLinks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>
              Nenhum clique ainda
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topLinks.map((link, i) => {
                const pct = totalLinks > 0 ? Math.round((link.cliques / totalLinks) * 100) : 0
                return (
                  <div key={link.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.2)', width: '14px' }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: '16px', width: '24px', textAlign: 'center' }}>
                        {link.emoji}
                      </span>
                      <span style={{ fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {link.titulo}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                        {link.cliques}
                      </span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', flexShrink: 0, width: '32px', textAlign: 'right' }}>
                        {pct}%
                      </span>
                    </div>
                    <div style={{
                      height: '4px', background: 'rgba(255,255,255,0.07)',
                      borderRadius: '2px', overflow: 'hidden', marginLeft: '24px',
                    }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: `linear-gradient(90deg, ${cor}, ${cor}88)`,
                        borderRadius: '2px',
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Origens */}
        <div style={{
          padding: '24px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>
            De onde vêm seus visitantes
          </div>

          {origens.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>
              Sem dados ainda
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {origens.map(({ origem, total }) => {
                const pct = totalOrigens > 0 ? Math.round((total / totalOrigens) * 100) : 0
                const corOri = ORIGENS_COR[origem] ?? '#666'
                return (
                  <div key={origem}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>{ORIGENS_EMOJI[origem] ?? '🌐'}</span>
                        <span style={{ fontSize: '13px', textTransform: 'capitalize' }}>{origem}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700 }}>{total}</span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', width: '30px', textAlign: 'right' }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div style={{
                      height: '5px', background: 'rgba(255,255,255,0.07)',
                      borderRadius: '3px', overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: corOri,
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

      {/* Dispositivos */}
      <div style={{
        padding: '24px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>
          Dispositivos
        </div>

        {dispositivos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>
            Sem dados ainda
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '16px' }}>
            {dispositivos.map(({ dispositivo, total }) => {
              const totalDisp = dispositivos.reduce((s, d) => s + d.total, 0)
              const pct = totalDisp > 0 ? Math.round((total / totalDisp) * 100) : 0
              const ehMobile = dispositivo === 'mobile'
              return (
                <div
                  key={dispositivo}
                  style={{
                    flex: 1, padding: '20px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '14px',
                    display: 'flex', alignItems: 'center', gap: '16px',
                  }}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: ehMobile ? 'rgba(124,111,255,0.15)' : 'rgba(111,255,233,0.12)',
                    border: `1px solid ${ehMobile ? 'rgba(124,111,255,0.25)' : 'rgba(111,255,233,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', flexShrink: 0,
                  }}>
                    {ehMobile ? '📱' : '🖥️'}
                  </div>
                  <div>
                    <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 }}>
                      {pct}%
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '2px', textTransform: 'capitalize' }}>
                      {dispositivo} · {total.toLocaleString('pt-BR')} visitas
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
