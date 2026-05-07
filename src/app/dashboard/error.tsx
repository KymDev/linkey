'use client'

// src/app/dashboard/error.tsx
import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error)
  }, [error])

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '40px',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
      <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}>
        Algo deu errado
      </h2>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '28px', maxWidth: '360px', lineHeight: 1.6 }}>
        Ocorreu um erro inesperado. Tente novamente ou entre em contato se o problema persistir.
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={reset}
          style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg,#7C6FFF,#9c6fff)',
            border: 'none', borderRadius: '100px',
            color: '#fff', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Tentar novamente
        </button>
        <Link
          href="/dashboard"
          style={{
            padding: '10px 24px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '100px',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '14px', textDecoration: 'none',
          }}
        >
          Ir para o início
        </Link>
      </div>
    </div>
  )
}
