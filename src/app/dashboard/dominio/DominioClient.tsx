'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Props {
  plano:        string
  dominioAtual: string | null
  verificado:   boolean
}

const isPago = (plano: string) => ['pro', 'allstar'].includes(plano)

export default function DominioClient({ plano, dominioAtual, verificado }: Props) {
  const supabase = createClient()
  const [dominio,     setDominio]     = useState(dominioAtual ?? '')
  const [salvando,    setSalvando]    = useState(false)
  const [verificando, setVerificando] = useState(false)
  const [erro,        setErro]        = useState('')
  const [sucesso,     setSucesso]     = useState('')
  const [statusVerif, setStatusVerif] = useState<'idle'|'ok'|'pendente'>(
    verificado ? 'ok' : dominioAtual ? 'pendente' : 'idle'
  )

  const cor = plano === 'allstar' ? '#F59E0B' : '#7C6FFF'

  // ── Salvar domínio ─────────────────────────────────────────────
  async function handleSalvar() {
    setErro('')
    setSucesso('')

    const dom = dominio.trim().toLowerCase()
      .replace(/^https?:\/\//,'')   // remove protocolo se colou
      .replace(/\/.*$/,'')           // remove path
      .replace(/^www\./,'')          // remove www

    if (!dom) { setErro('Digite um domínio válido.'); return }
    if (!/^[a-z0-9][a-z0-9\-\.]+\.[a-z]{2,}$/.test(dom)) {
      setErro('Formato inválido. Ex: meusite.com.br'); return
    }
    if (dom.includes('linkey.cloud')) {
      setErro('Não é possível usar o domínio do LinKey.'); return
    }

    setSalvando(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setErro('Sessão expirada.'); return }

      const { error } = await supabase
        .from('dominios_personalizados')
        .upsert(
          { user_id: user.id, dominio: dom, verificado: false },
          { onConflict: 'user_id' }
        )

      if (error) {
        if (error.code === '23505') {
          setErro('Esse domínio já está sendo usado por outra conta.')
        } else {
          setErro('Erro ao salvar. Tente novamente.')
        }
        return
      }

      setDominio(dom)
      setStatusVerif('pendente')
      setSucesso('Domínio salvo! Agora configure o DNS e clique em "Verificar".')
    } finally {
      setSalvando(false)
    }
  }

  // ── Verificar DNS + adicionar na Vercel via API Route ──────────
  async function handleVerificar() {
    setErro('')
    setSucesso('')
    setVerificando(true)

    try {
      const res  = await fetch('/api/dominio/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dominio }),
      })
      const data = await res.json()

      if (data.ok) {
        setStatusVerif('ok')
        setSucesso('✅ Domínio verificado e ativo! Pode levar até 24h para propagar.')
      } else {
        setStatusVerif('pendente')
        setErro(data.message ?? 'DNS ainda não propagou. Aguarde e tente novamente.')
      }
    } catch {
      setErro('Erro ao verificar. Tente novamente.')
    } finally {
      setVerificando(false)
    }
  }

  // ── Remover domínio ────────────────────────────────────────────
  async function handleRemover() {
    if (!confirm('Remover domínio personalizado?')) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('dominios_personalizados')
      .delete()
      .eq('user_id', user.id)

    setDominio('')
    setStatusVerif('idle')
    setSucesso('Domínio removido.')
  }

  // ── Render: bloqueado para Free ────────────────────────────────
  if (!isPago(plano)) {
    return (
      <div>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '4px' }}>
            Domínio Próprio
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
            Use seu próprio domínio na sua página LinKey
          </p>
        </div>

        <div style={{
          padding: '40px 32px', textAlign: 'center',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🌐</div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
            Disponível no Pro e All-Star
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            Conecte <strong style={{ color: '#fff' }}>seu próprio domínio</strong> e sua página ficará em
            <strong style={{ color: '#fff' }}> meusite.com.br</strong> ao invés de linkey.cloud/seunome.
          </p>
          <Link href="/dashboard/planos" style={{
            display: 'inline-block', padding: '14px 32px',
            background: 'linear-gradient(135deg,#7C6FFF,#9c6fff)',
            borderRadius: '100px', color: '#fff',
            textDecoration: 'none', fontWeight: 600, fontSize: '14px',
            boxShadow: '0 4px 20px rgba(124,111,255,0.4)',
          }}>
            Fazer upgrade → Pro
          </Link>
        </div>
      </div>
    )
  }

  // ── Render: plano pago ─────────────────────────────────────────
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '4px' }}>
          Domínio Próprio
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
          Sua página no seu domínio — grátis, sem custo adicional
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* Coluna esquerda: formulário */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Status atual */}
          {statusVerif !== 'idle' && (
            <div style={{
              padding: '14px 18px',
              background: statusVerif === 'ok'
                ? 'rgba(111,255,150,0.08)'
                : 'rgba(255,215,0,0.08)',
              border: `1px solid ${statusVerif === 'ok' ? 'rgba(111,255,150,0.2)' : 'rgba(255,215,0,0.2)'}`,
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <span style={{ fontSize: '20px' }}>
                {statusVerif === 'ok' ? '✅' : '⏳'}
              </span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>
                  {statusVerif === 'ok' ? 'Domínio ativo' : 'Aguardando verificação'}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  {dominio}
                </div>
              </div>
              {statusVerif !== 'idle' && (
                <button
                  onClick={handleRemover}
                  style={{
                    marginLeft: 'auto', background: 'none', border: 'none',
                    color: 'rgba(255,100,100,0.6)', cursor: 'pointer',
                    fontSize: '12px', fontFamily: 'inherit',
                  }}
                >
                  Remover
                </button>
              )}
            </div>
          )}

          {/* Input domínio */}
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '20px',
          }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
              Seu domínio
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={dominio}
                onChange={e => setDominio(e.target.value)}
                placeholder="meusite.com.br"
                style={{
                  flex: 1, padding: '12px 16px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', color: '#fff',
                  fontSize: '14px', fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSalvar}
                disabled={salvando || !dominio.trim()}
                style={{
                  padding: '12px 20px',
                  background: `linear-gradient(135deg, ${cor}, ${cor}aa)`,
                  border: 'none', borderRadius: '12px',
                  color: '#fff', fontSize: '13px', fontWeight: 600,
                  cursor: salvando ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', flexShrink: 0,
                  opacity: salvando ? 0.7 : 1,
                  boxShadow: `0 4px 16px ${cor}40`,
                }}
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '8px' }}>
              Sem https:// e sem www. Ex: meusite.com.br ou sub.meusite.com
            </p>
          </div>

          {/* Erros e sucesso */}
          {erro && (
            <div style={{ padding: '12px 16px', background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.2)', borderRadius: '12px', fontSize: '13px', color: '#ff9696' }}>
              ⚠️ {erro}
            </div>
          )}
          {sucesso && (
            <div style={{ padding: '12px 16px', background: 'rgba(111,255,150,0.08)', border: '1px solid rgba(111,255,150,0.2)', borderRadius: '12px', fontSize: '13px', color: '#6fff96' }}>
              {sucesso}
            </div>
          )}

          {/* Botão verificar */}
          {statusVerif === 'pendente' && (
            <button
              onClick={handleVerificar}
              disabled={verificando}
              style={{
                width: '100%', padding: '14px',
                background: 'rgba(255,255,255,0.07)',
                border: `1px solid ${cor}40`,
                borderRadius: '14px', color: '#fff',
                fontSize: '14px', fontWeight: 600,
                cursor: verificando ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                opacity: verificando ? 0.7 : 1,
              }}
            >
              {verificando ? '🔍 Verificando DNS...' : '🔍 Verificar configuração'}
            </button>
          )}
        </div>

        {/* Coluna direita: instruções */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Passo a passo */}
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
              Como configurar — 3 passos
            </div>

            {[
              {
                n: '1', titulo: 'Cadastre seu domínio acima',
                desc: 'Digite o domínio que você quer usar (sem www) e clique em Salvar.',
              },
              {
                n: '2', titulo: 'Configure o CNAME no seu provedor',
                desc: 'Entre no painel onde comprou o domínio (GoDaddy, Registro.br, Hostinger, etc) e adicione:',
                code: true,
              },
              {
                n: '3', titulo: 'Clique em Verificar',
                desc: 'Após salvar o DNS, volte aqui e clique em Verificar. Pode levar de 5 minutos a 24 horas para propagar.',
              },
            ].map((passo, i) => (
              <div key={i} style={{
                display: 'flex', gap: '14px',
                paddingBottom: i < 2 ? '16px' : 0,
                marginBottom: i < 2 ? '16px' : 0,
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: `${cor}20`, border: `1px solid ${cor}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 800, color: cor,
                }}>
                  {passo.n}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{passo.titulo}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{passo.desc}</div>
                  {passo.code && (
                    <div style={{
                      marginTop: '10px',
                      background: '#0a0a14',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                    }}>
                      {/* Cabeçalho da tabela */}
                      <div style={{
                        display: 'grid', gridTemplateColumns: '80px 80px 1fr',
                        padding: '8px 12px',
                        background: 'rgba(255,255,255,0.04)',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        fontSize: '10px', fontWeight: 700,
                        color: 'rgba(255,255,255,0.3)',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>
                        <span>Tipo</span>
                        <span>Nome</span>
                        <span>Valor</span>
                      </div>
                      {/* Linha de dados */}
                      <div style={{
                        display: 'grid', gridTemplateColumns: '80px 80px 1fr',
                        padding: '10px 12px', gap: '4px',
                        fontFamily: 'monospace', fontSize: '12px',
                      }}>
                        <span style={{ color: cor, fontWeight: 700 }}>CNAME</span>
                        <span style={{ color: '#94a3b8' }}>@</span>
                        <span style={{ color: '#6fff96', wordBreak: 'break-all' }}>cname.vercel-dns.com</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Provedores com link direto */}
          <div style={{
            padding: '18px 20px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '18px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', color: 'rgba(255,255,255,0.6)' }}>
              Links de ajuda por provedor
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { nome: 'Registro.br',  url: 'https://registro.br/ajuda/dns/' },
                { nome: 'GoDaddy',      url: 'https://br.godaddy.com/help/adicionar-um-registro-cname-19236' },
                { nome: 'Hostinger',    url: 'https://support.hostinger.com/pt-BR/articles/1583227' },
                { nome: 'Cloudflare',   url: 'https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/' },
                { nome: 'Namecheap',    url: 'https://www.namecheap.com/support/knowledgebase/article.aspx/9646/' },
              ].map(p => (
                <a
                  key={p.nome}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    textDecoration: 'none', color: 'rgba(255,255,255,0.7)',
                    fontSize: '12px',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = `${cor}10`
                    e.currentTarget.style.borderColor = `${cor}30`
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                  }}
                >
                  {p.nome}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Dúvidas */}
          <div style={{
            padding: '14px 18px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            fontSize: '12px', color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.6,
          }}>
            💡 <strong style={{ color: 'rgba(255,255,255,0.6)' }}>SSL automático:</strong> o certificado HTTPS é gerado automaticamente pela Vercel, sem custo extra. Seu domínio ficará seguro em minutos após a verificação.
          </div>
        </div>
      </div>
    </div>
  )
}
