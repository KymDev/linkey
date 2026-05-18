// src/app/api/dominio/verificar/route.ts
// 1. Verifica se o CNAME do domínio aponta para cname.vercel-dns.com
// 2. Se sim, adiciona o domínio no projeto Vercel via API
// 3. Marca como verificado no Supabase

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

const VERCEL_TOKEN      = process.env.VERCEL_TOKEN!          // adicionar no .env
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID!     // adicionar no .env
const VERCEL_TEAM_ID    = process.env.VERCEL_TEAM_ID ?? ''   // opcional

export async function POST(req: NextRequest) {
  try {
    const { dominio } = await req.json()

    if (!dominio || typeof dominio !== 'string') {
      return NextResponse.json({ ok: false, message: 'Domínio inválido.' }, { status: 400 })
    }

    const dom = dominio.trim().toLowerCase()

    // ── Autenticação do usuário ────────────────────────────────────
    const supabase      = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ ok: false, message: 'Não autenticado.' }, { status: 401 })
    }

    // ── Verifica se o plano é pago ─────────────────────────────────
    const { data: profile } = await supabase
      .from('profiles')
      .select('plano')
      .eq('id', user.id)
      .single()

    if (!['pro', 'allstar'].includes(profile?.plano ?? '')) {
      return NextResponse.json({ ok: false, message: 'Plano não autorizado.' }, { status: 403 })
    }

    // ── Verifica se o domínio pertence a este usuário no Supabase ──
    const { data: dominioData } = await supabase
      .from('dominios_personalizados')
      .select('id')
      .eq('user_id', user.id)
      .eq('dominio', dom)
      .single()

    if (!dominioData) {
      return NextResponse.json({ ok: false, message: 'Domínio não cadastrado para este usuário.' }, { status: 400 })
    }

    // ── Verifica o CNAME via DNS público ───────────────────────────
    const dnsCheck = await fetch(
      `https://dns.google/resolve?name=${dom}&type=CNAME`,
      { next: { revalidate: 0 } }
    )
    const dnsData = await dnsCheck.json()
    const answers: { data: string }[] = dnsData?.Answer ?? []

    const apontaVercel = answers.some(a =>
      a.data?.includes('vercel-dns.com') || a.data?.includes('vercel.com')
    )

    // Também aceita A record apontando para IPs da Vercel (casos de apex sem CNAME)
    const dnsA = await fetch(
      `https://dns.google/resolve?name=${dom}&type=A`,
      { next: { revalidate: 0 } }
    )
    const dnsAData = await dnsA.json()
    const aRecords: { data: string }[] = dnsAData?.Answer ?? []
    // IPs da Vercel para A record de domínio apex
    const vercelIPs = ['76.76.21.21', '76.76.21.22']
    const apontaVercelA = aRecords.some(a => vercelIPs.includes(a.data))

    if (!apontaVercel && !apontaVercelA) {
      return NextResponse.json({
        ok: false,
        message: 'CNAME não encontrado. Confirme que adicionou o CNAME corretamente e aguarde a propagação (pode levar até 24h).',
      })
    }

    // ── Adiciona o domínio no projeto Vercel via API ───────────────
    if (VERCEL_TOKEN && VERCEL_PROJECT_ID) {
      const teamQuery = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''
      const vercelRes = await fetch(
        `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains${teamQuery}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${VERCEL_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: dom }),
        }
      )
      const vercelData = await vercelRes.json()

      // Erros que não impedem: domínio já existe no projeto
      if (!vercelRes.ok && vercelData.error?.code !== 'domain_already_in_use') {
        console.error('Vercel API error:', vercelData)
        // Não bloqueia — marca como verificado mesmo assim (o CNAME está correto)
      }
    }

    // ── Marca como verificado no Supabase (admin para bypass RLS) ──
    const admin = createAdminClient()
    await admin
      .from('dominios_personalizados')
      .update({ verificado: true, atualizado_em: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('dominio', dom)

    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('Erro na verificação de domínio:', err)
    return NextResponse.json({ ok: false, message: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
