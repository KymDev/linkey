// src/middleware.ts
// Redireciona domínios personalizados para o perfil do usuário correto.
// Ex: meusite.com.br/qualquer-coisa → linkey.cloud/{username}/qualquer-coisa

import { NextRequest, NextResponse } from 'next/server'

const DOMINIO_PRINCIPAL = 'linkey.cloud'
const DOMINIOS_INTERNOS = [
  'linkey.cloud',
  'www.linkey.cloud',
  'localhost',
  '127.0.0.1',
]

// Rotas que nunca devem ser reescritas pelo middleware de domínio
const ROTAS_EXCLUIDAS = [
  '/dashboard',
  '/auth',
  '/api',
  '/onboarding',
  '/_next',
  '/favicon',
  '/robots',
  '/sitemap',
  '/manifest',
  '/og-image',
  '/icon',
]

export async function middleware(req: NextRequest) {
  const host      = req.headers.get('host') ?? ''
  const hostname  = host.split(':')[0]   // remove porta em dev
  const pathname  = req.nextUrl.pathname

  // Se for domínio interno do LinKey, passa direto
  const ehDominioInterno = DOMINIOS_INTERNOS.some(d => hostname === d || hostname.endsWith(`.${d}`))
  if (ehDominioInterno) return NextResponse.next()

  // Ignora rotas internas mesmo em domínio customizado
  const ehRotaInterna = ROTAS_EXCLUIDAS.some(r => pathname.startsWith(r))
  if (ehRotaInterna) return NextResponse.next()

  // Busca no Supabase qual username tem esse domínio
  // Usa fetch direto pois o middleware não tem acesso ao cliente server do Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/dominios_personalizados?dominio=eq.${encodeURIComponent(hostname)}&verificado=eq.true&select=user_id`,
      {
        headers: {
          apikey:        supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        // Cache de 60s para não bater no banco a cada request
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) return NextResponse.next()

    const rows: { user_id: string }[] = await res.json()
    if (!rows.length) return NextResponse.next()

    const userId = rows[0].user_id

    // Busca o username pelo user_id
    const resPage = await fetch(
      `${supabaseUrl}/rest/v1/pages?user_id=eq.${userId}&ativo=eq.true&select=username`,
      {
        headers: {
          apikey:        supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 60 },
      }
    )

    if (!resPage.ok) return NextResponse.next()

    const pages: { username: string }[] = await resPage.json()
    if (!pages.length) return NextResponse.next()

    const username = pages[0].username

    // Reescreve a URL internamente para o perfil do usuário
    // O visitante continua vendo "meusite.com.br" na barra de endereço
    const url = req.nextUrl.clone()
    url.hostname = DOMINIO_PRINCIPAL
    url.pathname = `/${username}${pathname === '/' ? '' : pathname}`

    return NextResponse.rewrite(url)

  } catch {
    // Em caso de erro, deixa passar normalmente
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    // Aplica em tudo exceto arquivos estáticos e _next
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
