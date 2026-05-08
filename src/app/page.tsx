'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LinKeyLogo } from '@/components/blocks/LinKeyLogo'

function IconMusic()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> }
function IconInk()      { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C6.5 22 2 17.5 2 12c0-5.2 4.5-9 10-9 1 0 2 .1 3 .4"/><path d="M20 4l-8 8"/><path d="M20 4v4l-2-2-2 2V4"/></svg> }
function IconScissors() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg> }
function IconHome()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> }
function IconDumbbell() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M4 9.5v5"/><path d="M20 9.5v5"/><path d="M2 7.5v9"/><path d="M22 7.5v9"/></svg> }
function IconCamera()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> }
function IconZap()      { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> }
function IconLayers()   { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> }
function IconChart()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function IconPix()      { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> }
function IconLink()     { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> }
function IconGlobe()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> }
function IconCopy()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> }
function IconCheck()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }

const NICHOS = [
  { icon: <IconMusic />,    label: 'Músicos',    cor: '#8B5CF6' },
  { icon: <IconInk />,      label: 'Tatuadores', cor: '#A78BFA' },
  { icon: <IconScissors />, label: 'Estética',   cor: '#F472B6' },
  { icon: <IconHome />,     label: 'Corretores', cor: '#22D3EE' },
  { icon: <IconDumbbell />, label: 'Personais',  cor: '#34D399' },
  { icon: <IconCamera />,   label: 'Fotógrafos', cor: '#FBBF24' },
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFD700"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, label: 'All-Stars', cor: '#FFD700' },
]

const FEATURES = [
  { icon: <IconZap />,    titulo: 'Pronto em 3 minutos',    desc: 'Cadastre, escolha seu nicho e compartilhe. Sem precisar de site ou designer.' },
  { icon: <IconLayers />, titulo: 'Feito pro seu trabalho', desc: 'Cada nicho tem seu próprio layout, cores e seções. Tatuador não precisa do mesmo link que corretor.' },
  { icon: <IconChart />,  titulo: 'Veja quem clicou',       desc: 'Analytics em tempo real: visitas, origens e cliques. Dados que importam para crescer.' },
  { icon: <IconPix />,    titulo: 'Botão de pagamento',     desc: 'Seu visitante paga direto na sua página. Sem redirecionamento, sem atrito.' },
  { icon: <IconLink />,   titulo: 'Um link pra tudo',       desc: 'WhatsApp, Instagram, portfólio, Spotify — tudo em um único link profissional.' },
  { icon: <IconGlobe />,  titulo: 'Sua identidade online',  desc: 'Personalize cores, foto e estilo. Sua página, do seu jeito, com o seu domínio.' },
]

const DEPOIMENTOS = [
  { nome: 'Rafael Ink',  nicho: 'Tatuador · São Paulo',      texto: 'Antes jogava o link do Instagram e perdia cliente. Agora coloco o LinKey e eles já saem agendando.',  iniciais: 'RI', cor: '#8B5CF6' },
  { nome: 'Ana Lima',    nicho: 'Cantora · Belo Horizonte',  texto: 'Em uma semana de divulgação, recebi 3 propostas de show pelo link. Incrível como é simples.',           iniciais: 'AL', cor: '#F472B6' },
  { nome: 'Carlos Melo', nicho: 'Corretor · Rio de Janeiro', texto: 'Agora meu link tem tudo: WhatsApp, portfólio de imóveis e simulador. Profissional de verdade.',         iniciais: 'CM', cor: '#22D3EE' },
]

const PERGUNTAS = [
  { p: 'É realmente grátis?',                      r: 'Sim. O plano Free é grátis para sempre, sem cartão de crédito. Você cria sua página agora.' },
  { p: 'Qual a diferença do LinKey pro Linktree?', r: 'O LinKey é focado em criadores e profissionais, com templates por nicho, botão de pagamento nativo e suporte humano próximo.' },
  { p: 'Posso cancelar quando quiser?',             r: 'Sim. Sem fidelidade. Cancele direto pelo painel em qualquer momento. Sem letras miúdas.' },
  { p: 'Precisa saber programar?',                  r: 'Não. Você preenche um formulário, escolhe as cores e compartilha. Leva menos de 3 minutos.' },
]

const PLANOS = [
  {
    nome: 'Free', precoMensal: 0, periodo: 'para sempre',
    descricao: 'Para começar e testar', cor: '#64748B', destaque: false,
    itens: ['1 página personalizada', 'Até 5 links', 'Analytics básico', 'Domínio linkey.cloud/seulink', 'Suporte por email'],
    cta: 'Criar grátis', href: '/auth/cadastro',
  },
  {
    nome: 'Pro', precoMensal: 19, periodo: '/mês',
    descricao: 'Para quem quer crescer de verdade', cor: '#8B5CF6', destaque: true, badge: 'Mais popular',
    itens: ['Links ilimitados', 'Analytics completo + origens', 'Botão de pagamento nativo', 'Templates por nicho', 'Remover marca LinKey', 'Suporte prioritário'],
    cta: 'Assinar Pro', href: '/auth/cadastro?plano=pro',
  },
  {
    nome: 'All-Star', precoMensal: 99.99, periodo: '/mês',
    descricao: 'Para atletas, artistas e marcas de alto impacto', cor: '#FFD700', destaque: false, badge: 'Exclusivo',
    itens: ['Tudo do Pro', 'Ficha personalizada por categoria', 'Selo de verificado', 'Upload de escudo / logo', 'Domínio personalizado', 'Relatórios exportáveis', 'Verificação por link público', 'Suporte dedicado'],
    cta: 'Quero ser All-Star', href: '/auth/cadastro?plano=allstar',
  },
]

export default function LandingPage() {
  const [nichoAtivo, setNichoAtivo] = useState(0)
  const [faqAberto, setFaqAberto]   = useState<number | null>(null)
  const [copiado, setCopiado]       = useState(false)
  const [periodo, setPeriodo]       = useState<'mensal' | 'anual'>('mensal')

  useEffect(() => {
    const t = setInterval(() => setNichoAtivo(i => (i + 1) % NICHOS.length), 2500)
    return () => clearInterval(t)
  }, [])

  function copiarLink() {
    navigator.clipboard?.writeText('linkey.cloud/seulink')
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const nicho = NICHOS[nichoAtivo]

  return (
    <>
      {/* Fundo animado com grade */}
      <div className="landing-grid-bg" />

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 24px',
        background: 'rgba(2,6,23,0.7)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <LinKeyLogo size={32} textSize={20} />
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/auth/login" style={{ padding: '10px 20px', color: '#94A3B8', textDecoration: 'none', fontSize: '14px', fontWeight: 600, transition: 'color 0.2s' }}
            onMouseOver={e => e.currentTarget.style.color = '#F8FAFC'}
            onMouseOut={e => e.currentTarget.style.color = '#94A3B8'}>
            Entrar
          </Link>
          <Link href="/auth/cadastro" className="btn-primary" style={{ padding: '10px 22px', fontSize: '14px' }}>
            Criar grátis
          </Link>
        </div>
      </nav>

      <main style={{ paddingTop: '60px' }}>

        {/* HERO */}
        <section style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
            width: '800px', height: '500px',
            background: `radial-gradient(ellipse, ${nicho.cor}15 0%, transparent 70%)`,
            transition: 'background 1s cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: 'none', filter: 'blur(80px)',
          }} />

          <div style={{ maxWidth: '840px', position: 'relative' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${nicho.cor}33`,
              borderRadius: '100px', fontSize: '14px', fontWeight: 700, color: nicho.cor,
              marginBottom: '32px', transition: 'all 0.5s ease', backdropFilter: 'blur(10px)',
            }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>{nicho.icon}</span>
              Para {nicho.label}
            </div>

            <h1 style={{
              fontSize: 'clamp(40px,8vw,72px)', fontWeight: 800,
              letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '24px',
              background: 'linear-gradient(to bottom,#FFFFFF 60%,#94A3B8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Sua página profissional <br /> pronta em{' '}
              <span style={{ color: nicho.cor, WebkitTextFillColor: 'initial', transition: 'color 0.8s' }}>minutos</span>
            </h1>

            <p style={{ fontSize: 'clamp(16px,2vw,20px)', color: '#94A3B8', maxWidth: '600px', margin: '0 auto 48px', lineHeight: 1.6, fontWeight: 500 }}>
              O link na bio feito para músicos, tatuadores, corretores e criadores. Mais alcance, menos esforço.
            </p>

            <div className="hero-cta-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
              <Link href="/auth/cadastro" className="btn-primary" style={{ padding: '16px 36px', fontSize: '16px' }}>
                Começar agora — É grátis
              </Link>
              <div onClick={copiarLink} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 20px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '100px', cursor: 'pointer', transition: 'all 0.3s',
              }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              >
                <span style={{ color: '#64748B', fontSize: '15px', fontWeight: 600 }}>linkey.cloud/</span>
                <span style={{ color: '#F8FAFC', fontSize: '15px', fontWeight: 700 }}>seunome</span>
                <div style={{ marginLeft: '4px', color: copiado ? '#34D399' : '#64748B' }}>
                  {copiado ? '✓' : <IconCopy />}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section style={{ padding: '100px 24px', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
              Tudo o que você precisa para <br /><span className="gradient-text-accent">vender mais</span>
            </h2>
          </div>
          <div className="landing-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '24px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card" style={{ padding: '32px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'rgba(139,92,246,0.1)', color: '#8B5CF6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px', border: '1px solid rgba(139,92,246,0.2)',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#F8FAFC' }}>{f.titulo}</h3>
                <p style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PREÇOS */}
        <section style={{ padding: '100px 24px', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(139,92,246,0.03)',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
                Planos simples, <span className="gradient-text-accent">sem surpresa</span>
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '17px', maxWidth: '500px', margin: '0 auto 32px' }}>
                Comece grátis. Faça upgrade quando precisar. Cancele quando quiser.
              </p>

              {/* Toggle mensal / anual */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  display: 'inline-flex',
                  background: 'rgba(255,255,255,0.05)',
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
                        padding: '8px 22px',
                        borderRadius: '100px',
                        border: 'none',
                        background: periodo === p ? 'rgba(255,255,255,0.12)' : 'transparent',
                        color: periodo === p ? '#fff' : 'rgba(255,255,255,0.45)',
                        fontSize: '14px', fontWeight: periodo === p ? 600 : 400,
                        cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: '8px',
                      }}
                    >
                      {p === 'mensal' ? 'Mensal' : (
                        <>
                          Anual
                          <span style={{
                            padding: '2px 8px',
                            background: 'rgba(111,255,150,0.15)',
                            border: '1px solid rgba(111,255,150,0.3)',
                            borderRadius: '100px',
                            fontSize: '11px', fontWeight: 700,
                            color: '#6fff96',
                          }}>
                            -20%
                          </span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="planos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '24px', alignItems: 'start' }}>
              {PLANOS.map((plano, i) => (
                <div key={i} style={{
                  position: 'relative',
                  background: plano.destaque
                    ? 'linear-gradient(160deg,rgba(139,92,246,0.15) 0%,rgba(124,58,237,0.08) 100%)'
                    : 'rgba(255,255,255,0.03)',
                  border: plano.destaque ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '24px', padding: '36px 32px',
                  backdropFilter: 'blur(12px)',
                  transform: plano.destaque ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: plano.destaque ? '0 25px 50px -12px rgba(139,92,246,0.25)' : 'none',
                }}>
                  {plano.badge && (
                    <div style={{
                      position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                      padding: '5px 18px',
                      background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)',
                      borderRadius: '100px', fontSize: '12px', fontWeight: 700, color: '#fff',
                      whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(139,92,246,0.4)',
                    }}>
                      {plano.badge}
                    </div>
                  )}

                  <div style={{ marginBottom: '28px' }}>
                    <div style={{
                      display: 'inline-block', padding: '4px 12px',
                      background: `${plano.cor}18`, border: `1px solid ${plano.cor}30`,
                      borderRadius: '100px', fontSize: '12px', fontWeight: 700, color: plano.cor, marginBottom: '16px',
                    }}>
                      {plano.nome}
                    </div>

                    {/* Preço */}
                    {plano.precoMensal === 0 ? (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '42px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.03em' }}>Grátis</span>
                        <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>para sempre</span>
                      </div>
                    ) : (
                      <>
                        {periodo === 'anual' && (
                          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through', marginBottom: '2px' }}>
                            R${plano.precoMensal}/mês
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '42px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.03em' }}>
                            R${periodo === 'anual'
                              ? (plano.precoMensal * 0.80).toFixed(2)
                              : plano.precoMensal}
                          </span>
                          <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>/mês</span>
                        </div>
                        {periodo === 'anual' && (
                          <div style={{ fontSize: '12px', color: '#6fff96', marginBottom: '4px' }}>
                            cobrado R${(plano.precoMensal * 12 * 0.80).toFixed(2)}/ano · 20% off
                          </div>
                        )}
                      </>
                    )}

                    <p style={{ fontSize: '14px', color: '#64748B', marginTop: '8px' }}>{plano.descricao}</p>
                  </div>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                    {plano.itens.map((item, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#CBD5E1' }}>
                        <span style={{ color: plano.destaque ? '#8B5CF6' : '#34D399', flexShrink: 0 }}><IconCheck /></span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link href={plano.href}
                    className={plano.destaque ? 'btn-primary' : 'btn-glass'}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    {plano.cta}
                  </Link>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '13px', color: '#475569' }}>
              Sem cartão de crédito para começar · Cancele quando quiser · Seus dados, sempre seus
            </p>
          </div>
        </section>

        {/* ALL-STAR */}
        <section style={{ padding: '100px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px',
                background: 'rgba(255,215,0,0.1)',
                border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: '100px', fontSize: '13px', fontWeight: 700,
                color: '#FFD700', marginBottom: '20px',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFD700"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Plano All-Star
              </div>
              <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
                Uma página à altura do seu <span style={{ background: 'linear-gradient(to right, #FFD700, #FFA500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>nível</span>
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '17px', maxWidth: '540px', margin: '0 auto' }}>
                Para quem não é qualquer um. Cada categoria tem sua própria ficha, identidade e elementos exclusivos.
              </p>
            </div>

            {/* Grid assimétrico de categorias */}
            <div className="allstar-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '48px' }}>

              {/* ── FUTEBOL — card FIFA puro, 1 coluna, 2 linhas ── */}
              <div className="glass-card" style={{
                gridColumn: '1 / 2', gridRow: '1 / 3',
                padding: '0', border: '1px solid rgba(255,215,0,0.25)',
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(160deg,#1a3a6e 0%,#091528 60%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '160px', background: 'linear-gradient(170deg,rgba(255,215,0,0.10) 0%,transparent 65%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', right: '-14px', top: '-6px', fontSize: '130px', fontWeight: 900, color: 'rgba(255,215,0,0.05)', lineHeight: 1, pointerEvents: 'none' }}>10</div>

                {/* Topo OVR + bandeira + escudo */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '18px 18px 0', position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '36px', fontWeight: 900, color: '#FFD700', lineHeight: 1, letterSpacing: '-0.04em' }}>94</span>
                    <span style={{ fontSize: '8px', fontWeight: 800, color: 'rgba(255,215,0,0.5)', letterSpacing: '0.14em' }}>OVR</span>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>CAM</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <div style={{ width: '30px', height: '20px', borderRadius: '3px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ flex: 1, background: '#009C3B' }} />
                      <div style={{ flex: 1, background: '#FFDF00' }} />
                      <div style={{ height: '6px', background: '#002776' }} />
                    </div>
                    <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: '#1e3a6e', border: '1.5px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 40 40"><polygon points="20,3 37,11 37,29 20,37 3,29 3,11" fill="#FFD700" /><text x="20" y="25" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0a1628" fontFamily="sans-serif">LK</text></svg>
                    </div>
                  </div>
                </div>

                {/* Avatar */}
                <div style={{ position: 'relative', zIndex: 2, marginTop: '6px' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(145deg,#1e3a6e,#0d2448)', border: '2px solid rgba(255,215,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <svg width="80" height="80" viewBox="0 0 90 90" fill="none"><circle cx="45" cy="30" r="18" fill="rgba(255,255,255,0.1)"/><ellipse cx="45" cy="80" rx="28" ry="20" fill="rgba(255,255,255,0.1)"/></svg>
                  </div>
                </div>

                {/* Nome */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginTop: '8px', padding: '0 12px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>R. Alves</div>
                  <div style={{ width: '48px', height: '1px', background: 'rgba(255,215,0,0.2)', margin: '8px auto' }} />
                </div>

                {/* Stats */}
                <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', width: '100%', padding: '0 14px' }}>
                  {[['96','DRI'],['91','PAS'],['88','CHU'],['85','FIS'],['72','DEF'],['78','RIT']].map(([v,l]) => (
                    <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0' }}>
                      <span style={{ fontSize: '14px', fontWeight: 900, color: '#FFD700', lineHeight: 1 }}>{v}</span>
                      <span style={{ fontSize: '8px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>{l}</span>
                    </div>
                  ))}
                </div>

                <div style={{ position: 'relative', zIndex: 2, marginTop: '10px', marginBottom: '16px', fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>FC Linkey · Brasil</div>
              </div>

              {/* ── UFC / MMA — octógono + cartel ── */}
              <div className="glass-card" style={{
                gridColumn: '2 / 4', gridRow: '1 / 2',
                padding: '0',
                border: '1px solid rgba(255,69,0,0.25)',
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(135deg, #1a0800 0%, #0d0d0d 60%)',
                display: 'flex', alignItems: 'stretch',
              }}>
                {/* Faixa vermelha lateral */}
                <div style={{ width: '4px', background: 'linear-gradient(to bottom, #FF4500, #8B1500)', flexShrink: 0 }} />

                {/* Octógono decorativo */}
                <div style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', opacity: 0.04 }}>
                  <svg width="180" height="180" viewBox="0 0 100 100">
                    <polygon points="35,5 65,5 95,35 95,65 65,95 35,95 5,65 5,35" fill="none" stroke="#FF4500" strokeWidth="3"/>
                    <polygon points="38,12 62,12 88,38 88,62 62,88 38,88 12,62 12,38" fill="none" stroke="#FF4500" strokeWidth="1.5"/>
                  </svg>
                </div>

                <div style={{ flex: 1, padding: '20px 24px', position: 'relative', zIndex: 2 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,69,0,0.6)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>MMA · UFC · Boxe</div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#F8FAFC', marginTop: '2px', letterSpacing: '-0.02em' }}>M. "Iron Jaw" Santos</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Categoria</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: 'rgba(255,69,0,0.85)' }}>Peso Pesado</div>
                    </div>
                  </div>

                  {/* Cartel 18-2-1 */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                    {[
                      { n: '18', label: 'V', full: 'Vitórias',  cor: '#22c55e', w: '2fr' },
                      { n: '2',  label: 'D', full: 'Derrotas',  cor: '#ef4444', w: '1fr' },
                      { n: '1',  label: 'E', full: 'Empates',   cor: '#475569', w: '1fr' },
                    ].map(s => (
                      <div key={s.label} style={{
                        flex: s.label === 'V' ? 2 : 1,
                        padding: '10px 10px 8px',
                        background: `${s.cor}10`,
                        border: `1px solid ${s.cor}35`,
                        borderRadius: '8px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ fontSize: '26px', fontWeight: 900, color: s.cor, lineHeight: 1 }}>{s.n}</span>
                          <span style={{ fontSize: '9px', fontWeight: 800, color: s.cor, opacity: 0.6, letterSpacing: '0.1em' }}>{s.full.toUpperCase()}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Linha de detalhes */}
                  <div style={{ display: 'flex', gap: '0', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {[
                      { label: 'KOs / TKOs', valor: '14' },
                      { label: 'Finalizações', valor: '4' },
                      { label: 'Ranking', valor: '#3' },
                    ].map((d, i) => (
                      <div key={d.label} style={{
                        flex: 1, padding: '8px 10px', textAlign: 'center',
                        background: 'rgba(255,255,255,0.02)',
                        borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      }}>
                        <div style={{ fontSize: '15px', fontWeight: 900, color: '#F8FAFC', lineHeight: 1 }}>{d.valor}</div>
                        <div style={{ fontSize: '8px', fontWeight: 600, color: '#475569', letterSpacing: '0.08em', marginTop: '2px' }}>{d.label.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── ATOR / INFLUENCER — perfil com alcance ── */}
              <div className="glass-card" style={{
                gridColumn: '2 / 3', gridRow: '2 / 3',
                padding: '0',
                border: '1px solid rgba(244,114,182,0.2)',
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(145deg, #1a0a18 0%, #0d0d0d 70%)',
              }}>
                {/* Brilho rosa no topo */}
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(244,114,182,0.08)', filter: 'blur(30px)', pointerEvents: 'none' }} />

                <div style={{ padding: '18px', position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {/* Header com mini avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(244,114,182,0.3), rgba(168,85,247,0.3))', border: '1.5px solid rgba(244,114,182,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(244,114,182,0.8)" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(244,114,182,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Ator · Influencer</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#F8FAFC' }}>@ana.starr</div>
                    </div>
                    {/* Verificado */}
                    <div style={{ marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#F472B6"><path d="M20 6L9 17l-5-5"/><polyline points="20 6 9 17 4 12" fill="none" stroke="#F472B6" strokeWidth="3" strokeLinecap="round"/></svg>
                    </div>
                  </div>

                  {/* Número grande */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontSize: '32px', fontWeight: 900, color: '#F472B6', lineHeight: 1, letterSpacing: '-0.03em' }}>2.4M</span>
                    </div>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>Seguidores totais</div>
                  </div>

                  {/* Barra de plataformas */}
                  <div>
                    <div style={{ display: 'flex', gap: '3px', marginBottom: '5px' }}>
                      {[['Instagram','60%','#E1306C'],['TikTok','25%','#fff'],['YouTube','15%','#FF0000']].map(([p, w, c]) => (
                        <div key={p as string} style={{ height: '3px', width: w as string, borderRadius: '2px', background: c as string, opacity: 0.7 }} />
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[['Instagram','60%'],['TikTok','25%'],['YouTube','15%']].map(([p, w]) => (
                        <div key={p} style={{ fontSize: '9px', color: '#475569', fontWeight: 600 }}>{p} <span style={{ color: '#64748B' }}>{w}</span></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── NATAÇÃO / ATLETISMO — recordes ── */}
              <div className="glass-card" style={{
                gridColumn: '3 / 4', gridRow: '2 / 3',
                padding: '22px',
                border: '1px solid rgba(79,195,247,0.2)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: '-8px', right: '10px', fontSize: '68px', fontWeight: 900, color: 'rgba(79,195,247,0.06)', lineHeight: 1 }}>WR</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(79,195,247,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Natação · Atletismo</div>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#475569', marginBottom: '2px' }}>100m livre</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 900, color: '#4FC3F7', lineHeight: 1 }}>47.82</span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>seg</span>
                  </div>
                </div>
                <div style={{ padding: '6px 10px', background: 'rgba(79,195,247,0.08)', border: '1px solid rgba(79,195,247,0.15)', borderRadius: '8px', fontSize: '11px', color: 'rgba(79,195,247,0.7)', fontWeight: 700 }}>Paris 2024 · Tokyo 2020</div>
              </div>

              {/* ── MÚSICO — card compacto ── */}
              <div className="glass-card" style={{
                gridColumn: '1 / 2', gridRow: '3 / 4',
                padding: '18px',
                border: '1px solid rgba(192,132,252,0.2)',
                position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div style={{ position: 'absolute', right: '-8px', bottom: '-12px', fontSize: '80px', fontWeight: 900, color: 'rgba(192,132,252,0.05)', lineHeight: 1 }}>#1</div>
                <div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(192,132,252,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Músico · Artista</div>
                  {/* Disco mini */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ flexShrink: 0, width: '44px', height: '44px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #2a1a4e, #0d0a1a)', border: '1.5px solid rgba(192,132,252,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(192,132,252,0.15)', border: '1px solid rgba(192,132,252,0.2)' }} />
                      <div style={{ position: 'absolute', inset: '4px', borderRadius: '50%', border: '1px solid rgba(192,132,252,0.07)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#C084FC', lineHeight: 1 }}>3.2M</div>
                      <div style={{ fontSize: '9px', color: '#475569', fontWeight: 600, letterSpacing: '0.06em' }}>OUVINTES/MÊS</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[['12','Álbuns'],['48','Singles']].map(([n,l]) => (
                    <div key={l} style={{ flex: 1, padding: '6px 8px', background: 'rgba(192,132,252,0.06)', border: '1px solid rgba(192,132,252,0.12)', borderRadius: '7px', textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: '#C084FC', lineHeight: 1 }}>{n}</div>
                      <div style={{ fontSize: '8px', color: '#475569', fontWeight: 600, marginTop: '2px' }}>{l.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── ESCRITOR — card com prateleira ── */}
              <div className="glass-card" style={{
                gridColumn: '2 / 3', gridRow: '3 / 4',
                padding: '18px',
                border: '1px solid rgba(111,255,150,0.15)',
                position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                {/* Prateleira decorativa */}
                <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', marginBottom: '12px' }}>
                  {[['#6FFF96','70px'],['#4FC3F7','56px'],['#C084FC','64px'],['#FFD700','50px'],['#6FFF96','60px']].map(([c,h],i) => (
                    <div key={i} style={{ width: '12px', height: h, borderRadius: '2px 2px 0 0', background: `${c}14`, border: `1px solid ${c}28`, flexShrink: 0 }} />
                  ))}
                  <div style={{ flex: 1, height: '1px', background: 'rgba(111,255,150,0.1)', alignSelf: 'flex-end', marginLeft: '2px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(111,255,150,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>Escritor · Autor</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 900, color: '#6FFF96', lineHeight: 1 }}>24</span>
                    <span style={{ fontSize: '10px', color: '#475569', fontWeight: 600 }}>LIVROS PUBLICADOS</span>
                  </div>
                </div>
              </div>

              {/* ── EMPRESA / MARCA — card largo ── */}
              <div className="glass-card" style={{
                gridColumn: '3 / 4', gridRow: '3 / 4',
                padding: '0',
                border: '1px solid rgba(255,215,0,0.15)',
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(145deg, #0f0d00 0%, #0d0d0d 70%)',
              }}>
                {/* Glow dourado */}
                <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,215,0,0.06)', filter: 'blur(25px)', pointerEvents: 'none' }} />

                <div style={{ padding: '18px', position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {/* Header empresa */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,215,0,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Empresa · Marca</div>
                      {/* Badge nacional/internacional */}
                      <div style={{ padding: '2px 7px', background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '100px', fontSize: '8px', fontWeight: 700, color: 'rgba(255,215,0,0.6)', letterSpacing: '0.08em' }}>GLOBAL</div>
                    </div>
                    {/* Logo placeholder */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,215,0,0.6)" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#F8FAFC', lineHeight: 1 }}>LinKey Corp.</div>
                        <div style={{ fontSize: '9px', color: '#475569', marginTop: '2px' }}>Tecnologia · SaaS</div>
                      </div>
                    </div>
                  </div>

                  {/* Dados da empresa */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[['2019','Fundação'],['500+','Equipe'],['12','Países']].map(([v,l]) => (
                      <div key={l} style={{ flex: 1, padding: '6px 4px', background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.1)', borderRadius: '6px', textAlign: 'center' }}>
                        <div style={{ fontSize: '13px', fontWeight: 900, color: '#FFD700', lineHeight: 1 }}>{v}</div>
                        <div style={{ fontSize: '7px', color: '#475569', fontWeight: 600, marginTop: '2px', letterSpacing: '0.06em' }}>{l.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* CTA All-Star */}
            <div style={{ textAlign: 'center' }}>
              <a href="/auth/cadastro?plano=allstar" style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '16px 36px',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                borderRadius: '100px', textDecoration: 'none',
                fontSize: '16px', fontWeight: 700, color: '#0a0a0a',
                boxShadow: '0 0 40px rgba(255,215,0,0.25)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0a0a0a"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Quero ser All-Star — R$99,99/mês
              </a>
              <p style={{ marginTop: '12px', fontSize: '13px', color: '#475569' }}>
                Verificação por link público · Cancele quando quiser
              </p>
            </div>
          </div>
        </section>

        {/* DEPOIMENTOS */}
        <section style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="depoimentos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '32px' }}>
              {DEPOIMENTOS.map((d, i) => (
                <div key={i}>
                  <p style={{ fontSize: '18px', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '24px', fontStyle: 'italic' }}>
                    &ldquo;{d.texto}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: d.cor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>
                      {d.iniciais}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '15px' }}>{d.nome}</div>
                      <div style={{ fontSize: '13px', color: '#64748B' }}>{d.nicho}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: '100px 24px', maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '48px', letterSpacing: '-0.02em' }}>
            Dúvidas frequentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PERGUNTAS.map((item, i) => (
              <div key={i} onClick={() => setFaqAberto(faqAberto === i ? null : i)} className="glass-card" style={{ padding: '20px 24px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#F8FAFC' }}>{item.p}</h4>
                  <span style={{ color: '#64748B', transition: 'transform 0.3s', transform: faqAberto === i ? 'rotate(180deg)' : 'rotate(0)' }}>↓</span>
                </div>
                {faqAberto === i && (
                  <p style={{ marginTop: '16px', color: '#94A3B8', fontSize: '15px', lineHeight: 1.6, animation: 'fadeIn 0.3s ease' }}>
                    {item.r}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: '80px 24px 40px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
            <LinKeyLogo size={32} showText={true} />
          </div>
          <p style={{ color: '#64748B', fontSize: '13px', fontWeight: 500, letterSpacing: '0.02em' }}>
            © {new Date().getFullYear()} LinKey. Todos os direitos reservados.
          </p>
        </footer>

      </main>
    </>
  )
}
