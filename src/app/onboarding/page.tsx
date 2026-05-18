'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LinKeyLogo } from '@/components/blocks/LinKeyLogo'
import {
  nichos,
  profissaoNomes,
  profissaoIcones,
  temasPorProfissao,
  linksSugeridos,
  linkIcones,
  isValidUsername,
  PLANOS,
} from '@/lib/utils'

// ─── TIPOS ───────────────────────────────────────────
interface LinkSugerido {
  tipo: string
  titulo: string
  placeholder: string
  url: string
  ativo: boolean
}

interface FormData {
  profissao:    string
  nome:         string
  subtitulo:    string
  cidade:       string
  username:     string
  tema_cor:     string
  cor_destaque: string
  links:        LinkSugerido[]
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────
export default function OnboardingPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [passo, setPasso]   = useState(1)
  const [saving, setSaving] = useState(false)
  const [erro, setErro]     = useState('')
  const [planoUsuario, setPlanoUsuario] = useState<string>('free')
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken' | 'invalid'
  >('idle')

  const [form, setForm] = useState<FormData>({
    profissao:    '',
    nome:         '',
    subtitulo:    '',
    cidade:       '',
    username:     '',
    tema_cor:     '#0a0a0f',
    cor_destaque: '#7C6FFF',
    links:        [],
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.user_metadata?.nome) {
        setForm(f => ({ ...f, nome: data.user!.user_metadata.nome }))
      }
      if (data.user) {
        supabase
          .from('profiles')
          .select('plano')
          .eq('id', data.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile?.plano) setPlanoUsuario(profile.plano)
          })
      }
    })
  }, [])

  function escolherProfissao(p: string) {
    const tema = temasPorProfissao[p] ?? temasPorProfissao.outro
    const sugs = (linksSugeridos[p] ?? linksSugeridos.outro).map(s => ({
      ...s,
      url:   '',
      ativo: true,
    }))
    setForm(f => ({
      ...f,
      profissao:    p,
      tema_cor:     tema.cor,
      cor_destaque: tema.destaque,
      links:        sugs,
    }))
    setPasso(2)
  }

  function gerarUsername(nome: string) {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 20)
  }

  async function verificarUsername(u: string) {
    if (!u) { setUsernameStatus('idle'); return }
    if (!isValidUsername(u)) { setUsernameStatus('invalid'); return }
    setUsernameStatus('checking')
    const { data } = await supabase
      .from('pages')
      .select('id')
      .eq('username', u)
      .single()
    setUsernameStatus(data ? 'taken' : 'available')
  }

  useEffect(() => {
    const t = setTimeout(() => verificarUsername(form.username), 600)
    return () => clearTimeout(t)
  }, [form.username])

  async function handleFinalizar() {
    if (usernameStatus !== 'available') return
    setSaving(true)
    setErro('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ nome: form.nome, profissao: form.profissao || 'outro' })
      .eq('id', user.id)

    if (profileError) {
      setErro('Erro ao salvar perfil. Tente novamente.')
      setSaving(false)
      return
    }

    const { data: page, error: pageError } = await supabase
      .from('pages')
      .insert({
        user_id:      user.id,
        username:     form.username,
        titulo:       form.nome,
        subtitulo:    form.subtitulo || null,
        cidade:       form.cidade   || null,
        tema_cor:     form.tema_cor,
        cor_destaque: form.cor_destaque,
      })
      .select()
      .single()

    if (pageError) {
      setErro('Erro ao criar página. Tente novamente.')
      setSaving(false)
      return
    }

    const linksParaSalvar = form.links
      .filter(l => l.ativo && l.url.trim())
      .map((l, i) => ({
        page_id: page.id,
        emoji:   'link',
        titulo:  l.titulo,
        url:     l.url.trim(),
        tipo:    l.tipo,
        ordem:   i,
        ativo:   true,
      }))

    if (linksParaSalvar.length > 0) {
      await supabase.from('links').insert(linksParaSalvar)
    }

    router.push('/dashboard?novo=1')
  }

  const progresso = (passo / 4) * 100

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <LinKeyLogo size={32} textSize={24} />
        </div>

        {/* Barra de progresso */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginBottom: '10px', fontSize: '13px', color: 'var(--text-muted)',
          }}>
            <span>Passo {passo} de 4</span>
            <span>{Math.round(progresso)}%</span>
          </div>
          <div style={{
            height: '4px', background: 'rgba(255,255,255,0.08)',
            borderRadius: '2px', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${progresso}%`,
              background: 'linear-gradient(90deg, var(--accent), #9c6fff)',
              borderRadius: '2px',
              transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            {['Profissão', 'Perfil', 'Links', 'Endereço'].map((label, i) => (
              <span key={label} style={{
                fontSize: '11px',
                color: i + 1 <= passo ? 'var(--accent)' : 'var(--text-dim)',
                fontWeight: i + 1 === passo ? 600 : 400,
                transition: 'color 0.3s',
              }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ══ PASSO 1 — Profissão ══ */}
        {passo === 1 && (
          <div className="animate-fade-up">
            <div className="glass-card-static" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.3px' }}>
                Qual é a sua profissão?
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px' }}>
                Vamos deixar sua página perfeita para o seu trabalho.
              </p>

              {/* Grade por nicho */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {nichos
                  .filter(nicho => {
                    // All-Star: só para plano allstar
                    if (nicho.id === 'allstar') return planoUsuario === 'allstar'
                    // Pro esportes: para pro e allstar
                    if (nicho.id === 'pro_esportes') return ['pro', 'allstar'].includes(planoUsuario)
                    return true
                  })
                  .map(nicho => (
                  <div key={nicho.id}>
                    {/* Label do nicho */}
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--text-dim)',
                      marginBottom: '10px',
                      paddingLeft: '2px',
                    }}>
                      {nicho.label}
                    </div>

                    {/* Cards de profissão */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                      gap: '8px',
                    }}>
                      {nicho.profissoes.map(key => (
                        <button
                          key={key}
                          onClick={() => escolherProfissao(key)}
                          style={{
                            padding: '12px 14px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '12px',
                            color: 'var(--text)',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            lineHeight: 1.3,
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = 'rgba(124,111,255,0.12)'
                            e.currentTarget.style.borderColor = 'rgba(124,111,255,0.35)'
                            e.currentTarget.style.transform = 'translateY(-1px)'
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                            e.currentTarget.style.transform = 'translateY(0)'
                          }}
                        >
                          {/* Ícone SVG */}
                          <span
                            style={{
                              width: '32px', height: '32px',
                              flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: 'rgba(124,111,255,0.12)',
                              borderRadius: '8px',
                              color: 'var(--accent)',
                            }}
                            dangerouslySetInnerHTML={{ __html: profissaoIcones[key] ?? profissaoIcones.outro }}
                          />
                          <span style={{ lineHeight: 1.35 }}>
                            {profissaoNomes[key]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ PASSO 2 — Perfil ══ */}
        {passo === 2 && (
          <div className="animate-fade-up">
            <div className="glass-card-static" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.3px' }}>
                Suas informações
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px' }}>
                Essas informações aparecem no topo da sua página.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Nome / Nome artístico *</label>
                  <input
                    className="glass-input"
                    type="text"
                    placeholder="Como você quer ser encontrado?"
                    value={form.nome}
                    onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                    required
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="form-label">Especialidade / Descrição</label>
                  <input
                    className="glass-input"
                    type="text"
                    placeholder="Descreva seu trabalho em uma linha"
                    value={form.subtitulo}
                    onChange={e => setForm(f => ({ ...f, subtitulo: e.target.value }))}
                    maxLength={80}
                  />
                </div>

                <div>
                  <label className="form-label">Cidade</label>
                  <input
                    className="glass-input"
                    type="text"
                    placeholder="Ex: São Paulo, SP"
                    value={form.cidade}
                    onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))}
                    maxLength={40}
                  />
                </div>

                <div>
                  <label className="form-label">Cor de destaque</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      '#7C6FFF', '#FF6FBD', '#6FFFE9',
                      '#FFD580', '#6FFF96', '#FF6F6F',
                      '#ffffff', '#4FC3F7',
                    ].map(cor => (
                      <button
                        key={cor}
                        onClick={() => setForm(f => ({ ...f, cor_destaque: cor }))}
                        style={{
                          width: '32px', height: '32px',
                          borderRadius: '50%',
                          background: cor,
                          border: form.cor_destaque === cor
                            ? '3px solid white'
                            : '2px solid rgba(255,255,255,0.1)',
                          cursor: 'pointer',
                          transform: form.cor_destaque === cor ? 'scale(1.15)' : 'scale(1)',
                          transition: 'all 0.2s',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
                <button onClick={() => setPasso(1)} className="btn-glass" style={{ flex: 1 }}>
                  Voltar
                </button>
                <button
                  onClick={() => {
                    if (!form.nome.trim()) return
                    if (!form.username) {
                      setForm(f => ({ ...f, username: gerarUsername(form.nome) }))
                    }
                    setPasso(3)
                  }}
                  className="btn-primary"
                  style={{ flex: 2 }}
                  disabled={!form.nome.trim()}
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ PASSO 3 — Links ══ */}
        {passo === 3 && (
          <div className="animate-fade-up">
            <div className="glass-card-static" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.3px' }}>
                Seus links
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Adicione os links que aparecem na sua página. Você pode editar depois.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {form.links.map((link, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      background: link.ativo
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${link.ativo
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(255,255,255,0.04)'}`,
                      borderRadius: '12px',
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* Ícone SVG do tipo de link */}
                    <span
                      style={{
                        width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: '100px',
                        flexShrink: 0,
                        opacity: link.ativo ? 1 : 0.35,
                        color: link.ativo ? 'var(--accent)' : 'var(--text-dim)',
                      }}
                      dangerouslySetInnerHTML={{
                        __html: linkIcones[link.tipo] ?? linkIcones.outro
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: link.ativo ? 'var(--text)' : 'var(--text-dim)',
                      }}>
                        {link.titulo}
                      </div>
                      <input
                        type="text"
                        placeholder={link.placeholder}
                        value={link.url}
                        onChange={e => {
                          const newLinks = [...form.links]
                          newLinks[i].url = e.target.value
                          setForm(f => ({ ...f, links: newLinks }))
                        }}
                        style={{
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          fontSize: '12px',
                          color: 'var(--text-muted)',
                          padding: '4px 0',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <button
                      onClick={() => {
                        const newLinks = [...form.links]
                        newLinks[i].ativo = !newLinks[i].ativo
                        setForm(f => ({ ...f, links: newLinks }))
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: link.ativo ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.05)',
                        color: link.ativo ? 'var(--accent)' : 'var(--text-dim)',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {link.ativo ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
                <button onClick={() => setPasso(2)} className="btn-glass" style={{ flex: 1 }}>
                  Voltar
                </button>
                <button
                  onClick={() => setPasso(4)}
                  className="btn-primary"
                  style={{ flex: 2 }}
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ PASSO 4 — Endereço ══ */}
        {passo === 4 && (
          <div className="animate-fade-up">
            <div className="glass-card-static" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.3px' }}>
                Seu endereço na web
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px' }}>
                Este será o link que você vai colocar na sua bio.
              </p>

              <div style={{ marginBottom: '24px' }}>
                <label className="form-label">Link da página</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '16px', top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '14px', color: 'var(--text-dim)', fontWeight: 500,
                  }}>
                    linkey.cloud/
                  </span>
                  <input
                    className="glass-input"
                    style={{ paddingLeft: '92px' }}
                    type="text"
                    placeholder="seunome"
                    value={form.username}
                    onChange={e => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9.]/g, '')
                      setForm(f => ({ ...f, username: val }))
                    }}
                    maxLength={25}
                  />
                </div>

                {/* Status do username */}
                <div style={{ marginTop: '12px', fontSize: '12px', paddingLeft: '2px' }}>
                  {usernameStatus === 'checking' && (
                    <span style={{ color: 'var(--text-dim)' }}>Verificando disponibilidade...</span>
                  )}
                  {usernameStatus === 'available' && (
                    <span style={{ color: 'var(--green)' }}>Endereço disponível!</span>
                  )}
                  {usernameStatus === 'taken' && (
                    <span style={{ color: 'var(--red)' }}>Este endereço já está em uso.</span>
                  )}
                  {usernameStatus === 'invalid' && (
                    <span style={{ color: 'var(--red)' }}>Use apenas letras, números e pontos (mín. 3).</span>
                  )}
                </div>
              </div>

              {erro && (
                <div style={{
                  padding: '12px', background: 'rgba(251,113,133,0.1)',
                  border: '1px solid rgba(251,113,133,0.2)', borderRadius: '10px',
                  color: 'var(--red)', fontSize: '13px', marginBottom: '20px',
                }}>
                  {erro}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setPasso(3)} className="btn-glass" style={{ flex: 1 }}>
                  Voltar
                </button>
                <button
                  onClick={handleFinalizar}
                  className="btn-primary"
                  style={{ flex: 2 }}
                  disabled={saving || usernameStatus !== 'available'}
                >
                  {saving ? 'Criando página...' : 'Finalizar minha página'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
