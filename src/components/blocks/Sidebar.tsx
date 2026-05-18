'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { LinKeyLogo } from './LinKeyLogo'

const NAV = [
  { href: '/dashboard',           icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>, label: 'Visão geral'  },
  { href: '/dashboard/editor',    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>, label: 'Editor'       },
  { href: '/dashboard/links',     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>, label: 'Links'        },
  { href: '/dashboard/qrcode',    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><path d="M15 15h.01M15 18h3v3h3v-6h-6v3z"/></svg>, label: 'QR Code'      },
  { href: '/dashboard/dominio',   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, label: 'Domínio'      },
  { href: '/dashboard/analytics', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, label: 'Analytics'    },
  { href: '/dashboard/planos',    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, label: 'Planos'       },
]

interface Props {
  username:  string
  nome:      string
  plano:     string
  fotoUrl?:  string | null
}

export default function Sidebar({ username, nome, plano, fotoUrl }: Props) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const [saindo, setSaindo]   = useState(false)
  const [mobile, setMobile]   = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  async function handleSair() {
    setSaindo(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  // ── MOBILE: bottom nav bar ─────────────────────────────────────
  if (mobile) {
    return (
      <nav style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 50,
        background: 'rgba(2,6,23,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        paddingBottom: 'env(safe-area-inset-bottom)',
        height: 'calc(64px + env(safe-area-inset-bottom))',
      }}>
        {NAV.map(item => {
          const ativo = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                textDecoration: 'none',
                padding: '8px 4px',
                color: ativo ? '#8B5CF6' : 'rgba(255,255,255,0.35)',
                transition: 'color 0.2s',
                minHeight: '56px',
              }}
            >
              <span style={{ color: ativo ? '#8B5CF6' : 'rgba(255,255,255,0.35)' }}>
                {item.icon}
              </span>
              <span style={{ fontSize: '10px', fontWeight: ativo ? 700 : 400, letterSpacing: '0.02em' }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    )
  }

  // ── DESKTOP: sidebar lateral ───────────────────────────────────
  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      background: 'rgba(255,255,255,0.03)',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
    }}>

      {/* Logo */}
      <Link href="/dashboard" style={{
        textDecoration: 'none', marginBottom: '32px',
        display: 'block', paddingLeft: '8px',
      }}>
        <LinKeyLogo size={28} textSize={20} style={{ color: '#fff' }} />
      </Link>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {NAV.map(item => {
          const ativo = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: ativo ? 600 : 400,
                color: ativo ? '#fff' : 'rgba(255,255,255,0.5)',
                background: ativo ? 'rgba(124,111,255,0.18)' : 'transparent',
                border: ativo ? '1px solid rgba(124,111,255,0.25)' : '1px solid transparent',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => {
                if (!ativo) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseOut={e => {
                if (!ativo) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                }
              }}
            >
              <span style={{ color: ativo ? '#8B5CF6' : 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Link da página */}
      <a
        href={`/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 12px',
          borderRadius: '12px',
          background: 'rgba(124,111,255,0.1)',
          border: '1px solid rgba(124,111,255,0.2)',
          textDecoration: 'none',
          fontSize: '13px',
          color: '#b4aeff',
          marginBottom: '12px',
          transition: 'all 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.background = 'rgba(124,111,255,0.18)')}
        onMouseOut={e => (e.currentTarget.style.background = 'rgba(124,111,255,0.1)')}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          /{username}
        </span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>

      {/* Usuário */}
      <div style={{
        padding: '12px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#7C6FFF,#FF6FBD)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 700, overflow: 'hidden',
          }}>
            {fotoUrl
              ? <img src={fotoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : nome.charAt(0).toUpperCase()
            }
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {nome}
            </div>
            <div style={{ fontSize: '11px', marginTop: '2px' }}>
              <span style={{
                padding: '2px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: 700,
                background: plano === 'free' ? 'rgba(255,255,255,0.1)' : 'rgba(124,111,255,0.25)',
                color: plano === 'free' ? 'rgba(255,255,255,0.5)' : '#b4aeff',
              }}>
                {plano.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleSair}
          disabled={saindo}
          style={{
            width: '100%', padding: '7px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.45)',
            fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,100,100,0.1)'; e.currentTarget.style.color = '#ff9696' }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
        >
          {saindo ? 'Saindo...' : '← Sair'}
        </button>
      </div>

    </aside>
  )
}
