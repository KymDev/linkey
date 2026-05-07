'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AllStarFicha, { type AllStarData } from '@/components/allstar/AllStarFicha'

interface PageData {
  id:           string
  username:     string
  titulo:       string
  subtitulo:    string | null
  cidade:       string | null
  foto_url:     string | null
  tema_cor:     string
  cor_destaque: string
}

interface LinkData {
  id:    string
  emoji: string
  titulo: string
  url:   string
  tipo:  string
}

interface Props {
  page:        PageData
  links:       LinkData[]
  profissao:   string
  plano:       string
  allstarData: AllStarData | null
}

const SOCIAIS = ['instagram', 'tiktok', 'youtube', 'spotify', 'twitter']

export default function PublicPageClient({ page, links, profissao, plano, allstarData }: Props) {

  useEffect(() => {
    fetch('/api/clicks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_id: page.id }),
    }).catch(() => {})
  }, [page.id])

  const registrarClique = useCallback((linkId: string, url: string) => {
    fetch('/api/clicks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_id: page.id, link_id: linkId }),
    }).catch(() => {})
  }, [page.id])

  const linksPrincipais = links.filter(l => !SOCIAIS.includes(l.tipo))
  const linksSociais    = links.filter(l =>  SOCIAIS.includes(l.tipo))

  const cor = page.cor_destaque || '#8B5CF6'
  
  // Lógica de Diferenciação por Nicho
  const isCreative = ['musico', 'fotografo', 'filmmaker', 'tatuador', 'designer_ux', 'designer_grafico'].includes(profissao)
  const isHealth = ['personal', 'nutricionista', 'fisioterapeuta', 'esteticista'].includes(profissao)
  const isBusiness = ['corretor', 'advogado', 'contador', 'consultor'].includes(profissao)

  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: page.tema_cor || '#020617',
      }} />
      
      {/* Mesh Gradient Dinâmico por Nicho */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        opacity: isCreative ? 0.6 : 0.4,
        background: isCreative 
          ? `radial-gradient(circle at 10% 10%, ${cor}44 0%, transparent 50%), radial-gradient(circle at 90% 90%, ${cor}33 0%, transparent 50%)`
          : isHealth
          ? `radial-gradient(circle at 50% 0%, ${cor}33 0%, transparent 60%)`
          : `radial-gradient(circle at 100% 0%, ${cor}22 0%, transparent 50%)`,
        filter: 'blur(60px)',
      }} />
      
      <div className="bg-noise" aria-hidden="true" />

      <main style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        padding: isBusiness ? '80px 20px' : '60px 20px 80px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isBusiness ? 'flex-start' : 'center',
        }}>

          {/* AVATAR - Diferente para cada nicho */}
          <div className="animate-fade-up" style={{ marginBottom: '24px' }}>
            <div style={{
              width: isCreative ? '120px' : '100px',
              height: isCreative ? '120px' : '100px',
              borderRadius: isBusiness ? '24px' : '50%',
              padding: '4px',
              background: `linear-gradient(135deg, ${cor}, ${cor}44)`,
              boxShadow: isCreative ? `0 25px 50px ${cor}44` : `0 20px 40px ${cor}33`,
              transition: 'all 0.5s ease',
            }}>
              <div style={{
                width: '100%', height: '100%',
                borderRadius: isBusiness ? '20px' : '50%',
                overflow: 'hidden',
                background: '#020617',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {page.foto_url ? (
                  <Image
                    src={page.foto_url}
                    alt={page.titulo}
                    width={120}
                    height={120}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                ) : (
                  <span style={{ fontSize: '40px' }}>
                    {profissaoIcon(profissao)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* NOME E BIO - Layout varia por nicho */}
          <div className="animate-fade-up delay-100" style={{ 
            textAlign: isBusiness ? 'left' : 'center', 
            marginBottom: '32px',
            width: '100%'
          }}>
            <h1 style={{
              fontSize: isCreative ? '32px' : '28px',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              marginBottom: '8px',
              lineHeight: 1.1,
              background: 'linear-gradient(to bottom, #FFFFFF, #CBD5E1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {page.titulo}
            </h1>

            {page.subtitulo && (
              <p style={{
                fontSize: '15px',
                color: '#94A3B8',
                marginBottom: '10px',
                lineHeight: 1.5,
                fontWeight: 500,
              }}>
                {page.subtitulo}
              </p>
            )}

            {page.cidade && (
              <div style={{
                fontSize: '13px',
                color: '#64748B',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {page.cidade}
              </div>
            )}
          </div>

          {/* FICHA ALL-STAR */}
          {plano === 'allstar' && allstarData && (
            <div className="animate-fade-up delay-200" style={{ width: '100%' }}>
              <AllStarFicha
                allstar={allstarData}
                titulo={page.titulo}
                foto_url={page.foto_url}
                cor={page.cor_destaque}
              />
            </div>
          )}

          {/* LINKS PRINCIPAIS - Estilo varia por nicho */}
          <div style={{ width: '100%', marginBottom: '16px' }}>
            {linksPrincipais.map((link, i) => (
              <LinkButton
                key={link.id}
                link={link}
                cor={cor}
                delay={i * 80}
                onClique={registrarClique}
                variant={isBusiness ? 'minimal' : isCreative ? 'bold' : 'default'}
              />
            ))}
          </div>

          {/* LINKS SOCIAIS */}
          {linksSociais.length > 0 && (
            <div
              className="animate-fade-up"
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: isBusiness ? 'flex-start' : 'center',
                flexWrap: 'wrap',
                marginBottom: '40px',
                width: '100%'
              }}
            >
              {linksSociais.map(link => (
                <SocialIcon
                  key={link.id}
                  link={link}
                  cor={cor}
                  onClique={registrarClique}
                />
              ))}
            </div>
          )}

          {/* RODAPÉ LINKEY */}
          {plano === 'free' && (
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748B',
                textDecoration: 'none',
                padding: '10px 20px',
                borderRadius: '100px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease',
                marginTop: '12px',
                alignSelf: isBusiness ? 'flex-start' : 'center'
              }}
            >
              <span>Criado com <strong style={{ color: '#CBD5E1' }}>LinKey</strong></span>
            </Link>
          )}

        </div>
      </main>
    </>
  )
}

function LinkButton({
  link,
  cor,
  delay,
  onClique,
  variant = 'default'
}: {
  link:     LinkData
  cor:      string
  delay:    number
  onClique: (id: string, url: string) => void
  variant?: 'default' | 'bold' | 'minimal'
}) {
  const isPix = link.tipo === 'pix'

  return (
    <a
      href={isPix ? undefined : link.url}
      target={isPix ? undefined : "_blank"}
      rel={isPix ? undefined : "noopener noreferrer"}
      onClick={(e) => {
        onClique(link.id, link.url)
        if (isPix) {
          navigator.clipboard?.writeText(link.url).catch(() => {})
          const btn = document.getElementById(`text-${link.id}`)
          if (btn) {
            const original = btn.textContent
            btn.textContent = 'Copiado!'
            setTimeout(() => { if (btn) btn.textContent = original }, 2000)
          }
        }
      }}
      className="animate-fade-up"
      style={{
        animationDelay: `${delay}ms`,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: variant === 'bold' ? '20px 24px' : '18px 24px',
        background: variant === 'minimal' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)',
        border: variant === 'bold' ? `1px solid ${cor}33` : '1px solid rgba(255,255,255,0.08)',
        borderRadius: variant === 'minimal' ? '12px' : '20px',
        marginBottom: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        textDecoration: 'none',
        backdropFilter: 'blur(12px)',
      }}
      onMouseOver={e => {
        e.currentTarget.style.background = variant === 'minimal' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)'
        e.currentTarget.style.borderColor = `${cor}40`
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)'
        e.currentTarget.style.boxShadow = `0 15px 30px -10px ${cor}30`
      }}
      onMouseOut={e => {
        e.currentTarget.style.background = variant === 'minimal' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)'
        e.currentTarget.style.borderColor = variant === 'bold' ? `${cor}33` : 'rgba(255,255,255,0.08)'
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <span style={{
        width: '44px', height: '44px',
        borderRadius: variant === 'minimal' ? '8px' : '12px',
        background: `${cor}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        flexShrink: 0,
        border: `1px solid ${cor}20`,
      }}>
        {/* Usar ícone SVG em vez de emoji se possível */}
        {link.emoji}
      </span>
      <span 
        id={`text-${link.id}`}
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#F8FAFC',
          letterSpacing: '-0.01em',
        }}
      >
        {link.titulo}
      </span>
    </a>
  )
}

function SocialIcon({ link, cor, onClique }: { link: LinkData, cor: string, onClique: any }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onClique(link.id, link.url)}
      title={link.titulo}
      style={{
        width: '52px', height: '52px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        textDecoration: 'none',
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        backdropFilter: 'blur(10px)',
      }}
      onMouseOver={e => {
        e.currentTarget.style.background = `${cor}15`
        e.currentTarget.style.borderColor = `${cor}40`
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)'
        e.currentTarget.style.boxShadow = `0 10px 20px ${cor}20`
      }}
      onMouseOut={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {link.emoji}
    </a>
  )
}

function profissaoIcon(p: string) {
  // Retorna SVGs simples para os ícones padrão
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
