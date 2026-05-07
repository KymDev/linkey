'use client'

interface LinkPreview {
  id?:    string
  emoji:  string
  titulo: string
  tipo:   string
  ativo:  boolean
}

interface Props {
  titulo:      string
  subtitulo?:  string | null
  cidade?:     string | null
  fotoUrl?:    string | null
  corDestaque: string
  temaCor:     string
  profissao?:  string
  links:       LinkPreview[]
  plano?:      string
}

const SOCIAIS = ['instagram', 'tiktok', 'youtube', 'spotify', 'twitter']

export default function PhonePreview({
  titulo, subtitulo, cidade, fotoUrl,
  corDestaque, temaCor, profissao = 'outro',
  links, plano = 'free',
}: Props) {
  const cor            = corDestaque || '#7C6FFF'
  const linksPrincipais = links.filter(l => l.ativo && !SOCIAIS.includes(l.tipo))
  const linksSociais    = links.filter(l => l.ativo &&  SOCIAIS.includes(l.tipo))

  return (
    <div style={{
      width: '260px',
      flexShrink: 0,
      position: 'sticky',
      top: '24px',
      alignSelf: 'flex-start',
    }}>
      <div style={{
        fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
        textAlign: 'center', marginBottom: '12px',
      }}>
        Preview ao vivo
      </div>

      {/* Frame do celular */}
      <div style={{
        width: '260px',
        background: 'rgba(0,0,0,0.7)',
        border: '1.5px solid rgba(255,255,255,0.15)',
        borderRadius: '36px',
        padding: '16px 14px 20px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Fundo dinâmico */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, ${cor}22 0%, transparent 60%),
            ${temaCor || '#0a0a0f'}
          `,
        }} />

        {/* Notch */}
        <div style={{
          width: '80px', height: '20px',
          background: 'rgba(0,0,0,0.9)',
          borderRadius: '100px',
          margin: '0 auto 14px',
          position: 'relative', zIndex: 1,
        }} />

        {/* Conteúdo */}
        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '12px' }}>
            {fotoUrl ? (
              <img
                src={fotoUrl}
                alt=""
                style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  objectFit: 'cover',
                  border: `2px solid ${cor}55`,
                  boxShadow: `0 6px 20px ${cor}33`,
                  marginBottom: '8px',
                }}
              />
            ) : (
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${cor}, ${cor}88)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', marginBottom: '8px',
                border: `2px solid ${cor}44`,
                boxShadow: `0 6px 20px ${cor}33`,
              }}>
                {profissaoEmoji(profissao)}
              </div>
            )}

            <div style={{
              fontSize: '14px', fontWeight: 700,
              letterSpacing: '-0.2px', textAlign: 'center',
              color: '#fff', maxWidth: '100%',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {titulo || 'Seu nome aqui'}
            </div>

            {subtitulo && (
              <div style={{
                fontSize: '10px', color: 'rgba(255,255,255,0.55)',
                textAlign: 'center', marginTop: '3px',
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {subtitulo}
              </div>
            )}

            {cidade && (
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '3px' }}>
                📍 {cidade}
              </div>
            )}
          </div>

          {/* Links principais */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '8px' }}>
            {linksPrincipais.slice(0, 5).map((link, i) => (
              <div
                key={link.id ?? i}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '9px 12px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                }}
              >
                <span style={{
                  width: '26px', height: '26px',
                  borderRadius: '8px',
                  background: `${cor}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', flexShrink: 0,
                }}>
                  {link.emoji}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 500, flex: 1, color: '#fff' }}>
                  {link.titulo}
                </span>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>›</span>
              </div>
            ))}

            {linksPrincipais.length === 0 && (
              <div style={{
                padding: '12px', textAlign: 'center',
                color: 'rgba(255,255,255,0.25)', fontSize: '10px',
                border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px',
              }}>
                Seus links aparecem aqui
              </div>
            )}
          </div>

          {/* Links sociais */}
          {linksSociais.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '8px' }}>
              {linksSociais.slice(0, 4).map((link, i) => (
                <div
                  key={link.id ?? i}
                  style={{
                    width: '32px', height: '32px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px',
                  }}
                >
                  {link.emoji}
                </div>
              ))}
            </div>
          )}

          {/* Rodapé */}
          {plano === 'free' && (
            <div style={{
              textAlign: 'center', fontSize: '9px',
              color: 'rgba(255,255,255,0.2)',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              ⬡ Criado com LinKey
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function profissaoEmoji(p: string): string {
  const m: Record<string, string> = {
    musico: '🎵', tatuador: '🎨', cabeleireiro: '💇',
    corretor: '🏠', personal: '💪', fotografo: '📸', outro: '⭐',
  }
  return m[p] ?? '⭐'
}
