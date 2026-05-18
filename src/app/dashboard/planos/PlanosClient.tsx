'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Subscription {
  plano:             string
  status:            string
  proximo_pagamento: string | null
}

interface Props {
  planoAtual:   string
  subscription: Subscription | null
  temStripe:    boolean
}

const PLANOS = [
  {
    id:      'free',
    nome:    'Free',
    preco:   { mensal: 0, anual: 0 },
    cor:     '',
    popular: false,
    features: [
      { ok: true,  texto: '5 links' },
      { ok: true,  texto: 'Página pública' },
      { ok: true,  texto: 'Analytics 7 dias' },
      { ok: true,  texto: 'QR Code' },
      { ok: false, texto: 'Marca LinKey visível' },
      { ok: false, texto: 'Pix nativo' },
      { ok: false, texto: 'Domínio próprio' },
    ],
  },
  {
    id:      'pro',
    nome:    'Pro',
    preco:   { mensal: 19, anual: +(19 * 12 * 0.80).toFixed(2) },
    cor:     '#7C6FFF',
    popular: true,
    features: [
      { ok: true, texto: 'Links ilimitados' },
      { ok: true, texto: 'Analytics 90 dias' },
      { ok: true, texto: 'Sem marca LinKey' },
      { ok: true, texto: 'Botão Pix nativo' },
      { ok: true, texto: 'QR Code personalizado' },
      { ok: true, texto: 'Domínio próprio' },
      { ok: true, texto: 'Ficha de time / jogador amador' },
      { ok: true, texto: 'Suporte via WhatsApp' },
    ],
  },
  {
    id:      'allstar',
    nome:    'All-Star ⭐',
    preco:   { mensal: 99.99, anual: +(99.99 * 12 * 0.85).toFixed(2) },
    cor:     '#FFD700',
    popular: false,
    features: [
      { ok: true, texto: 'Tudo do Pro' },
      { ok: true, texto: 'Ficha profissional por categoria' },
      { ok: true, texto: 'Time com títulos e elenco completo' },
      { ok: true, texto: 'Selo verificado ⭐' },
      { ok: true, texto: 'Analytics 1 ano completo' },
      { ok: true, texto: 'Relatórios exportáveis' },
      { ok: true, texto: 'Suporte dedicado' },
    ],
  },
]

export default function PlanosClient({ planoAtual, subscription, temStripe }: Props) {
  const [periodo, setPeriodo]     = useState<'mensal' | 'anual'>('mensal')
  const [loading, setLoading]     = useState<string | null>(null)
  const [erro, setErro]           = useState('')

  // ── Iniciar checkout ──────────────────────────────
  async function handleAssinar(planoId: string) {
    if (planoId === 'free') return
    setLoading(planoId)
    setErro('')

    try {
      const res = await fetch('/api/stripe/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ plano: planoId, periodo }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        setErro(data.error ?? 'Erro ao iniciar pagamento. Tente novamente.')
        setLoading(null)
        return
      }

      window.location.href = data.url
    } catch {
      setErro('Erro de conexão. Tente novamente.')
      setLoading(null)
    }
  }

  // ── Abrir portal do cliente ───────────────────────
  async function handlePortal() {
    setLoading('portal')
    setErro('')

    try {
      const res  = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()

      if (!res.ok || !data.url) {
        setErro('Erro ao abrir portal. Tente novamente.')
        setLoading(null)
        return
      }

      window.location.href = data.url
    } catch {
      setErro('Erro de conexão. Tente novamente.')
      setLoading(null)
    }
  }

  const economiaAnual = 20

  return (
    <div>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '4px' }}>
          Planos
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
          Plano atual: <strong style={{ color: '#fff' }}>{planoAtual.toUpperCase()}</strong>
          {subscription?.proximo_pagamento && (
            <> · Próxima cobrança:{' '}
              <strong style={{ color: '#fff' }}>
                {new Date(subscription.proximo_pagamento).toLocaleDateString('pt-BR')}
              </strong>
            </>
          )}
        </p>
      </div>

      {/* Status da assinatura */}
      {subscription && planoAtual !== 'free' && (
        <div style={{
          padding: '16px 20px',
          background: subscription.status === 'active'
            ? 'rgba(111,255,150,0.08)'
            : 'rgba(255,200,80,0.08)',
          border: `1px solid ${subscription.status === 'active'
            ? 'rgba(111,255,150,0.2)'
            : 'rgba(255,200,80,0.2)'}`,
          borderRadius: '14px',
          marginBottom: '24px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>
              {subscription.status === 'active' ? '✅' : '⚠️'}
            </span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>
                {subscription.status === 'active'
                  ? `Plano ${planoAtual.toUpperCase()} ativo`
                  : 'Pagamento pendente'}
              </div>
              {subscription.proximo_pagamento && (
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  {subscription.status === 'active' ? 'Renova em ' : 'Vence em '}
                  {new Date(subscription.proximo_pagamento).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handlePortal}
            disabled={loading === 'portal'}
            style={{
              padding: '8px 18px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '100px',
              color: '#fff', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
              whiteSpace: 'nowrap', flexShrink: 0,
              opacity: loading === 'portal' ? 0.7 : 1,
            }}
          >
            {loading === 'portal' ? '⏳' : '⚙️ Gerenciar assinatura'}
          </button>
        </div>
      )}

      {/* Toggle mensal / anual */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        marginBottom: '32px',
      }}>
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '100px',
          padding: '4px',
          gap: '4px',
        }}>
          {(['mensal', 'anual'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              style={{
                padding: '8px 20px',
                borderRadius: '100px',
                border: 'none',
                background: periodo === p
                  ? 'rgba(255,255,255,0.12)'
                  : 'transparent',
                color: periodo === p ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: '14px', fontWeight: periodo === p ? 600 : 400,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              {p === 'mensal' ? 'Mensal' : (
                <>
                  Anual
                  <span style={{
                    padding: '2px 7px',
                    background: 'rgba(111,255,150,0.2)',
                    border: '1px solid rgba(111,255,150,0.3)',
                    borderRadius: '100px',
                    fontSize: '10px', fontWeight: 700,
                    color: '#6fff96',
                  }}>
                    -{economiaAnual}%
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de planos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {PLANOS.map(plano => {
          const ehAtual   = planoAtual === plano.id
          const ehUpgrade = ['free','pro'].indexOf(planoAtual) < ['free','pro','allstar'].indexOf(plano.id)

          return (
            <div
              key={plano.id}
              className="animate-fade-up"
              style={{
                padding: '28px 24px',
                background: plano.popular
                  ? `rgba(124,111,255,0.1)`
                  : 'rgba(255,255,255,0.06)',
                border: `1px solid ${plano.popular
                  ? 'rgba(124,111,255,0.35)'
                  : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '20px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: plano.popular
                  ? '0 0 0 1px rgba(124,111,255,0.15), 0 20px 60px rgba(124,111,255,0.15)'
                  : 'none',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Badge popular */}
              {plano.popular && (
                <div style={{
                  position: 'absolute', top: 0, left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg,#7C6FFF,#9c6fff)',
                  fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                  padding: '5px 16px',
                  borderRadius: '0 0 10px 10px',
                  color: '#fff',
                }}>
                  MAIS POPULAR
                </div>
              )}

              <div style={{ marginTop: plano.popular ? '16px' : '0' }}>

                {/* Nome */}
                <div style={{
                  fontSize: '12px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: plano.cor || 'rgba(255,255,255,0.5)',
                  marginBottom: '12px',
                }}>
                  {plano.nome}
                </div>

                {/* Preço */}
                <div style={{ marginBottom: '4px' }}>
                  {periodo === 'anual' && plano.preco.mensal > 0 && (
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through', marginBottom: '2px' }}>
                      R${plano.preco.mensal}/mês
                    </div>
                  )}
                  <span style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1.5px' }}>
                    {plano.preco.mensal === 0 ? 'Grátis' : periodo === 'anual'
                      ? `R$${(plano.preco.anual / 12).toFixed(2)}`
                      : `R$${plano.preco.mensal}`}
                  </span>
                  {plano.preco.mensal > 0 && (
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}>
                      /mês
                    </span>
                  )}
                </div>

                {periodo === 'anual' && plano.preco.anual > 0 && (
                  <div style={{ fontSize: '12px', color: 'rgba(111,255,150,0.7)', marginBottom: '20px' }}>
                    cobrado R${plano.preco.anual.toFixed(2)}/ano · 20% off
                  </div>
                )}

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '20px 0' }} />

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {plano.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '14px',
                        color: f.ok ? '#6fff96' : 'rgba(255,255,255,0.25)',
                      }}>
                        {f.ok ? '✓' : '⊘'}
                      </span>
                      <span style={{
                        fontSize: '13px',
                        color: f.ok ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.35)',
                      }}>
                        {f.texto}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Botão CTA */}
                {plano.id === 'free' ? (
                  <button
                    disabled
                    style={{
                      width: '100%', padding: '12px',
                      background: ehAtual
                        ? 'rgba(111,255,150,0.1)'
                        : 'rgba(255,255,255,0.07)',
                      border: ehAtual
                        ? '1px solid rgba(111,255,150,0.25)'
                        : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: ehAtual ? '#6fff96' : 'rgba(255,255,255,0.4)',
                      fontSize: '14px', fontWeight: 600,
                      cursor: 'default', fontFamily: 'inherit',
                    }}
                  >
                    {ehAtual ? '✓ Plano atual' : 'Grátis para sempre'}
                  </button>
                ) : (
                  <button
                    onClick={() => ehAtual ? handlePortal() : handleAssinar(plano.id)}
                    disabled={!!loading}
                    style={{
                      width: '100%', padding: '12px',
                      background: ehAtual
                        ? 'rgba(111,255,150,0.1)'
                        : `linear-gradient(135deg,${plano.cor || '#7C6FFF'},${plano.cor ? plano.cor + 'aa' : '#9c6fff'})`,
                      border: ehAtual
                        ? '1px solid rgba(111,255,150,0.25)'
                        : 'none',
                      borderRadius: '12px',
                      color: ehAtual ? '#6fff96' : '#fff',
                      fontSize: '14px', fontWeight: 600,
                      cursor: loading ? 'wait' : 'pointer',
                      fontFamily: 'inherit',
                      opacity: loading && loading !== plano.id ? 0.6 : 1,
                      boxShadow: !ehAtual
                        ? `0 4px 20px ${plano.cor || '#7C6FFF'}44`
                        : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {loading === plano.id
                      ? '⏳ Redirecionando...'
                      : ehAtual
                        ? '⚙️ Gerenciar'
                        : ehUpgrade
                          ? `Assinar ${plano.nome} →`
                          : `Mudar para ${plano.nome}`
                    }
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Erro */}
      {erro && (
        <div style={{
          padding: '14px 18px',
          background: 'rgba(255,111,111,0.12)',
          border: '1px solid rgba(255,111,111,0.25)',
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: '13px', color: '#ff9696',
          textAlign: 'center',
        }}>
          ⚠️ {erro}
        </div>
      )}

      {/* Garantias */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        gap: '32px', flexWrap: 'wrap',
        fontSize: '13px', color: 'rgba(255,255,255,0.35)',
      }}>
        <span>🔒 Pagamento seguro via Stripe</span>
        <span>↩️ Cancele a qualquer momento</span>
        <span>💳 Sem cobrança surpresa</span>
      </div>
    </div>
  )
}
