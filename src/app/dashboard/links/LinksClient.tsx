'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { linkEmojis, PLANOS } from '@/lib/utils'

// ─── TIPOS ───────────────────────────────────────────
interface LinkItem {
  id:        string
  emoji:     string
  titulo:    string
  url:       string
  tipo:      string
  ordem:     number
  ativo:     boolean
}

interface Props {
  links:   LinkItem[]
  pageId:  string
  plano:   string
}

const TIPOS_LINK = [
  { tipo: 'whatsapp',  label: 'WhatsApp',        emoji: '💬' },
  { tipo: 'instagram', label: 'Instagram',        emoji: '📱' },
  { tipo: 'tiktok',    label: 'TikTok',           emoji: '🎵' },
  { tipo: 'youtube',   label: 'YouTube',          emoji: '▶️' },
  { tipo: 'spotify',   label: 'Spotify',          emoji: '🎧' },
  { tipo: 'portfolio', label: 'Portfólio',        emoji: '📸' },
  { tipo: 'agenda',    label: 'Agendamento',      emoji: '📅' },
  { tipo: 'pix',       label: 'Pix',              emoji: '💰' },
  { tipo: 'maps',      label: 'Localização',      emoji: '📍' },
  { tipo: 'site',      label: 'Site',             emoji: '🌐' },
  { tipo: 'outro',     label: 'Outro',            emoji: '🔗' },
]

// Estado inicial do form de novo link
const FORM_VAZIO = { titulo: '', url: '', tipo: 'outro', emoji: '🔗' }

export default function LinksClient({ links: linksIniciais, pageId, plano }: Props) {
  const router  = useRouter()
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()

  const [links, setLinks]           = useState<LinkItem[]>(linksIniciais)
  const [modal, setModal]           = useState<'novo' | 'editar' | null>(null)
  const [linkEditando, setLinkEditando] = useState<LinkItem | null>(null)
  const [form, setForm]             = useState(FORM_VAZIO)
  const [salvando, setSalvando]     = useState(false)
  const [erro, setErro]             = useState('')
  const [deletando, setDeletando]   = useState<string | null>(null)
  const [dragging, setDragging]     = useState<string | null>(null)
  const [dragOver, setDragOver]     = useState<string | null>(null)

  const limiteLinks = PLANOS[plano as keyof typeof PLANOS]?.maxLinks ?? 5
  const atingiuLimite = links.length >= limiteLinks && plano === 'free'
  const pixBloqueado  = plano === 'free'

  // ── Abrir modal de novo link ──────────────────────
  function abrirNovo() {
    setForm(FORM_VAZIO)
    setErro('')
    setModal('novo')
  }

  // ── Abrir modal de edição ─────────────────────────
  function abrirEditar(link: LinkItem) {
    setLinkEditando(link)
    setForm({ titulo: link.titulo, url: link.url, tipo: link.tipo, emoji: link.emoji })
    setErro('')
    setModal('editar')
  }

  // ── Fechar modal ──────────────────────────────────
  function fecharModal() {
    setModal(null)
    setLinkEditando(null)
    setForm(FORM_VAZIO)
    setErro('')
  }

  // ── Validar form ──────────────────────────────────
  function validarForm(): boolean {
    if (!form.titulo.trim()) { setErro('O título é obrigatório.'); return false }
    if (!form.url.trim())    { setErro('O link/URL é obrigatório.'); return false }
    if (form.tipo !== 'pix' && form.url.trim() && !form.url.startsWith('http')) {
      setErro('URL deve começar com https:// ou http://')
      return false
    }
    return true
  }

  // ── Criar link ────────────────────────────────────
  async function handleCriar() {
    if (!validarForm()) return
    if (form.tipo === 'pix' && pixBloqueado) {
      setErro('O botão Pix é exclusivo do plano Pro. Faça upgrade para usá-lo.')
      return
    }
    setSalvando(true)
    setErro('')

    const novaOrdem = links.length

    const { data, error } = await supabase
      .from('links')
      .insert({
        page_id: pageId,
        emoji:   form.emoji,
        titulo:  form.titulo.trim(),
        url:     form.url.trim(),
        tipo:    form.tipo,
        ordem:   novaOrdem,
        ativo:   true,
      })
      .select()
      .single()

    if (error) {
      setErro('Erro ao criar link. Tente novamente.')
      setSalvando(false)
      return
    }

    setLinks(prev => [...prev, data])
    fecharModal()
    setSalvando(false)
    startTransition(() => router.refresh())
  }

  // ── Editar link ───────────────────────────────────
  async function handleEditar() {
    if (!linkEditando || !validarForm()) return
    setSalvando(true)
    setErro('')

    const { error } = await supabase
      .from('links')
      .update({
        emoji:  form.emoji,
        titulo: form.titulo.trim(),
        url:    form.url.trim(),
        tipo:   form.tipo,
      })
      .eq('id', linkEditando.id)

    if (error) {
      setErro('Erro ao salvar. Tente novamente.')
      setSalvando(false)
      return
    }

    setLinks(prev => prev.map(l =>
      l.id === linkEditando.id
        ? { ...l, ...form, titulo: form.titulo.trim(), url: form.url.trim() }
        : l
    ))
    fecharModal()
    setSalvando(false)
    startTransition(() => router.refresh())
  }

  // ── Toggle ativo/inativo ──────────────────────────
  async function handleToggle(id: string, ativo: boolean) {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, ativo } : l))
    await supabase.from('links').update({ ativo }).eq('id', id)
    startTransition(() => router.refresh())
  }

  // ── Deletar link ──────────────────────────────────
  async function handleDeletar(id: string) {
    if (!confirm('Tem certeza que quer remover este link?')) return
    setDeletando(id)

    const { error } = await supabase.from('links').delete().eq('id', id)

    if (!error) {
      setLinks(prev => prev.filter(l => l.id !== id))
      startTransition(() => router.refresh())
    }
    setDeletando(null)
  }

  // ── Drag and Drop para reordenar ──────────────────
  function handleDragStart(id: string) { setDragging(id) }
  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault()
    setDragOver(id)
  }

  async function handleDrop(targetId: string) {
    if (!dragging || dragging === targetId) {
      setDragging(null); setDragOver(null); return
    }

    const fromIndex = links.findIndex(l => l.id === dragging)
    const toIndex   = links.findIndex(l => l.id === targetId)
    if (fromIndex === -1 || toIndex === -1) return

    // Reordena localmente
    const nova = [...links]
    const [item] = nova.splice(fromIndex, 1)
    nova.splice(toIndex, 0, item)

    // Atualiza ordem
    const comOrdem = nova.map((l, i) => ({ ...l, ordem: i }))
    setLinks(comOrdem)
    setDragging(null)
    setDragOver(null)

    // Persiste no banco
    await Promise.all(
      comOrdem.map(l =>
        supabase.from('links').update({ ordem: l.ordem }).eq('id', l.id)
      )
    )
    startTransition(() => router.refresh())
  }

  // ── Quando muda o tipo, atualiza emoji e placeholder ──
  function handleTipoChange(tipo: string) {
    const tipoInfo = TIPOS_LINK.find(t => t.tipo === tipo)
    setForm(f => ({
      ...f,
      tipo,
      emoji: tipoInfo?.emoji ?? '🔗',
    }))
  }

  return (
    <div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '4px' }}>
            Meus links
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
            {links.length} de {plano === 'free' ? limiteLinks : '∞'} links
            {plano === 'free' && ` • Arraste para reordenar`}
          </p>
        </div>

        <button
          onClick={abrirNovo}
          disabled={atingiuLimite}
          style={{
            padding: '10px 20px',
            background: atingiuLimite
              ? 'rgba(255,255,255,0.07)'
              : 'linear-gradient(135deg,#7C6FFF,#9c6fff)',
            border: 'none', borderRadius: '100px',
            color: atingiuLimite ? 'rgba(255,255,255,0.4)' : '#fff',
            fontSize: '14px', fontWeight: 600,
            cursor: atingiuLimite ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            boxShadow: atingiuLimite ? 'none' : '0 4px 16px rgba(124,111,255,0.35)',
          }}
        >
          + Adicionar link
        </button>
      </div>

      {/* Banner limite atingido */}
      {atingiuLimite && (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(255,213,128,0.1)',
          border: '1px solid rgba(255,213,128,0.25)',
          borderRadius: '14px',
          marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{ fontSize: '20px' }}>⭐</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>
              Limite de {limiteLinks} links atingido
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
              Faça upgrade para o Pro e adicione links ilimitados.
            </div>
          </div>
          <a
            href="/dashboard/planos"
            style={{
              marginLeft: 'auto', padding: '8px 18px',
              background: 'rgba(255,213,128,0.2)',
              border: '1px solid rgba(255,213,128,0.35)',
              borderRadius: '100px',
              color: '#FFD580', fontSize: '13px', fontWeight: 600,
              textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            Ver planos →
          </a>
        </div>
      )}

      {/* Lista de links */}
      {links.length === 0 ? (
        <div style={{
          padding: '48px 24px', textAlign: 'center',
          background: 'rgba(255,255,255,0.04)',
          border: '1px dashed rgba(255,255,255,0.12)',
          borderRadius: '20px',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔗</div>
          <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
            Nenhum link ainda
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '20px' }}>
            Adicione seu primeiro link para aparecer na sua página
          </div>
          <button
            onClick={abrirNovo}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg,#7C6FFF,#9c6fff)',
              border: 'none', borderRadius: '100px',
              color: '#fff', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            + Adicionar primeiro link
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {links.map((link, i) => (
            <div
              key={link.id}
              draggable
              onDragStart={() => handleDragStart(link.id)}
              onDragOver={e => handleDragOver(e, link.id)}
              onDrop={() => handleDrop(link.id)}
              onDragEnd={() => { setDragging(null); setDragOver(null) }}
              className="animate-fade-up"
              style={{
                animationDelay: `${i * 40}ms`,
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 16px',
                background: dragOver === link.id
                  ? 'rgba(124,111,255,0.12)'
                  : 'rgba(255,255,255,0.06)',
                border: `1px solid ${dragOver === link.id
                  ? 'rgba(124,111,255,0.35)'
                  : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '16px',
                opacity: dragging === link.id ? 0.5 : link.ativo ? 1 : 0.55,
                transition: 'all 0.2s',
                cursor: 'grab',
              }}
            >
              {/* Handle drag */}
              <div style={{
                color: 'rgba(255,255,255,0.2)',
                fontSize: '16px', cursor: 'grab',
                userSelect: 'none', flexShrink: 0,
              }}>
                ⠿
              </div>

              {/* Emoji */}
              <div style={{
                width: '40px', height: '40px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', flexShrink: 0,
              }}>
                {link.emoji}
              </div>

              {/* Info */}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{
                  fontSize: '14px', fontWeight: 600,
                  marginBottom: '2px',
                  color: link.ativo ? '#fff' : 'rgba(255,255,255,0.5)',
                }}>
                  {link.titulo}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.3)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {link.url}
                </div>
              </div>

              {/* Badge inativo */}
              {!link.ativo && (
                <span style={{
                  padding: '3px 8px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '100px',
                  fontSize: '10px', fontWeight: 600,
                  color: 'rgba(255,255,255,0.35)',
                  flexShrink: 0,
                }}>
                  OCULTO
                </span>
              )}

              {/* Ações */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>

                {/* Toggle */}
                <button
                  onClick={() => handleToggle(link.id, !link.ativo)}
                  title={link.ativo ? 'Ocultar link' : 'Mostrar link'}
                  style={{
                    width: '40px', height: '24px',
                    borderRadius: '100px',
                    background: link.ativo
                      ? 'linear-gradient(135deg,#7C6FFF,#9c6fff)'
                      : 'rgba(255,255,255,0.12)',
                    border: 'none', cursor: 'pointer',
                    position: 'relative', flexShrink: 0,
                    transition: 'all 0.3s',
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    width: '18px', height: '18px',
                    background: 'white', borderRadius: '50%',
                    top: '3px',
                    left: link.ativo ? '19px' : '3px',
                    transition: 'left 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }} />
                </button>

                {/* Editar */}
                <button
                  onClick={() => abrirEditar(link)}
                  title="Editar link"
                  style={{
                    width: '34px', height: '34px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: '14px',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                >
                  ✏️
                </button>

                {/* Deletar */}
                <button
                  onClick={() => handleDeletar(link.id)}
                  disabled={deletando === link.id}
                  title="Remover link"
                  style={{
                    width: '34px', height: '34px',
                    borderRadius: '10px',
                    background: 'rgba(255,100,100,0.08)',
                    border: '1px solid rgba(255,100,100,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: '14px',
                    transition: 'all 0.2s',
                    opacity: deletando === link.id ? 0.5 : 1,
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,100,100,0.18)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,100,100,0.08)'}
                >
                  {deletando === link.id ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>
          ))}

          {/* Dica drag */}
          <p style={{
            textAlign: 'center', fontSize: '12px',
            color: 'rgba(255,255,255,0.25)', marginTop: '8px',
          }}>
            ⠿ Arraste os links para reordenar
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════════════ */}
      {/* MODAL — Novo / Editar link                        */}
      {/* ══════════════════════════════════════════════════ */}
      {modal && (
        <div
          onClick={fecharModal}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            padding: '0',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="animate-scale-in modal-content"
            style={{
              width: '100%', maxWidth: '480px',
              background: 'rgba(18,18,28,0.98)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '24px 24px 0 0',
              padding: '28px',
              backdropFilter: 'blur(40px)',
              boxShadow: '0 -20px 60px rgba(0,0,0,0.6)',
              maxHeight: '92dvh',
              overflowY: 'auto',
              paddingBottom: 'calc(28px + env(safe-area-inset-bottom))',
            }}
          >
            {/* Header modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
                {modal === 'novo' ? '+ Novo link' : '✏️ Editar link'}
              </h3>
              <button
                onClick={fecharModal}
                style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Tipo de link */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>
                  Tipo de link
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '6px',
                }}>
                  {TIPOS_LINK.map(t => {
                    const isPix     = t.tipo === 'pix'
                    const bloqueado = isPix && pixBloqueado
                    const ativo     = form.tipo === t.tipo
                    return (
                      <div key={t.tipo} style={{ position: 'relative' }}>
                        <button
                          onClick={() => {
                            if (bloqueado) return
                            handleTipoChange(t.tipo)
                          }}
                          title={bloqueado ? 'Disponível no plano Pro' : t.label}
                          style={{
                            width: '100%',
                            padding: '8px 6px',
                            borderRadius: '10px',
                            border: `1px solid ${ativo
                              ? 'rgba(124,111,255,0.5)'
                              : bloqueado
                                ? 'rgba(255,213,128,0.2)'
                                : 'rgba(255,255,255,0.08)'}`,
                            background: ativo
                              ? 'rgba(124,111,255,0.18)'
                              : bloqueado
                                ? 'rgba(255,213,128,0.05)'
                                : 'rgba(255,255,255,0.04)',
                            color: ativo
                              ? '#b4aeff'
                              : bloqueado
                                ? 'rgba(255,213,128,0.4)'
                                : 'rgba(255,255,255,0.5)',
                            fontSize: '11px',
                            cursor: bloqueado ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: '4px',
                            transition: 'all 0.15s',
                            opacity: bloqueado ? 0.6 : 1,
                          }}
                        >
                          <span style={{ fontSize: '18px' }}>{t.emoji}</span>
                          <span>{t.label}</span>
                        </button>
                        {/* Badge ⭐ Pro */}
                        {bloqueado && (
                          <span style={{
                            position: 'absolute', top: '-6px', right: '-4px',
                            fontSize: '10px', lineHeight: 1,
                            background: 'rgba(255,213,128,0.15)',
                            border: '1px solid rgba(255,213,128,0.3)',
                            color: '#FFD580',
                            borderRadius: '100px',
                            padding: '2px 5px',
                            fontWeight: 700,
                            pointerEvents: 'none',
                          }}>
                            Pro
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Banner upgrade Pix */}
              {pixBloqueado && form.tipo === 'pix' && (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(255,213,128,0.08)',
                  border: '1px solid rgba(255,213,128,0.25)',
                  borderRadius: '12px',
                  fontSize: '13px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <span style={{ fontSize: '18px' }}>⭐</span>
                  <div>
                    <div style={{ fontWeight: 600, color: '#FFD580', marginBottom: '2px' }}>
                      Pix nativo é exclusivo do plano Pro
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>
                      Faça upgrade e receba pagamentos direto na sua página.
                    </div>
                  </div>
                  <a
                    href="/dashboard/planos"
                    style={{
                      marginLeft: 'auto', padding: '7px 14px',
                      background: 'rgba(255,213,128,0.15)',
                      border: '1px solid rgba(255,213,128,0.3)',
                      borderRadius: '100px',
                      color: '#FFD580', fontSize: '12px', fontWeight: 600,
                      textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                    }}
                  >
                    Ver Pro →
                  </a>
                </div>
              )}

              {/* Título */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                  Título do botão *
                </label>
                <input
                  className="glass-input"
                  value={form.titulo}
                  onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                  placeholder={
                    form.tipo === 'whatsapp'  ? 'Ex: Chamar no WhatsApp' :
                    form.tipo === 'instagram' ? 'Ex: Me siga no Instagram' :
                    form.tipo === 'portfolio' ? 'Ex: Ver meu portfólio' :
                    form.tipo === 'agenda'    ? 'Ex: Agendar horário' :
                    form.tipo === 'pix'       ? 'Ex: Pagar via Pix' :
                    form.tipo === 'maps'      ? 'Ex: Como chegar' :
                    'Título que aparece no botão'
                  }
                  maxLength={50}
                  autoFocus
                />
              </div>

              {/* URL / Chave */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                  {form.tipo === 'pix' ? 'Chave Pix' : 'Link / URL *'}
                </label>
                <input
                  className="glass-input"
                  type={form.tipo === 'pix' ? 'text' : 'url'}
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  placeholder={
                    form.tipo === 'whatsapp'  ? 'https://wa.me/5511999998888' :
                    form.tipo === 'instagram' ? 'https://instagram.com/seuperfil' :
                    form.tipo === 'tiktok'    ? 'https://tiktok.com/@seuperfil' :
                    form.tipo === 'youtube'   ? 'https://youtube.com/@seucanal' :
                    form.tipo === 'spotify'   ? 'https://open.spotify.com/artist/...' :
                    form.tipo === 'pix'       ? 'CPF, CNPJ, email ou telefone' :
                    form.tipo === 'maps'      ? 'https://maps.app.goo.gl/...' :
                    'https://...'
                  }
                />
                {form.tipo === 'whatsapp' && (
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                    💡 Formato: https://wa.me/5511999998888 (com DDI+DDD+número)
                  </p>
                )}
              </div>

              {/* Emoji customizado */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                  Emoji do botão
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px',
                  }}>
                    {form.emoji}
                  </div>
                  <input
                    className="glass-input"
                    value={form.emoji}
                    onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                    placeholder="Cole um emoji"
                    maxLength={4}
                    style={{ maxWidth: '120px' }}
                  />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                    Cole qualquer emoji do teclado
                  </span>
                </div>
              </div>

              {/* Erro */}
              {erro && (
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(255,111,111,0.12)',
                  border: '1px solid rgba(255,111,111,0.25)',
                  borderRadius: '10px',
                  fontSize: '13px', color: '#ff9696',
                }}>
                  ⚠️ {erro}
                </div>
              )}

              {/* Botões */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  onClick={fecharModal}
                  style={{
                    flex: 1, padding: '12px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={modal === 'novo' ? handleCriar : handleEditar}
                  disabled={salvando}
                  style={{
                    flex: 2, padding: '12px',
                    background: 'linear-gradient(135deg,#7C6FFF,#9c6fff)',
                    border: 'none', borderRadius: '12px',
                    color: '#fff', fontSize: '14px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                    opacity: salvando ? 0.7 : 1,
                    boxShadow: '0 4px 16px rgba(124,111,255,0.35)',
                  }}
                >
                  {salvando
                    ? '⏳ Salvando...'
                    : modal === 'novo' ? '+ Adicionar link' : '💾 Salvar alterações'
                  }
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}
