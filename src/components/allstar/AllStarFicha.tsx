'use client'

import Image from 'next/image'

export interface AllStarData {
  categoria:         string
  apelido:           string | null
  pais:              string | null
  escudo_url:        string | null
  verificado:        boolean

  // Futebol
  clube_atual:       string | null
  posicao:           string | null
  numero_camisa:     number | null
  overall:           number | null
  pe_dominante:      string | null
  altura_cm:         number | null
  peso_kg:           number | null
  valor_mercado:     string | null

  // Lutador
  categoria_peso:    string | null
  cartel_vitorias:   number | null
  cartel_derrotas:   number | null
  cartel_empates:    number | null
  nocautes:          number | null
  finalizacoes:      number | null
  academia:          string | null
  ranking_posicao:   string | null

  // Natação / Atletismo
  modalidade:        string | null
  federacao:         string | null
  recordes:          string | null
  olimpiadas:        string | null

  // Músico
  genero_musical:    string | null
  album_atual:       string | null
  gravadora:         string | null
  streamings_mes:    string | null

  // Ator / Influencer
  seguidores_total:  string | null
  obras_destaque:    string | null

  // Escritor
  livros_publicados: number | null
  genero_literario:  string | null
  editora:           string | null

  // Empresa
  setor:             string | null
  ano_fundacao:      number | null
  funcionarios:      string | null
}

interface Props {
  allstar:   AllStarData
  titulo:    string
  foto_url:  string | null
  cor:       string
}

export default function AllStarFicha({ allstar, titulo, foto_url, cor }: Props) {
  switch (allstar.categoria) {
    case 'atleta_futebol':  return <FichaFutebol   allstar={allstar} titulo={titulo} foto_url={foto_url} cor={cor} />
    case 'lutador':         return <FichaLutador    allstar={allstar} titulo={titulo} foto_url={foto_url} cor={cor} />
    case 'musico_allstar':  return <FichaMusico     allstar={allstar} titulo={titulo} foto_url={foto_url} cor={cor} />
    case 'ator_influencer': return <FichaInfluencer allstar={allstar} titulo={titulo} foto_url={foto_url} cor={cor} />
    case 'nadador_atletismo': return <FichaAtleta   allstar={allstar} titulo={titulo} foto_url={foto_url} cor={cor} />
    case 'escritor_autor':  return <FichaEscritor   allstar={allstar} titulo={titulo} foto_url={foto_url} cor={cor} />
    case 'empresa_marca':   return <FichaEmpresa    allstar={allstar} titulo={titulo} foto_url={foto_url} cor={cor} />
    default:                return null
  }
}

// ─── SHARED ──────────────────────────────────────────────────────

function Selo({ cor }: { cor: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px',
      background: `${cor}18`,
      border: `1px solid ${cor}40`,
      borderRadius: '100px',
      fontSize: '11px', fontWeight: 700, color: cor,
      letterSpacing: '0.05em',
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> VERIFICADO
    </div>
  )
}

function FichaBase({ children, cor, gradient }: { children: React.ReactNode, cor: string, gradient?: string }) {
  return (
    <div style={{
      width: '100%',
      borderRadius: '24px',
      border: `1px solid ${cor}30`,
      background: gradient ?? `linear-gradient(145deg, ${cor}10 0%, rgba(0,0,0,0) 60%)`,
      backdropFilter: 'blur(20px)',
      padding: '28px 24px',
      marginBottom: '28px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow de fundo */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '160px', height: '160px',
        borderRadius: '50%',
        background: `${cor}20`,
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  )
}

function Stat({ label, value, cor }: { label: string, value: string | number | null, cor: string }) {
  if (!value && value !== 0) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontSize: '18px', fontWeight: 800, color: cor, letterSpacing: '-0.03em' }}>{value}</span>
      <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
    </div>
  )
}

function AvatarFicha({ foto_url, titulo, size = 88, radius = '50%', border, cor }: {
  foto_url: string | null, titulo: string, size?: number, radius?: string, border?: string, cor: string
}) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      overflow: 'hidden',
      border: border ?? `2px solid ${cor}50`,
      background: '#0f0f1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {foto_url
        ? <Image src={foto_url} alt={titulo} width={size} height={size} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
        : <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      }
    </div>
  )
}

// ─── FUTEBOL ─────────────────────────────────────────────────────

function FichaFutebol({ allstar, titulo, foto_url, cor }: Props) {
  const corCard = '#FFD700'
  return (
    <FichaBase cor={corCard} gradient="linear-gradient(145deg, rgba(255,215,0,0.08) 0%, rgba(0,0,0,0) 70%)">
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            <AvatarFicha foto_url={foto_url} titulo={titulo} size={88} radius="16px" cor={corCard} border={`3px solid ${corCard}60`} />
            {allstar.numero_camisa && (
              <div style={{
                position: 'absolute', bottom: '-8px', right: '-8px',
                width: '28px', height: '28px', borderRadius: '8px',
                background: corCard, color: '#0a0a0a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 900,
              }}>
                {allstar.numero_camisa}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            {allstar.verificado && <div style={{ marginBottom: '6px' }}><Selo cor={corCard} /></div>}
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '4px', lineHeight: 1.1 }}>
              {allstar.apelido || titulo}
            </h2>
            {allstar.posicao && (
              <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, marginBottom: '4px' }}>{allstar.posicao}</div>
            )}
            {allstar.clube_atual && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {allstar.escudo_url && (
                  <Image src={allstar.escudo_url} alt="escudo" width={18} height={18} style={{ objectFit: 'contain' }} />
                )}
                <span style={{ fontSize: '13px', color: corCard, fontWeight: 700 }}>{allstar.clube_atual}</span>
                {allstar.pais && <span style={{ fontSize: '13px', color: '#64748B' }}>· {allstar.pais}</span>}
              </div>
            )}
          </div>

          {/* Overall */}
          {allstar.overall && (
            <div style={{
              width: '56px', height: '56px', borderRadius: '12px', flexShrink: 0,
              background: `linear-gradient(135deg, ${corCard}, #FFA500)`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 8px 20px ${corCard}40`,
            }}>
              <span style={{ fontSize: '22px', fontWeight: 900, color: '#0a0a0a', lineHeight: 1 }}>{allstar.overall}</span>
              <span style={{ fontSize: '8px', fontWeight: 800, color: '#0a0a0a80', letterSpacing: '0.1em' }}>OVR</span>
            </div>
          )}
        </div>

        {/* Stats grid */}
        {(allstar.altura_cm || allstar.peso_kg || allstar.pe_dominante || allstar.valor_mercado) && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px', padding: '16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {allstar.altura_cm && <Stat label="Altura" value={`${allstar.altura_cm}cm`} cor={corCard} />}
            {allstar.peso_kg   && <Stat label="Peso"   value={`${allstar.peso_kg}kg`}   cor={corCard} />}
            {allstar.pe_dominante && <Stat label="Pé"  value={allstar.pe_dominante}      cor={corCard} />}
            {allstar.valor_mercado && <Stat label="Valor" value={allstar.valor_mercado}  cor={corCard} />}
          </div>
        )}
      </div>
    </FichaBase>
  )
}

// ─── LUTADOR ─────────────────────────────────────────────────────

function FichaLutador({ allstar, titulo, foto_url, cor }: Props) {
  const corCard = '#FF4500'
  const total = (allstar.cartel_vitorias ?? 0) + (allstar.cartel_derrotas ?? 0) + (allstar.cartel_empates ?? 0)

  return (
    <FichaBase cor={corCard} gradient="linear-gradient(145deg, rgba(255,69,0,0.10) 0%, rgba(0,0,0,0) 70%)">
      <div style={{ position: 'relative', zIndex: 1 }}>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>
          <AvatarFicha foto_url={foto_url} titulo={titulo} size={88} cor={corCard} border={`3px solid ${corCard}60`} />
          <div style={{ flex: 1 }}>
            {allstar.verificado && <div style={{ marginBottom: '6px' }}><Selo cor={corCard} /></div>}
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '4px' }}>
              {allstar.apelido || titulo}
            </h2>
            {allstar.categoria_peso && (
              <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, marginBottom: '4px' }}>{allstar.categoria_peso}</div>
            )}
            {allstar.ranking_posicao && (
              <div style={{ fontSize: '13px', color: corCard, fontWeight: 700 }}>{allstar.ranking_posicao}</div>
            )}
            {allstar.academia && (
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                {allstar.academia}
              </div>
            )}
          </div>
        </div>

        {/* Cartel */}
        {total > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px', borderRadius: '14px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)', marginBottom: '12px',
          }}>
            {[
              { label: 'Vitórias', value: allstar.cartel_vitorias, cor: '#22c55e' },
              { label: 'Derrotas', value: allstar.cartel_derrotas, cor: '#ef4444' },
              { label: 'Empates', value: allstar.cartel_empates,  cor: '#94A3B8' },
            ].map(s => (
              <div key={s.label} style={{ padding: '14px 8px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 900, color: s.cor, lineHeight: 1 }}>{s.value ?? 0}</div>
                <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {(allstar.nocautes || allstar.finalizacoes) && (
          <div style={{ display: 'flex', gap: '12px' }}>
            {allstar.nocautes     && <Stat label="KO / TKO" value={allstar.nocautes}     cor={corCard} />}
            {allstar.finalizacoes && <Stat label="Finalizações" value={allstar.finalizacoes} cor={corCard} />}
          </div>
        )}
      </div>
    </FichaBase>
  )
}

// ─── MÚSICO ──────────────────────────────────────────────────────

function FichaMusico({ allstar, titulo, foto_url, cor }: Props) {
  const corCard = '#C084FC'
  return (
    <FichaBase cor={corCard} gradient="linear-gradient(145deg, rgba(192,132,252,0.10) 0%, rgba(0,0,0,0) 70%)">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
          <AvatarFicha foto_url={foto_url} titulo={titulo} size={88} radius="20px" cor={corCard} border={`3px solid ${corCard}50`} />
          <div style={{ flex: 1 }}>
            {allstar.verificado && <div style={{ marginBottom: '6px' }}><Selo cor={corCard} /></div>}
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '4px' }}>
              {allstar.apelido || titulo}
            </h2>
            {allstar.genero_musical && <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>{allstar.genero_musical}</div>}
            {allstar.gravadora && (
              <div style={{ fontSize: '12px', color: corCard, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                {allstar.gravadora}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {allstar.streamings_mes && <Stat label="Ouvintes/mês" value={allstar.streamings_mes} cor={corCard} />}
          {allstar.album_atual    && (
            <div style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Álbum atual</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                  {allstar.album_atual}
                </div>
            </div>
          )}
        </div>
      </div>
    </FichaBase>
  )
}

// ─── ATOR / INFLUENCER ───────────────────────────────────────────

function FichaInfluencer({ allstar, titulo, foto_url, cor }: Props) {
  const corCard = '#F472B6'
  return (
    <FichaBase cor={corCard} gradient="linear-gradient(145deg, rgba(244,114,182,0.10) 0%, rgba(0,0,0,0) 70%)">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
          <AvatarFicha foto_url={foto_url} titulo={titulo} size={88} cor={corCard} border={`3px solid ${corCard}50`} />
          <div style={{ flex: 1 }}>
            {allstar.verificado && <div style={{ marginBottom: '6px' }}><Selo cor={corCard} /></div>}
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '4px' }}>
              {allstar.apelido || titulo}
            </h2>
            {allstar.pais              && <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>{allstar.pais}</div>}
            {allstar.seguidores_total && (
              <div style={{ fontSize: '15px', color: corCard, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                {allstar.seguidores_total} seguidores
              </div>
            )}
          </div>
        </div>
        {allstar.obras_destaque && (
          <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Destaques</div>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>{allstar.obras_destaque}</p>
          </div>
        )}
      </div>
    </FichaBase>
  )
}

// ─── NADADOR / ATLETISMO ─────────────────────────────────────────

function FichaAtleta({ allstar, titulo, foto_url, cor }: Props) {
  const corCard = '#4FC3F7'
  return (
    <FichaBase cor={corCard} gradient="linear-gradient(145deg, rgba(79,195,247,0.10) 0%, rgba(0,0,0,0) 70%)">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
          <AvatarFicha foto_url={foto_url} titulo={titulo} size={88} cor={corCard} border={`3px solid ${corCard}50`} />
          <div style={{ flex: 1 }}>
            {allstar.verificado && <div style={{ marginBottom: '6px' }}><Selo cor={corCard} /></div>}
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '4px' }}>
              {allstar.apelido || titulo}
            </h2>
            {allstar.modalidade && (
              <div style={{ fontSize: '12px', color: corCard, fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                {allstar.modalidade}
              </div>
            )}
            {allstar.federacao  && <div style={{ fontSize: '12px', color: '#94A3B8' }}>{allstar.federacao}</div>}
            {allstar.pais       && <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{allstar.pais}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {allstar.recordes && (
            <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Recordes</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: corCard, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {allstar.recordes}
                </div>
            </div>
          )}
          {allstar.olimpiadas && (
            <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Olímpiadas</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={corCard} strokeWidth="1.8"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                  {allstar.olimpiadas}
                </div>
            </div>
          )}
        </div>
      </div>
    </FichaBase>
  )
}

// ─── ESCRITOR ────────────────────────────────────────────────────

function FichaEscritor({ allstar, titulo, foto_url, cor }: Props) {
  const corCard = '#6FFF96'
  return (
    <FichaBase cor={corCard} gradient="linear-gradient(145deg, rgba(111,255,150,0.08) 0%, rgba(0,0,0,0) 70%)">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
          <AvatarFicha foto_url={foto_url} titulo={titulo} size={88} radius="16px" cor={corCard} border={`3px solid ${corCard}40`} />
          <div style={{ flex: 1 }}>
            {allstar.verificado && <div style={{ marginBottom: '6px' }}><Selo cor={corCard} /></div>}
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '4px' }}>
              {allstar.apelido || titulo}
            </h2>
            {allstar.genero_literario  && <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>{allstar.genero_literario}</div>}
            {allstar.editora && (
              <div style={{ fontSize: '12px', color: corCard, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                {allstar.editora}
              </div>
            )}
          </div>
        </div>
        {(allstar.livros_publicados ?? 0) > 0 && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Stat label="Livros publicados" value={allstar.livros_publicados} cor={corCard} />
          </div>
        )}
      </div>
    </FichaBase>
  )
}

// ─── EMPRESA / MARCA ─────────────────────────────────────────────

function FichaEmpresa({ allstar, titulo, foto_url, cor }: Props) {
  const corCard = '#FFD700'
  return (
    <FichaBase cor={corCard} gradient="linear-gradient(145deg, rgba(255,215,0,0.08) 0%, rgba(0,0,0,0) 70%)">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
          {/* Logo da empresa */}
          <div style={{
            width: 88, height: 88, borderRadius: '20px', flexShrink: 0,
            overflow: 'hidden', border: `2px solid ${corCard}40`,
            background: '#0f0f1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {(allstar.escudo_url || foto_url)
              ? <Image src={allstar.escudo_url ?? foto_url!} alt={titulo} width={88} height={88} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              : <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            }
          </div>
          <div style={{ flex: 1 }}>
            {allstar.verificado && <div style={{ marginBottom: '6px' }}><Selo cor={corCard} /></div>}
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '4px' }}>
              {titulo}
            </h2>
            {allstar.setor       && <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>{allstar.setor}</div>}
            {allstar.pais        && <div style={{ fontSize: '12px', color: '#64748B' }}>{allstar.pais}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {allstar.ano_fundacao && <Stat label="Fundada em"   value={allstar.ano_fundacao}  cor={corCard} />}
          {allstar.funcionarios && <Stat label="Funcionários" value={allstar.funcionarios}  cor={corCard} />}
        </div>
      </div>
    </FichaBase>
  )
}
