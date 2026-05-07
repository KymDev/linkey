// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', textAlign: 'center',
    }}>
      <div>
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>404</div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '12px' }}>
          Página não encontrada
        </h1>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px', maxWidth: '360px', margin: '0 auto 32px', lineHeight: 1.6 }}>
          Esse endereço não existe. Verifique o link ou volte para o início.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            padding: '12px 28px',
            background: 'linear-gradient(135deg,#7C6FFF,#9c6fff)',
            borderRadius: '100px', color: '#fff',
            textDecoration: 'none', fontSize: '14px', fontWeight: 600,
          }}>
            ← Página inicial
          </Link>
          <Link href="/dashboard" style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '100px', color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none', fontSize: '14px',
          }}>
            Ir para o dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
