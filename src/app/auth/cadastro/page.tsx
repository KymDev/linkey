'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LinKeyLogo } from '@/components/blocks/LinKeyLogo'

export default function CadastroPage() {
  const router = useRouter()
  const supabase = createClient()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  // Força da senha
  function forcaSenha(s: string): { nivel: number; texto: string; cor: string } {
    if (s.length === 0) return { nivel: 0, texto: '', cor: '' }
    let pts = 0
    if (s.length >= 8)            pts++
    if (/[A-Z]/.test(s))          pts++
    if (/[0-9]/.test(s))          pts++
    if (/[^a-zA-Z0-9]/.test(s))  pts++
    if (pts <= 1) return { nivel: 1, texto: 'Fraca',  cor: '#ff6f6f' }
    if (pts === 2) return { nivel: 2, texto: 'Média',  cor: '#ffd580' }
    if (pts === 3) return { nivel: 3, texto: 'Boa',    cor: '#6fffe9' }
    return               { nivel: 4, texto: 'Forte',  cor: '#6fff96' }
  }

  const forca = forcaSenha(senha)

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (senha !== confirmar) {
      setErro('As senhas não coincidem.')
      return
    }
    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        setErro('Este email já está cadastrado. Tente fazer login.')
      } else {
        setErro('Erro ao criar conta. Tente novamente.')
      }
      setLoading(false)
      return
    }

    setSucesso(true)
    setLoading(false)
  }

  async function handleGoogle() {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  // Tela de sucesso
  if (sucesso) {
    return (
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
            Confirme seu email
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
            Enviamos um link de confirmação para{' '}
            <strong style={{ color: 'var(--text)' }}>{email}</strong>.
            <br />
            Clique no link para ativar sua conta.
          </p>
          <div className="glass-card-static" style={{ padding: '20px', marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Não recebeu? Verifique a pasta de spam ou{' '}
              <button
                onClick={() => setSucesso(false)}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px' }}
              >
                tente novamente
              </button>
            </p>
          </div>
          <Link href="/auth/login" className="btn-glass" style={{ display: 'inline-flex' }}>
            Voltar ao login
          </Link>
        </div>
      </main>
    )
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
          <Link
            href="/"
            style={{
              fontSize: '24px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #fff 30%, rgba(124,111,255,0.9))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
            }}
          >
            <LinKeyLogo size={36} textSize={26} />
          </Link>
          <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Crie sua página profissional grátis
          </p>
        </div>

        {/* Card */}
        <div className="glass-card-static" style={{ padding: '32px' }}>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 20px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              color: 'var(--text)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s',
              marginBottom: '24px',
            }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Cadastrar com Google
          </button>

          {/* Divisor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>ou com email</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div>
              <label className="form-label">Seu nome</label>
              <input
                className="glass-input"
                type="text"
                placeholder="Como você se chama?"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

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
              />
            </div>

            <div>
              <label className="form-label">Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="glass-input"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                  autoComplete="new-password"
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '12px', color: 'var(--text-dim)', padding: 0,
                  }}
                >
                  {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>

              {/* Barra de força da senha */}
              {senha && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{
                    display: 'flex', gap: '4px', marginBottom: '4px',
                  }}>
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        style={{
                          flex: 1, height: '3px', borderRadius: '2px',
                          background: i <= forca.nivel ? forca.cor : 'rgba(255,255,255,0.1)',
                          transition: 'all 0.3s',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', color: forca.cor }}>
                    Senha {forca.texto}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Confirmar senha</label>
              <input
                className="glass-input"
                type="password"
                placeholder="Repita a senha"
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
                required
                autoComplete="new-password"
                style={{
                  borderColor: confirmar && confirmar !== senha
                    ? 'rgba(255,111,111,0.4)'
                    : undefined,
                }}
              />
              {confirmar && confirmar !== senha && (
                <p style={{ fontSize: '11px', color: '#ff9696', marginTop: '4px' }}>
                  As senhas não coincidem
                </p>
              )}
            </div>

            {/* Erro */}
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

            {/* Terms */}
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center' }}>
              Ao criar conta, você concorda com os{' '}
              <Link href="/termos" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link href="/privacidade" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                Privacidade
              </Link>
            </p>

            <button
              type="submit"
              disabled={loading || (!!confirmar && confirmar !== senha)}
              className="btn-primary"
              style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <Spinner /> Criando conta...
                </>
              ) : (
                'Criar conta grátis'
              )}
            </button>
          </form>
        </div>

        <p style={{
          textAlign: 'center', marginTop: '20px',
          fontSize: '14px', color: 'var(--text-muted)',
        }}>
          Já tem conta?{' '}
          <Link href="/auth/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            Entrar
          </Link>
        </p>

      </div>
    </main>
  )
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
