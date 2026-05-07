// src/app/[username]/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
    }}>
      <div>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
        <h1 style={{
          fontSize: '28px', fontWeight: 800,
          letterSpacing: '-0.5px', marginBottom: '12px',
        }}>
          Página não encontrada
        </h1>
        <p style={{
          fontSize: '15px',
          color: 'rgba(255,255,255,0.55)',
          marginBottom: '32px',
          maxWidth: '320px',
          margin: '0 auto 32px',
          lineHeight: 1.5,
        }}>
          Esse link não existe ou foi removido. Que tal criar o seu?
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '13px 28px',
            background: 'linear-gradient(135deg, #7C6FFF, #9c6fff)',
            color: 'white',
            borderRadius: '100px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '15px',
            boxShadow: '0 4px 24px rgba(124,111,255,0.4)',
          }}
        >
          ⬡ Criar meu LinKey grátis
        </Link>
      </div>
    </main>
  )
}
