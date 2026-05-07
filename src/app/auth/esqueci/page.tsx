'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { LinKeyLogo } from '@/components/blocks/LinKeyLogo'

export default function EsqueciSenhaPage() {
  const supabase = createClient()

  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [enviado, setEnviado]   = useState(false)
  const [erro, setErro]         = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/reset-senha`,
    })

    if (error) {
      setErro('Não foi possível enviar o email. Verifique o endereço e tente novamente.')
      setLoading(false)
      return
    }

    setEnviado(true)
    setLoading(false)
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/">
            <LinKeyLogo size={36} textSize={26} />
          </Link>
          <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Recuperar acesso
          </p>
        </div>

        <div className="glass-card-static" style={{ padding: '32px' }}>

          {enviado ? (
            /* Estado: email enviado */
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '56px', height: '56px',
                background: 'rgba(111,255,150,0.12)',
                border: '1px solid rgba(111,255,150,0.25)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '24px',
              }}>
                ✉️
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
                Email enviado!
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                Enviamos um link para <strong style={{ color: 'var(--text)' }}>{email}</strong>.
                Verifique sua caixa de entrada e também o spam.
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                O link expira em 1 hora.
              </p>
            </div>
          ) : (
            /* Estado: formulário */
            <>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                Esqueceu a senha?
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
                Digite seu email e enviaremos um link para criar uma nova senha.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    className="glass-input"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>

                {erro && (
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(255,111,111,0.12)',
                    border: '1px solid rgba(255,111,111,0.25)',
                    borderRadius: '10px',
                    fontSize: '13px',
                    color: '#ff9696',
                  }}>
                    {erro}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '4px', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </button>
              </form>
            </>
          )}

        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Lembrou a senha?{' '}
          <Link href="/auth/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            Voltar ao login
          </Link>
        </p>

      </div>
    </main>
  )
}
