'use client'

import { useState, useRef, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PhonePreview from '@/components/blocks/PhonePreview'

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
  tipo:  string
  ativo: boolean
}

interface Props {
  page:      PageData
  links:     LinkData[]
  profissao: string
  plano:     string
  userId:    string
}

const CORES_DESTAQUE = [
  '#7C6FFF', '#FF6FBD', '#6FFFE9', '#FFD580',
  '#6FFF96', '#FF6F6F', '#ffffff', '#4FC3F7',
]

const TEMAS = [
  { label: 'Dark',      cor: '#0a0a0f', pro: false },
  { label: 'Midnight',  cor: '#080818', pro: false },
  { label: 'Noir',      cor: '#080808', pro: true  },
  { label: 'Violeta',   cor: '#0f0a1a', pro: true  },
  { label: 'Forest',    cor: '#0a140a', pro: true  },
  { label: 'Ocean',     cor: '#0a0f18', pro: true  },
]

export default function EditorClient({ page, links, profissao, plano, userId }: Props) {
  const router   = useRouter()
  const supabase = createClient()
  const fileRef  = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()

  // Form state — inicializado com dados do banco
  const [titulo,      setTitulo]      = useState(page.titulo)
  const [subtitulo,   setSubtitulo]   = useState(page.subtitulo ?? '')
  const [cidade,      setCidade]      = useState(page.cidade ?? '')
  const [corDestaque, setCorDestaque] = useState(page.cor_destaque)
  const [temaCor,     setTemaCor]     = useState(page.tema_cor)
  const [fotoUrl,     setFotoUrl]     = useState(page.foto_url)

  // Upload
  const [uploading,  setUploading]  = useState(false)
  const [uploadErro, setUploadErro] = useState('')

  // Save
  const [salvando,   setSalvando]   = useState(false)
  const [salvoOk,    setSalvoOk]    = useState(false)
  const [erroSave,   setErroSave]   = useState('')

  // Detecta mudanças não salvas
  const [alterado, setAlterado] = useState(false)
  useEffect(() => { setAlterado(true) }, [titulo, subtitulo, cidade, corDestaque, temaCor, fotoUrl])
  useEffect(() => { setAlterado(false) }, []) // reset no mount

  // ── Upload de foto ──────────────────────────────────
  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setUploadErro('Foto deve ter menos de 5MB.')
      return
    }

    setUploading(true)
    setUploadErro('')

    const ext      = file.name.split('.').pop()
    const caminho  = `${userId}/avatar.${ext}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(caminho, file, { upsert: true })

    if (error) {
      setUploadErro('Erro ao enviar foto. Tente novamente.')
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(caminho)

    // Adiciona timestamp para invalidar cache
    setFotoUrl(`${publicUrl}?t=${Date.now()}`)
    setUploading(false)
  }

  // ── Remover foto ─────────────────────────────────────
  async function handleRemoverFoto() {
    setFotoUrl(null)
  }

  // ── Salvar alterações ────────────────────────────────
  async function handleSalvar() {
    if (!titulo.trim()) {
      setErroSave('O nome não pode estar vazio.')
      return
    }

    setSalvando(true)
    setErroSave('')

    const { error } = await supabase
      .from('pages')
      .update({
        titulo:       titulo.trim(),
        subtitulo:    subtitulo.trim() || null,
        cidade:       cidade.trim()    || null,
        foto_url:     fotoUrl,
        cor_destaque: corDestaque,
        tema_cor:     temaCor,
      })
      .eq('id', page.id)

    if (error) {
      setErroSave('Erro ao salvar. Tente novamente.')
      setSalvando(false)
      return
    }

    setSalvoOk(true)
    setAlterado(false)
    setSalvando(false)
    setTimeout(() => setSalvoOk(false), 3000)

    startTransition(() => router.refresh())
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '4px' }}>
            Editor de página
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
            Edite e veja o preview ao vivo
          </p>
        </div>

        {/* Botão salvar */}
        <button
          onClick={handleSalvar}
          disabled={salvando || !alterado}
          style={{
            padding: '10px 24px',
            background: salvoOk
              ? 'rgba(111,255,150,0.2)'
              : alterado
                ? 'linear-gradient(135deg,#7C6FFF,#9c6fff)'
                : 'rgba(255,255,255,0.07)',
            border: salvoOk
              ? '1px solid rgba(111,255,150,0.4)'
              : 'none',
            borderRadius: '100px',
            color: salvoOk ? '#6fff96' : '#fff',
            fontSize: '14px', fontWeight: 600,
            cursor: alterado ? 'pointer' : 'default',
            opacity: salvando ? 0.7 : 1,
            transition: 'all 0.3s',
            boxShadow: alterado && !salvoOk ? '0 4px 16px rgba(124,111,255,0.35)' : 'none',
            fontFamily: 'inherit',
          }}
        >
          {salvando ? '⏳ Salvando...' : salvoOk ? '✅ Salvo!' : alterado ? '💾 Salvar alterações' : '✓ Sem alterações'}
        </button>
      </div>

      {/* Layout: form + preview */}
      <div className="editor-layout" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

        {/* Formulário */}
        <div className="editor-form" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* ─ Foto de perfil ─ */}
          <div style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>
              Foto de perfil
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Avatar atual */}
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: fotoUrl ? 'transparent' : `linear-gradient(135deg,${corDestaque},${corDestaque}88)`,
                overflow: 'hidden', flexShrink: 0,
                border: `2px solid ${corDestaque}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px',
              }}>
                {fotoUrl
                  ? <img src={fotoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : profissaoEmoji(profissao)
                }
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleFoto}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(124,111,255,0.15)',
                    border: '1px solid rgba(124,111,255,0.25)',
                    borderRadius: '100px',
                    color: '#b4aeff',
                    fontSize: '13px', fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  {uploading ? '⏳ Enviando...' : '📷 Trocar foto'}
                </button>

                {fotoUrl && (
                  <button
                    onClick={handleRemoverFoto}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(255,111,111,0.1)',
                      border: '1px solid rgba(255,111,111,0.2)',
                      borderRadius: '100px',
                      color: '#ff9696',
                      fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    🗑️ Remover
                  </button>
                )}

                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                  JPG, PNG ou WebP • máx. 5MB
                </span>
              </div>
            </div>

            {uploadErro && (
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#ff9696' }}>
                ⚠️ {uploadErro}
              </div>
            )}
          </div>

          {/* ─ Informações ─ */}
          <div style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>
              Informações
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                  Nome *
                </label>
                <input
                  className="glass-input"
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  placeholder="Seu nome ou nome artístico"
                  maxLength={50}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                  Especialidade / Bio
                </label>
                <input
                  className="glass-input"
                  value={subtitulo}
                  onChange={e => setSubtitulo(e.target.value)}
                  placeholder="Descreva seu trabalho em uma linha"
                  maxLength={80}
                />
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '4px', textAlign: 'right' }}>
                  {subtitulo.length}/80
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                  Cidade
                </label>
                <input
                  className="glass-input"
                  value={cidade}
                  onChange={e => setCidade(e.target.value)}
                  placeholder="Ex: São Paulo, SP"
                  maxLength={40}
                />
              </div>
            </div>
          </div>

          {/* ─ Aparência ─ */}
          <div style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>
              Aparência
            </div>

            {/* Cor de destaque */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>
                Cor de destaque
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {CORES_DESTAQUE.map(cor => (
                  <button
                    key={cor}
                    onClick={() => setCorDestaque(cor)}
                    title={cor}
                    style={{
                      width: '36px', height: '36px',
                      borderRadius: '50%',
                      background: cor,
                      border: corDestaque === cor
                        ? '3px solid white'
                        : cor === '#ffffff'
                          ? '2px solid rgba(255,255,255,0.3)'
                          : '2px solid transparent',
                      cursor: 'pointer',
                      transform: corDestaque === cor ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 0.2s',
                      boxShadow: corDestaque === cor ? `0 4px 12px ${cor}66` : 'none',
                    }}
                  />
                ))}
                {/* Input de cor customizada */}
                <label style={{
                  width: '36px', height: '36px',
                  borderRadius: '50%',
                  border: '2px dashed rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: '16px',
                  position: 'relative', overflow: 'hidden',
                }} title="Cor personalizada">
                  +
                  <input
                    type="color"
                    value={corDestaque}
                    onChange={e => setCorDestaque(e.target.value)}
                    style={{
                      position: 'absolute', inset: 0,
                      opacity: 0, cursor: 'pointer', width: '100%',
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Tema de fundo */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>
                Fundo
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {TEMAS.map(tema => {
                  const bloqueado = tema.pro && plano === 'free'
                  const ativo     = temaCor === tema.cor
                  return (
                    <div key={tema.cor} style={{ position: 'relative' }}>
                      <button
                        onClick={() => {
                          if (bloqueado) return
                          setTemaCor(tema.cor)
                        }}
                        title={bloqueado ? `${tema.label} — exclusivo Pro` : tema.label}
                        style={{
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', gap: '5px',
                          background: 'none', border: 'none',
                          cursor: bloqueado ? 'not-allowed' : 'pointer',
                          padding: '4px',
                          opacity: bloqueado ? 0.5 : 1,
                          transition: 'opacity 0.2s',
                        }}
                      >
                        <div style={{
                          width: '36px', height: '36px',
                          borderRadius: '10px',
                          background: tema.cor,
                          border: ativo
                            ? '2.5px solid white'
                            : bloqueado
                              ? '2px solid rgba(255,213,128,0.3)'
                              : '2px solid rgba(255,255,255,0.15)',
                          transform: ativo ? 'scale(1.15)' : 'scale(1)',
                          transition: 'all 0.2s',
                          boxShadow: ativo ? '0 4px 12px rgba(0,0,0,0.5)' : 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {bloqueado && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                              stroke="rgba(255,213,128,0.7)" strokeWidth="2.5"
                              strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="11" width="18" height="11" rx="2"/>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                          )}
                        </div>
                        <span style={{
                          fontSize: '10px',
                          color: ativo
                            ? '#fff'
                            : bloqueado
                              ? 'rgba(255,213,128,0.5)'
                              : 'rgba(255,255,255,0.35)',
                        }}>
                          {tema.label}
                        </span>
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Banner upgrade temas — só free */}
              {plano === 'free' && (
                <a
                  href="/dashboard/planos"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginTop: '10px',
                    padding: '10px 14px',
                    background: 'rgba(255,213,128,0.06)',
                    border: '1px solid rgba(255,213,128,0.2)',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '12px', color: 'rgba(255,213,128,0.8)',
                    transition: 'background 0.2s',
                  }}
                >
                  <span>⭐</span>
                  <span>Desbloqueie Noir, Violeta, Forest e Ocean no <strong style={{ color: '#FFD580' }}>Pro</strong></span>
                  <span style={{ marginLeft: 'auto', opacity: 0.6 }}>→</span>
                </a>
              )}
            </div>
          </div>

          {/* Erro de save */}
          {erroSave && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255,111,111,0.12)',
              border: '1px solid rgba(255,111,111,0.25)',
              borderRadius: '12px',
              fontSize: '13px', color: '#ff9696',
            }}>
              ⚠️ {erroSave}
            </div>
          )}

          {/* Botão salvar mobile */}
          <button
            onClick={handleSalvar}
            disabled={salvando || !alterado}
            style={{
              width: '100%', padding: '14px',
              background: alterado
                ? 'linear-gradient(135deg,#7C6FFF,#9c6fff)'
                : 'rgba(255,255,255,0.07)',
              border: 'none', borderRadius: '14px',
              color: '#fff', fontSize: '15px', fontWeight: 600,
              cursor: alterado ? 'pointer' : 'default',
              opacity: salvando ? 0.7 : 1,
              fontFamily: 'inherit',
              boxShadow: alterado ? '0 4px 20px rgba(124,111,255,0.35)' : 'none',
              transition: 'all 0.3s',
            }}
          >
            {salvando ? '⏳ Salvando...' : salvoOk ? '✅ Salvo com sucesso!' : '💾 Salvar alterações'}
          </button>

        </div>

        {/* Preview do celular */}
        <div className="editor-preview">
        <PhonePreview
          titulo={titulo}
          subtitulo={subtitulo || null}
          cidade={cidade || null}
          fotoUrl={fotoUrl}
          corDestaque={corDestaque}
          temaCor={temaCor}
          profissao={profissao}
          links={links}
          plano={plano}
        />
        </div>
      </div>
    </div>
  )
}

function profissaoEmoji(p: string): string {
  const m: Record<string, string> = {
    musico: '🎵', tatuador: '🎨', cabeleireiro: '💇',
    corretor: '🏠', personal: '💪', fotografo: '📸', outro: '⭐',
  }
  return m[p] ?? '⭐'
}
