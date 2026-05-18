'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface Props {
  username:    string
  titulo:      string
  fotoUrl:     string | null
  corDestaque: string
  plano:       string
}

const BASE_URL = 'https://linkey.app'

// Gera QR Code via API pública — sem dependência de npm
// Free: preto/branco simples
// Pro/AllStar: cor de destaque + logo central
function qrUrl(text: string, cor: string, isPro: boolean) {
  const color   = cor.replace('#', '')
  const fgColor = isPro ? color : '000000'
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}&color=${fgColor}&bgcolor=ffffff&qzone=2&format=png`
}

export default function QRCodeClient({ username, titulo, fotoUrl, corDestaque, plano }: Props) {
  const isPro     = ['pro', 'allstar'].includes(plano)
  const url       = `${BASE_URL}/${username}`
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrSrc,   setQrSrc]   = useState('')
  const [copiado, setCopiado] = useState(false)
  const [corQR,   setCorQR]   = useState(corDestaque)
  const [tamanho, setTamanho] = useState(300)
  const [carregando, setCarregando] = useState(true)

  // Gera QR usando API qrserver
  useEffect(() => {
    setCarregando(true)
    const src = qrUrl(url, isPro ? corQR : '#000000', isPro)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // Desenha no canvas para permitir download
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width  = tamanho
      canvas.height = tamanho
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, tamanho, tamanho)
      ctx.drawImage(img, 0, 0, tamanho, tamanho)

      // Pro: coloca logo da foto no centro
      if (isPro && fotoUrl) {
        const logo = new Image()
        logo.crossOrigin = 'anonymous'
        logo.onload = () => {
          const logoSize = tamanho * 0.2
          const logoX    = (tamanho - logoSize) / 2
          const logoY    = (tamanho - logoSize) / 2
          // Fundo branco circularde trás do logo
          ctx.beginPath()
          ctx.arc(tamanho / 2, tamanho / 2, logoSize / 2 + 6, 0, Math.PI * 2)
          ctx.fillStyle = '#ffffff'
          ctx.fill()
          // Logo circular
          ctx.save()
          ctx.beginPath()
          ctx.arc(tamanho / 2, tamanho / 2, logoSize / 2, 0, Math.PI * 2)
          ctx.clip()
          ctx.drawImage(logo, logoX, logoY, logoSize, logoSize)
          ctx.restore()
          setQrSrc(canvas.toDataURL('image/png'))
          setCarregando(false)
        }
        logo.onerror = () => {
          setQrSrc(canvas.toDataURL('image/png'))
          setCarregando(false)
        }
        logo.src = fotoUrl
      } else {
        setQrSrc(canvas.toDataURL('image/png'))
        setCarregando(false)
      }
    }
    img.onerror = () => setCarregando(false)
    img.src = src
  }, [url, corQR, tamanho, isPro, fotoUrl])

  function handleDownload() {
    if (!qrSrc) return
    const a = document.createElement('a')
    a.href     = qrSrc
    a.download = `linkey-qr-${username}.png`
    a.click()
  }

  function handleCopiar() {
    navigator.clipboard?.writeText(url).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    })
  }

  const cor = corDestaque ?? '#7C6FFF'

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '4px' }}>
          QR Code
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
          Compartilhe sua página com um QR Code
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* Preview do QR */}
        <div style={{
          padding: '32px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}>
          {/* QR */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '16px',
            boxShadow: isPro ? `0 0 40px ${cor}40` : '0 8px 32px rgba(0,0,0,0.3)',
            border: isPro ? `2px solid ${cor}30` : '2px solid rgba(255,255,255,0.1)',
            position: 'relative',
            transition: 'all 0.3s',
          }}>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {carregando ? (
              <div style={{
                width: '240px', height: '240px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#f8f8f8', borderRadius: '12px',
              }}>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>Gerando QR...</div>
              </div>
            ) : qrSrc ? (
              <img
                src={qrSrc}
                alt={`QR Code para ${url}`}
                style={{ width: '240px', height: '240px', display: 'block', borderRadius: '8px' }}
              />
            ) : (
              <div style={{ width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', borderRadius: '12px' }}>
                <span style={{ fontSize: '13px', color: '#ef4444' }}>Erro ao gerar QR</span>
              </div>
            )}

            {/* Badge plano */}
            {isPro && (
              <div style={{
                position: 'absolute', top: '-10px', right: '-10px',
                background: plano === 'allstar' ? '#F59E0B' : '#7C6FFF',
                color: '#fff', fontSize: '9px', fontWeight: 800,
                padding: '3px 8px', borderRadius: '100px',
                letterSpacing: '0.06em',
              }}>
                {plano === 'allstar' ? '★ ALL-STAR' : 'PRO'}
              </div>
            )}
          </div>

          {/* URL */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 16px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '100px',
            width: '100%',
          }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {url}
            </span>
            <button
              onClick={handleCopiar}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: copiado ? '#6fff96' : cor,
                fontSize: '12px', fontWeight: 600, fontFamily: 'inherit',
                flexShrink: 0, padding: '0 4px',
              }}
            >
              {copiado ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>

          {/* Botão download */}
          <button
            onClick={handleDownload}
            disabled={carregando || !qrSrc}
            style={{
              width: '100%', padding: '14px',
              background: isPro
                ? `linear-gradient(135deg, ${cor}, ${cor}aa)`
                : 'rgba(255,255,255,0.1)',
              border: 'none', borderRadius: '14px',
              color: '#fff', fontSize: '14px', fontWeight: 600,
              cursor: carregando ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              boxShadow: isPro ? `0 4px 20px ${cor}40` : 'none',
              opacity: carregando ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            ⬇️ Baixar QR Code (PNG)
          </button>
        </div>

        {/* Configurações */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Personalização Pro */}
          <div style={{
            padding: '20px',
            background: isPro ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
            border: isPro ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            opacity: isPro ? 1 : 0.7,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>Personalização</div>
              {!isPro && (
                <span style={{
                  fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                  background: 'rgba(124,111,255,0.2)', color: '#b4aeff',
                  borderRadius: '100px', letterSpacing: '0.04em',
                }}>PRO</span>
              )}
            </div>

            {/* Cor */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px' }}>
                Cor do QR Code
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[corDestaque, '#7C6FFF', '#FF6FBD', '#6FFFE9', '#FFD580', '#6FFF96', '#FF6F6F', '#000000'].map(c => (
                  <button
                    key={c}
                    onClick={() => isPro && setCorQR(c)}
                    title={c}
                    style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: c, border: corQR === c ? '3px solid #fff' : '2px solid transparent',
                      cursor: isPro ? 'pointer' : 'not-allowed',
                      outline: corQR === c ? `2px solid ${c}` : 'none',
                      outlineOffset: '2px',
                      transition: 'all 0.2s',
                      filter: !isPro ? 'grayscale(0.7)' : 'none',
                    }}
                  />
                ))}
                {/* Input de cor personalizada */}
                {isPro && (
                  <input
                    type="color"
                    value={corQR}
                    onChange={e => setCorQR(e.target.value)}
                    style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer', padding: 0, background: 'none',
                    }}
                    title="Cor personalizada"
                  />
                )}
              </div>
            </div>

            {/* Tamanho */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px' }}>
                Tamanho: {tamanho}×{tamanho}px
              </label>
              <input
                type="range"
                min="200" max="600" step="50"
                value={tamanho}
                onChange={e => isPro && setTamanho(Number(e.target.value))}
                disabled={!isPro}
                style={{ width: '100%', cursor: isPro ? 'pointer' : 'not-allowed' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                <span>200px</span><span>600px</span>
              </div>
            </div>

            {/* Logo central — só Pro */}
            <div>
              <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px' }}>
                Logo central
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
              }}>
                {fotoUrl ? (
                  <img src={fotoUrl} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>?</div>
                )}
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  {isPro
                    ? fotoUrl ? 'Sua foto de perfil' : 'Adicione foto no editor'
                    : 'Exclusivo plano Pro'
                  }
                </span>
              </div>
            </div>

            {!isPro && (
              <Link
                href="/dashboard/planos"
                style={{
                  display: 'block', marginTop: '16px',
                  padding: '11px', borderRadius: '12px',
                  background: 'rgba(124,111,255,0.15)',
                  border: '1px solid rgba(124,111,255,0.25)',
                  color: '#b4aeff', fontSize: '13px', fontWeight: 600,
                  textAlign: 'center', textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                Desbloquear personalização → Pro
              </Link>
            )}
          </div>

          {/* Como usar */}
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '14px' }}>Como usar</div>
            {[
              { emoji: '🖨️', titulo: 'Imprimir', desc: 'Coloque em cartão de visita, flyer ou banner' },
              { emoji: '📱', titulo: 'Digital',  desc: 'Use em stories, bio ou apresentações' },
              { emoji: '🏪', titulo: 'Vitrine',  desc: 'Cole no balcão ou cardápio do seu negócio' },
            ].map(item => (
              <div key={item.titulo} style={{
                display: 'flex', gap: '12px',
                padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.emoji}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{item.titulo}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparativo planos */}
          <div style={{
            padding: '16px 20px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
          }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              QR Code por plano
            </div>
            {[
              { plano: 'Free',     feats: ['QR Code básico P&B', 'Download PNG 300px'], cor: '#64748B' },
              { plano: 'Pro',      feats: ['Cor personalizada', 'Logo central', 'Até 600px', 'Download PNG'], cor: '#7C6FFF' },
              { plano: 'All-Star', feats: ['Tudo do Pro', 'Cor dourada padrão', 'Selo verificado'], cor: '#F59E0B' },
            ].map(row => (
              <div key={row.plano} style={{
                display: 'flex', gap: '12px',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                opacity: plano === row.plano.toLowerCase() || (plano === 'allstar' && row.plano === 'All-Star') ? 1 : 0.45,
              }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: row.cor, flexShrink: 0, marginTop: '5px',
                }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: row.cor, marginBottom: '3px' }}>{row.plano}</div>
                  {row.feats.map(f => (
                    <div key={f} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>· {f}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
