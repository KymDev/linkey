// src/app/api/clicks/route.ts
import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

// Rate limit simples em memória — 30 cliques por IP por minuto
const rateMap = new Map<string, { count: number; reset: number }>()

function checkRateLimit(ip: string): boolean {
  const now  = Date.now()
  const entry = rateMap.get(ip)

  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60_000 })
    return true
  }
  if (entry.count >= 30) return false
  entry.count++
  return true
}

// Valida formato UUID v4
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function POST(request: NextRequest) {
  try {
    // Rate limit por IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
              ?? request.headers.get('x-real-ip')
              ?? 'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Muitas requisições' }, { status: 429 })
    }

    const body = await request.json()
    const { page_id, link_id } = body

    // Valida formato dos IDs
    if (!page_id || !UUID_RE.test(page_id)) {
      return NextResponse.json({ error: 'page_id inválido' }, { status: 400 })
    }
    if (link_id && !UUID_RE.test(link_id)) {
      return NextResponse.json({ error: 'link_id inválido' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Verifica se a página existe e está ativa — bloqueia IDs inventados
    const { data: page, error: pageErr } = await supabase
      .from('pages')
      .select('id')
      .eq('id', page_id)
      .eq('ativo', true)
      .single()

    if (pageErr || !page) {
      // Retorna 200 mesmo assim — não revela se a página existe ou não
      return NextResponse.json({ ok: true })
    }

    const referer    = request.headers.get('referer') || ''
    const ua         = request.headers.get('user-agent') || ''
    const origem     = detectarOrigem(referer)
    const dispositivo = detectarDispositivo(ua)

    await supabase.from('clicks').insert({
      page_id,
      link_id: link_id || null,
      origem,
      dispositivo,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[clicks]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

function detectarOrigem(referer: string): string {
  if (!referer) return 'direto'
  if (referer.includes('instagram.com'))  return 'instagram'
  if (referer.includes('tiktok.com'))     return 'tiktok'
  if (referer.includes('youtube.com'))    return 'youtube'
  if (referer.includes('facebook.com'))   return 'facebook'
  if (referer.includes('twitter.com') || referer.includes('x.com')) return 'twitter'
  if (referer.includes('whatsapp.com'))   return 'whatsapp'
  if (referer.includes('google.com'))     return 'google'
  if (referer.includes('linkedin.com'))   return 'linkedin'
  return 'outro'
}

function detectarDispositivo(ua: string): string {
  const mobile = /android|iphone|ipad|ipod|mobile|blackberry|windows phone/i
  return mobile.test(ua) ? 'mobile' : 'desktop'
}
