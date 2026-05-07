'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LinKeyLogo } from '@/components/blocks/LinKeyLogo'

export default function ResetSenhaPage() {
  const supabase = createClient()
  const router   = useRouter()

  const [novaSenha, setNovaSenha]           = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrar, setMostrar]               = useState(false)
  const [loading, setLoading]               = useState(false)
  const [erro, setErro]                     = useState('')
  const [sucesso, setSucesso]               = useState(false)
  const [sessaoOk, setSessaoOk]             = useState(false)

  // Supabase envia o token via fragment (#access_token=...) na URL
  // O cliente Supabase detecta automaticamente e cria a sessão
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessaoOk(true)
      }
    })
  }, [supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (novaSenha.length < 8) {
      setErro('A senha precisa ter pelo menos 8 caracteres.')
      return
    }

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password: novaSenha })

    if (error) {
      setErro('Não foi possível atualizar a senha. O link pode ter expirado. Solicite um novo.')
      setLoading(false)
      return
    }

    setSucesso(true)
    setTimeout(() => router.push('/dashboard'), 2500)
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
            Criar nova senha
          </p>
        </div>

        <div className="glass-card-static" style={{ padding: '32px' }}>

          {sucesso ? (
            /* Sucesso */
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
                ✅
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
                Senha atualizada!
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Redirecionando para o dashboard...
              </p>
            </div>

          ) : !sessaoOk ? (
            /* Aguardando token do Supabase */
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Verificando link de recuperação...
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                Se demorar, o link pode ter expirado.{' '}
                <Link href="/auth/esqueci" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                  Solicitar novo link
                </Link>
              </p>
            </div>

          ) : (
            /* Formulário nova senha */
            <>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                Escolha uma nova senha
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Mínimo 8 caracteres.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div>
                  <label className="form-label">Nova senha</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="glass-input"
                      type={mostrar ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={novaSenha}
                      onChange={e => setNovaSenha(e.target.value)}
                      required
                      autoFocus
                      style={{ paddingRight: '72px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrar(!mostrar)}
                      style={{
                        position: 'absolute', right: '14px', top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '12px', color: 'var(--text-dim)', padding: 0,
                      }}
                    >
                      {mostrar ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="form-label">Confirmar senha</label>
                  <input
                    className="glass-input"
                    type={mostrar ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmarSenha}
                    onChange={e => setConfirmarSenha(e.target.value)}
                    required
                  />
                </div>

                {/* Indicador de força */}
                {novaSenha.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1,2,3,4].map(n => (
                      <div key={n} style={{
                        flex: 1, height: '3px', borderRadius: '2px',
                        background: novaSenha.length >= n * 3
                          ? n <= 1 ? '#ef4444' : n <= 2 ? '#f97316' : n <= 3 ? '#eab308' : '#22c55e'
                          : 'rgba(255,255,255,0.1)',
                        transition: 'background 0.2s',
                      }}/>
                    ))}
                  </div>
                )}

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
                  {loading ? 'Salvando...' : 'Salvar nova senha'}
                </button>
              </form>
            </>
          )}

        </div>

        {!sucesso && (
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
            <Link href="/auth/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              ← Voltar ao login
            </Link>
          </p>
        )}

      </div>
    </main>
  )
}
