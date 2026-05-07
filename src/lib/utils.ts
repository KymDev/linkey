// src/lib/utils.ts

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Combina classes Tailwind sem conflito
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formata número: 1284 → "1.284"
export function formatNumber(n: number): string {
  return n.toLocaleString('pt-BR')
}

// Formata data: "2 abr. 2026"
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Gera URL da foto no Supabase Storage
export function avatarUrl(userId: string, fileName: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${userId}/${fileName}`
}

// Valida username: só letras minúsculas, números, _ e -
export function isValidUsername(username: string): boolean {
  return /^[a-z0-9_-]{3,30}$/.test(username)
}

// ─── NICHOS ──────────────────────────────────────────────────────────────────
// Cada nicho agrupa profissões relacionadas
export const nichos: Array<{
  id: string
  label: string
  profissoes: string[]
}> = [
  {
    id: 'tech',
    label: 'Tecnologia',
    profissoes: ['dev_frontend', 'dev_backend', 'dev_fullstack', 'designer_ux', 'designer_grafico', 'data_analyst', 'devops'],
  },
  {
    id: 'criativo',
    label: 'Criativo & Mídia',
    profissoes: ['fotografo', 'filmmaker', 'editor_video', 'musico', 'podcaster', 'streamer'],
  },
  {
    id: 'beleza',
    label: 'Beleza & Estética',
    profissoes: ['cabeleireiro', 'maquiador', 'esteticista', 'tatuador', 'nail_designer', 'barbeiro'],
  },
  {
    id: 'saude',
    label: 'Saúde & Bem-estar',
    profissoes: ['personal', 'nutricionista', 'psicologo', 'medico', 'fisioterapeuta'],
  },
  {
    id: 'negocios',
    label: 'Negócios & Serviços',
    profissoes: ['corretor', 'advogado', 'contador', 'consultor', 'coach'],
  },
  {
    id: 'allstar',
    label: 'All-Star',
    profissoes: ['atleta_futebol', 'lutador', 'musico_allstar', 'ator_influencer', 'nadador_atletismo', 'escritor_autor', 'empresa_marca'],
  },
  {
    id: 'outro',
    label: 'Outro',
    profissoes: ['outro'],
  },
]

// Nome legível por tipo de profissão (sem emojis)
export const profissaoNomes: Record<string, string> = {
  // Tech
  dev_frontend:    'Dev Frontend',
  dev_backend:     'Dev Backend',
  dev_fullstack:   'Dev Fullstack',
  designer_ux:     'Designer UX/UI',
  designer_grafico:'Designer Gráfico',
  data_analyst:    'Analista de Dados',
  devops:          'DevOps / Infra',
  // Criativo
  fotografo:       'Fotógrafo',
  filmmaker:       'Filmmaker / Videomaker',
  editor_video:    'Editor de Vídeo',
  musico:          'Músico / Banda',
  podcaster:       'Podcaster',
  streamer:        'Streamer / Creator',
  // Beleza
  cabeleireiro:    'Cabeleireiro',
  maquiador:       'Maquiador(a)',
  esteticista:     'Esteticista',
  tatuador:        'Tatuador',
  nail_designer:   'Nail Designer',
  barbeiro:        'Barbeiro',
  // Saúde
  personal:        'Personal Trainer',
  nutricionista:   'Nutricionista',
  psicologo:       'Psicólogo',
  medico:          'Médico',
  fisioterapeuta:  'Fisioterapeuta',
  // Negócios
  corretor:        'Corretor de Imóveis',
  advogado:        'Advogado',
  contador:        'Contador',
  consultor:       'Consultor',
  coach:           'Coach',
  // All-Star
  atleta_futebol:    'Jogador de Futebol',
  lutador:           'Lutador (MMA / UFC / Boxe)',
  musico_allstar:    'Músico / Artista',
  ator_influencer:   'Ator / Influencer',
  nadador_atletismo: 'Atleta (Natação / Atletismo)',
  escritor_autor:    'Escritor / Autor',
  empresa_marca:     'Empresa / Marca',
  // Outro
  outro:           'Outra profissão',
}

// SVG icon por profissão (retorna string SVG inline)
export const profissaoIcones: Record<string, string> = {
  // Tech
  dev_frontend:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  dev_backend:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8l2 2-2 2M11 12h4"/></svg>`,
  dev_fullstack:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><polyline points="7 8 9 10 7 12"/><line x1="11" y1="12" x2="15" y2="12"/></svg>`,
  designer_ux:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M3 9h3M3 15h3M18 9h3M18 15h3M9 3v3M15 3v3M9 18v3M15 18v3"/></svg>`,
  designer_grafico:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 20a7 7 0 1 1 7-7"/></svg>`,
  data_analyst:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  devops:          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3a9 9 0 0 1 9 9"/><path d="M12 3v4M12 3l-3 3"/><path d="M3 12a9 9 0 0 0 9 9"/><path d="M21 12h-4M21 12l-3-3"/><path d="M12 21v-4M12 21l3-3"/></svg>`,
  // Criativo
  fotografo:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  filmmaker:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="15" height="12" rx="2"/><polygon points="17 9 22 6 22 18 17 15"/></svg>`,
  editor_video:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/><line x1="4" y1="20" x2="4" y2="22"/><line x1="8" y1="20" x2="8" y2="22"/><line x1="12" y1="20" x2="12" y2="22"/></svg>`,
  musico:          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  podcaster:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
  streamer:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 2H3v16h5v4l4-4h5l4-4V2z"/><line x1="9.5" y1="8" x2="9.5" y2="14"/><line x1="14.5" y1="8" x2="14.5" y2="14"/></svg>`,
  // Beleza
  cabeleireiro:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
  maquiador:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  esteticista:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  tatuador:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`,
  nail_designer:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 13v-2a4 4 0 0 1 8 0v2"/><rect x="5" y="13" width="14" height="8" rx="2"/><path d="M12 17v2"/></svg>`,
  barbeiro:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"/><path d="M3 21h18"/><path d="M7 10h10"/></svg>`,
  // Saúde
  personal:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  nutricionista:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>`,
  psicologo:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  medico:          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  fisioterapeuta:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="5" r="2"/><path d="M5 22v-5l2-3 5 3 5-3 2 3v5"/><path d="M12 10v5"/></svg>`,
  // Negócios
  corretor:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  advogado:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>`,
  contador:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="11" y2="12"/></svg>`,
  consultor:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  coach:           `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  // All-Star
  atleta_futebol:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 6.5 17.5M12 2a10 10 0 0 0-6.5 17.5M2.5 9h19M2.5 15h19M12 2v20"/></svg>`,
  lutador:           `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="4" width="12" height="10" rx="6"/><path d="M4 9h2M18 9h2"/><path d="M8 20h8M10 14v6M14 14v6"/></svg>`,
  musico_allstar:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  ator_influencer:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  nadador_atletismo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="5" r="2"/><path d="M10 22c1-1.5 2-2 2-2s1 .5 2 2M5 22c.5-1 2-2.5 3.5-2.5S11 21 12 22M7 13l1-4 4 2 2-4"/><path d="M4 18c1-1 2.5-2 4-2s2.5 1 4 1 3-1 4-2"/></svg>`,
  escritor_autor:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>`,
  empresa_marca:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  // Outro
  outro:           `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
}

// Temas por profissão
export const temasPorProfissao: Record<string, { cor: string; destaque: string }> = {
  // Tech
  dev_frontend:    { cor: '#080d14', destaque: '#4FC3F7' },
  dev_backend:     { cor: '#080d14', destaque: '#6FFF96' },
  dev_fullstack:   { cor: '#080d14', destaque: '#7C6FFF' },
  designer_ux:     { cor: '#0a0a14', destaque: '#FF6FBD' },
  designer_grafico:{ cor: '#0a0a14', destaque: '#FFD580' },
  data_analyst:    { cor: '#080d14', destaque: '#6FFFE9' },
  devops:          { cor: '#080d14', destaque: '#6FFF96' },
  // Criativo
  fotografo:       { cor: '#0a0a0a', destaque: '#FFD580' },
  filmmaker:       { cor: '#0a0808', destaque: '#FF6F6F' },
  editor_video:    { cor: '#0a0808', destaque: '#FF9F6F' },
  musico:          { cor: '#0a0a14', destaque: '#7C6FFF' },
  podcaster:       { cor: '#0a0a14', destaque: '#6FFFE9' },
  streamer:        { cor: '#0a0814', destaque: '#9c6fff' },
  // Beleza
  cabeleireiro:    { cor: '#0f0a14', destaque: '#FF6FBD' },
  maquiador:       { cor: '#0f0a14', destaque: '#FFB3D9' },
  esteticista:     { cor: '#0f0a14', destaque: '#FF6FBD' },
  tatuador:        { cor: '#080808', destaque: '#ffffff' },
  nail_designer:   { cor: '#0f0a14', destaque: '#FF8FB3' },
  barbeiro:        { cor: '#080808', destaque: '#4FC3F7' },
  // Saúde
  personal:        { cor: '#0a140a', destaque: '#6FFF96' },
  nutricionista:   { cor: '#0a140a', destaque: '#6FFFE9' },
  psicologo:       { cor: '#0a0f14', destaque: '#7C6FFF' },
  medico:          { cor: '#0a0f14', destaque: '#4FC3F7' },
  fisioterapeuta:  { cor: '#0a140a', destaque: '#6FFF96' },
  // Negócios
  corretor:        { cor: '#0a0f14', destaque: '#4FC3F7' },
  advogado:        { cor: '#0a0f0a', destaque: '#6FFF96' },
  contador:        { cor: '#0a0f14', destaque: '#4FC3F7' },
  consultor:       { cor: '#0a0f14', destaque: '#FFD580' },
  coach:           { cor: '#0a0f14', destaque: '#FF6F6F' },
  // All-Star
  atleta_futebol:    { cor: '#0a0f0a', destaque: '#FFD700' },
  lutador:           { cor: '#0a0808', destaque: '#FF4500' },
  musico_allstar:    { cor: '#0a0a14', destaque: '#C084FC' },
  ator_influencer:   { cor: '#0f0a14', destaque: '#F472B6' },
  nadador_atletismo: { cor: '#080d14', destaque: '#4FC3F7' },
  escritor_autor:    { cor: '#0a0f0a', destaque: '#6FFF96' },
  empresa_marca:     { cor: '#080d14', destaque: '#FFD700' },
  // Outro
  outro:           { cor: '#0a0a0f', destaque: '#7C6FFF' },
}

// Links sugeridos por profissão
export const linksSugeridos: Record<string, Array<{
  tipo: string; titulo: string; placeholder: string
}>> = {
  dev_frontend: [
    { tipo: 'site',      titulo: 'Portfólio',          placeholder: 'https://meuportfolio.dev' },
    { tipo: 'outro',     titulo: 'GitHub',              placeholder: 'https://github.com/...' },
    { tipo: 'outro',     titulo: 'LinkedIn',            placeholder: 'https://linkedin.com/in/...' },
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'outro',     titulo: 'CodePen / Behance',   placeholder: 'https://...' },
  ],
  dev_backend: [
    { tipo: 'outro',     titulo: 'GitHub',              placeholder: 'https://github.com/...' },
    { tipo: 'outro',     titulo: 'LinkedIn',            placeholder: 'https://linkedin.com/in/...' },
    { tipo: 'site',      titulo: 'Portfólio / Blog',    placeholder: 'https://...' },
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
  ],
  dev_fullstack: [
    { tipo: 'site',      titulo: 'Portfólio',           placeholder: 'https://...' },
    { tipo: 'outro',     titulo: 'GitHub',              placeholder: 'https://github.com/...' },
    { tipo: 'outro',     titulo: 'LinkedIn',            placeholder: 'https://linkedin.com/in/...' },
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'agenda',    titulo: 'Agendar consultoria', placeholder: 'https://calendly.com/...' },
  ],
  designer_ux: [
    { tipo: 'portfolio', titulo: 'Portfólio Figma/Behance', placeholder: 'https://behance.net/...' },
    { tipo: 'outro',     titulo: 'LinkedIn',            placeholder: 'https://linkedin.com/in/...' },
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'agenda',    titulo: 'Agendar reunião',     placeholder: 'https://calendly.com/...' },
  ],
  designer_grafico: [
    { tipo: 'portfolio', titulo: 'Portfólio',           placeholder: 'https://behance.net/...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  data_analyst: [
    { tipo: 'outro',     titulo: 'LinkedIn',            placeholder: 'https://linkedin.com/in/...' },
    { tipo: 'outro',     titulo: 'GitHub / Kaggle',     placeholder: 'https://github.com/...' },
    { tipo: 'site',      titulo: 'Dashboard / Blog',    placeholder: 'https://...' },
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
  ],
  devops: [
    { tipo: 'outro',     titulo: 'GitHub',              placeholder: 'https://github.com/...' },
    { tipo: 'outro',     titulo: 'LinkedIn',            placeholder: 'https://linkedin.com/in/...' },
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'site',      titulo: 'Blog técnico',        placeholder: 'https://...' },
  ],
  fotografo: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'portfolio', titulo: 'Portfólio',           placeholder: 'https://...' },
    { tipo: 'agenda',    titulo: 'Agendar ensaio',      placeholder: 'https://...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  filmmaker: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'youtube',   titulo: 'Showreel no YouTube', placeholder: 'https://youtube.com/...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'portfolio', titulo: 'Portfólio',           placeholder: 'https://...' },
    { tipo: 'agenda',    titulo: 'Orçar projeto',       placeholder: 'https://...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  editor_video: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'youtube',   titulo: 'Showreel',            placeholder: 'https://youtube.com/...' },
    { tipo: 'portfolio', titulo: 'Portfólio',           placeholder: 'https://...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  musico: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'spotify',   titulo: 'Spotify',             placeholder: 'https://open.spotify.com/...' },
    { tipo: 'youtube',   titulo: 'YouTube',             placeholder: 'https://youtube.com/...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'agenda',    titulo: 'Contratar para shows',placeholder: 'https://...' },
    { tipo: 'pix',       titulo: 'Apoio via Pix',       placeholder: 'Chave Pix' },
  ],
  podcaster: [
    { tipo: 'spotify',   titulo: 'Spotify',             placeholder: 'https://open.spotify.com/...' },
    { tipo: 'youtube',   titulo: 'YouTube',             placeholder: 'https://youtube.com/...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'pix',       titulo: 'Apoio via Pix',       placeholder: 'Chave Pix' },
  ],
  streamer: [
    { tipo: 'outro',     titulo: 'Twitch / Kick',       placeholder: 'https://twitch.tv/...' },
    { tipo: 'youtube',   titulo: 'YouTube',             placeholder: 'https://youtube.com/...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'pix',       titulo: 'Apoio via Pix',       placeholder: 'Chave Pix' },
  ],
  cabeleireiro: [
    { tipo: 'whatsapp',  titulo: 'Agendar pelo WhatsApp', placeholder: 'https://wa.me/55119...' },
    { tipo: 'agenda',    titulo: 'Agendamento online',  placeholder: 'https://...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'maps',      titulo: 'Localização do salão',placeholder: 'https://maps.google.com/...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  maquiador: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'agenda',    titulo: 'Agendar horário',     placeholder: 'https://...' },
    { tipo: 'portfolio', titulo: 'Portfólio',           placeholder: 'https://...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  esteticista: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'agenda',    titulo: 'Agendar procedimento',placeholder: 'https://...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'maps',      titulo: 'Localização',         placeholder: 'https://maps.google.com/...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  tatuador: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'portfolio', titulo: 'Portfólio',           placeholder: 'https://drive.google.com/...' },
    { tipo: 'agenda',    titulo: 'Agendar tatuagem',    placeholder: 'https://calendly.com/...' },
    { tipo: 'maps',      titulo: 'Localização do estúdio', placeholder: 'https://maps.google.com/...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  nail_designer: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'agenda',    titulo: 'Agendar horário',     placeholder: 'https://...' },
    { tipo: 'maps',      titulo: 'Localização',         placeholder: 'https://maps.google.com/...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  barbeiro: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'agenda',    titulo: 'Agendar horário',     placeholder: 'https://...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'maps',      titulo: 'Localização da barbearia', placeholder: 'https://maps.google.com/...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  personal: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'agenda',    titulo: 'Agendar aula',        placeholder: 'https://...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'youtube',   titulo: 'Treinos no YouTube',  placeholder: 'https://youtube.com/...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  nutricionista: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'agenda',    titulo: 'Agendar consulta',    placeholder: 'https://...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'site',      titulo: 'Site profissional',   placeholder: 'https://...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  psicologo: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'agenda',    titulo: 'Agendar sessão',      placeholder: 'https://...' },
    { tipo: 'site',      titulo: 'Site profissional',   placeholder: 'https://...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  medico: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'agenda',    titulo: 'Agendar consulta',    placeholder: 'https://...' },
    { tipo: 'maps',      titulo: 'Endereço do consultório', placeholder: 'https://maps.google.com/...' },
    { tipo: 'site',      titulo: 'Site profissional',   placeholder: 'https://...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
  ],
  fisioterapeuta: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'agenda',    titulo: 'Agendar sessão',      placeholder: 'https://...' },
    { tipo: 'maps',      titulo: 'Localização',         placeholder: 'https://maps.google.com/...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  corretor: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'portfolio', titulo: 'Ver imóveis',         placeholder: 'https://...' },
    { tipo: 'agenda',    titulo: 'Agendar visita',      placeholder: 'https://...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'site',      titulo: 'Site profissional',   placeholder: 'https://...' },
  ],
  advogado: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'agenda',    titulo: 'Agendar consulta',    placeholder: 'https://...' },
    { tipo: 'site',      titulo: 'Site profissional',   placeholder: 'https://...' },
    { tipo: 'outro',     titulo: 'LinkedIn',            placeholder: 'https://linkedin.com/in/...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
  ],
  contador: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'agenda',    titulo: 'Agendar reunião',     placeholder: 'https://...' },
    { tipo: 'site',      titulo: 'Site profissional',   placeholder: 'https://...' },
    { tipo: 'outro',     titulo: 'LinkedIn',            placeholder: 'https://linkedin.com/in/...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  consultor: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'agenda',    titulo: 'Agendar consultoria', placeholder: 'https://calendly.com/...' },
    { tipo: 'outro',     titulo: 'LinkedIn',            placeholder: 'https://linkedin.com/in/...' },
    { tipo: 'site',      titulo: 'Site profissional',   placeholder: 'https://...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  coach: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'agenda',    titulo: 'Agendar sessão',      placeholder: 'https://calendly.com/...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'youtube',   titulo: 'YouTube',             placeholder: 'https://youtube.com/...' },
    { tipo: 'pix',       titulo: 'Pagar via Pix',       placeholder: 'Chave Pix' },
  ],
  atleta_futebol: [
    { tipo: 'instagram', titulo: 'Instagram',              placeholder: 'https://instagram.com/...' },
    { tipo: 'outro',     titulo: 'Wikipedia / Transfermarkt', placeholder: 'https://...' },
    { tipo: 'youtube',   titulo: 'YouTube',                placeholder: 'https://youtube.com/...' },
    { tipo: 'site',      titulo: 'Site oficial',           placeholder: 'https://...' },
    { tipo: 'agenda',    titulo: 'Contato para parceria',  placeholder: 'https://...' },
  ],
  lutador: [
    { tipo: 'instagram', titulo: 'Instagram',              placeholder: 'https://instagram.com/...' },
    { tipo: 'youtube',   titulo: 'YouTube — lutas e treinos', placeholder: 'https://youtube.com/...' },
    { tipo: 'outro',     titulo: 'Wikipedia / Sherdog',   placeholder: 'https://...' },
    { tipo: 'tiktok',    titulo: 'TikTok',                 placeholder: 'https://tiktok.com/...' },
    { tipo: 'agenda',    titulo: 'Contato para parceria',  placeholder: 'https://...' },
    { tipo: 'pix',       titulo: 'Apoio via Pix',          placeholder: 'Chave Pix' },
  ],
  musico_allstar: [
    { tipo: 'spotify',   titulo: 'Spotify',                placeholder: 'https://open.spotify.com/...' },
    { tipo: 'youtube',   titulo: 'YouTube',                placeholder: 'https://youtube.com/...' },
    { tipo: 'instagram', titulo: 'Instagram',              placeholder: 'https://instagram.com/...' },
    { tipo: 'tiktok',    titulo: 'TikTok',                 placeholder: 'https://tiktok.com/...' },
    { tipo: 'agenda',    titulo: 'Contratar para shows',   placeholder: 'https://...' },
    { tipo: 'site',      titulo: 'Site oficial',           placeholder: 'https://...' },
  ],
  ator_influencer: [
    { tipo: 'instagram', titulo: 'Instagram',              placeholder: 'https://instagram.com/...' },
    { tipo: 'tiktok',    titulo: 'TikTok',                 placeholder: 'https://tiktok.com/...' },
    { tipo: 'youtube',   titulo: 'YouTube',                placeholder: 'https://youtube.com/...' },
    { tipo: 'site',      titulo: 'Site oficial / IMDB',    placeholder: 'https://...' },
    { tipo: 'agenda',    titulo: 'Contato para casting',   placeholder: 'https://...' },
  ],
  nadador_atletismo: [
    { tipo: 'instagram', titulo: 'Instagram',              placeholder: 'https://instagram.com/...' },
    { tipo: 'youtube',   titulo: 'YouTube',                placeholder: 'https://youtube.com/...' },
    { tipo: 'outro',     titulo: 'Wikipedia / World Athletics', placeholder: 'https://...' },
    { tipo: 'site',      titulo: 'Site oficial',           placeholder: 'https://...' },
    { tipo: 'agenda',    titulo: 'Contato para parceria',  placeholder: 'https://...' },
  ],
  escritor_autor: [
    { tipo: 'site',      titulo: 'Site oficial',           placeholder: 'https://...' },
    { tipo: 'outro',     titulo: 'Amazon / Estante Virtual', placeholder: 'https://...' },
    { tipo: 'instagram', titulo: 'Instagram',              placeholder: 'https://instagram.com/...' },
    { tipo: 'youtube',   titulo: 'YouTube / Podcast',      placeholder: 'https://youtube.com/...' },
    { tipo: 'agenda',    titulo: 'Contratar para palestra',placeholder: 'https://...' },
  ],
  empresa_marca: [
    { tipo: 'site',      titulo: 'Site oficial',           placeholder: 'https://...' },
    { tipo: 'whatsapp',  titulo: 'WhatsApp Comercial',     placeholder: 'https://wa.me/55119...' },
    { tipo: 'instagram', titulo: 'Instagram',              placeholder: 'https://instagram.com/...' },
    { tipo: 'outro',     titulo: 'LinkedIn',               placeholder: 'https://linkedin.com/...' },
    { tipo: 'youtube',   titulo: 'YouTube',                placeholder: 'https://youtube.com/...' },
    { tipo: 'agenda',    titulo: 'Agendar reunião',        placeholder: 'https://calendly.com/...' },
  ],
  outro: [
    { tipo: 'whatsapp',  titulo: 'WhatsApp',            placeholder: 'https://wa.me/55119...' },
    { tipo: 'instagram', titulo: 'Instagram',           placeholder: 'https://instagram.com/...' },
    { tipo: 'site',      titulo: 'Meu site',            placeholder: 'https://...' },
    { tipo: 'pix',       titulo: 'Pix',                 placeholder: 'Chave Pix' },
  ],
}

// Ícones SVG para tipos de link (sem emojis)
export const linkIcones: Record<string, string> = {
  whatsapp:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
  youtube:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  spotify:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
  tiktok:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.26 8.26 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/></svg>`,
  portfolio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
  agenda:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  pix:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  maps:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  site:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
  outro:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`,
}

// Planos e limites
export const PLANOS = {
  free: {
    nome: 'Free',
    maxLinks: 5,
    analytics: 7,
    multiplas_paginas: false,
    sem_marca: false,
    pix_nativo: false,
    dominio_proprio: false,
  },
  pro: {
    nome: 'Pro',
    maxLinks: 999,
    analytics: 90,
    multiplas_paginas: true,
    sem_marca: true,
    pix_nativo: true,
    dominio_proprio: false,
    relatorios: true,
  },
  allstar: {
    nome: 'All-Star',
    maxLinks: 999,
    analytics: 365,
    multiplas_paginas: true,
    sem_marca: true,
    pix_nativo: true,
    dominio_proprio: true,
    relatorios: true,
    verificado: true,
    ficha_allstar: true,
  },
}