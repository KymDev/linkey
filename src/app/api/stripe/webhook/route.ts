// src/app/api/stripe/webhook/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { stripe, planoDoPreco, type PlanoId } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

// Desativa body parser padrão do Next — Stripe precisa do raw body
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body      = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Sem assinatura' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('[webhook] Assinatura inválida:', err.message)
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 })
  }

  const admin = createAdminClient()

  console.log('[webhook] Evento recebido:', event.type)

  try {
    switch (event.type) {

      // ── Assinatura criada ──────────────────────────
      case 'customer.subscription.created':
      case 'checkout.session.completed': {
        const obj = event.data.object as Stripe.Subscription | Stripe.Checkout.Session

        let userId:    string | undefined
        let subId:     string | undefined
        let priceId:   string | undefined
        let status:    string = 'active'
        let proxPag:   string | undefined

        if (event.type === 'checkout.session.completed') {
          const session = obj as Stripe.Checkout.Session
          userId  = session.metadata?.supabase_user_id
          subId   = session.subscription as string

          // Busca detalhes da subscription
          if (subId) {
            const sub = await stripe.subscriptions.retrieve(subId)
            priceId  = sub.items.data[0]?.price.id
            status   = sub.status
            proxPag  = new Date(sub.current_period_end * 1000).toISOString()
          }
        } else {
          const sub = obj as Stripe.Subscription
          userId  = sub.metadata?.supabase_user_id
          subId   = sub.id
          priceId  = sub.items.data[0]?.price.id
          status   = sub.status
          proxPag  = new Date(sub.current_period_end * 1000).toISOString()
        }

        if (!userId || !subId) break

        const plano = priceId ? planoDoPreco(priceId) : 'pro'

        // Atualiza perfil do usuário
        await admin
          .from('profiles')
          .update({
            plano,
            stripe_subscription_id: subId,
          })
          .eq('id', userId)

        // Upsert na tabela subscriptions
        await admin
          .from('subscriptions')
          .upsert({
            user_id:           userId,
            stripe_sub_id:     subId,
            plano,
            status:            status === 'active' ? 'active' : 'past_due',
            proximo_pagamento: proxPag,
          }, { onConflict: 'user_id' })

        console.log(`[webhook] Plano ${plano} ativado para user ${userId}`)
        break
      }

      // ── Assinatura renovada / atualizada ───────────
      case 'customer.subscription.updated': {
        const sub    = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.supabase_user_id
        if (!userId) break

        const priceId = sub.items.data[0]?.price.id
        const plano   = priceId ? planoDoPreco(priceId) : 'free'
        const proxPag = new Date(sub.current_period_end * 1000).toISOString()

        await admin
          .from('profiles')
          .update({ plano })
          .eq('id', userId)

        await admin
          .from('subscriptions')
          .update({
            plano,
            status:            sub.status === 'active' ? 'active' : 'past_due',
            proximo_pagamento: proxPag,
          })
          .eq('user_id', userId)

        console.log(`[webhook] Assinatura atualizada — user ${userId}, plano ${plano}`)
        break
      }

      // ── Assinatura cancelada ───────────────────────
      case 'customer.subscription.deleted': {
        const sub    = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.supabase_user_id
        if (!userId) break

        // Volta pro plano free
        await admin
          .from('profiles')
          .update({
            plano: 'free',
            stripe_subscription_id: null,
          })
          .eq('id', userId)

        await admin
          .from('subscriptions')
          .update({ status: 'canceled', plano: 'free' })
          .eq('user_id', userId)

        console.log(`[webhook] Assinatura cancelada — user ${userId}`)
        break
      }

      // ── Pagamento falhou ───────────────────────────
      case 'invoice.payment_failed': {
        const invoice  = event.data.object as Stripe.Invoice
        const subId    = invoice.subscription as string
        if (!subId) break

        const sub      = await stripe.subscriptions.retrieve(subId)
        const userId   = sub.metadata?.supabase_user_id
        if (!userId) break

        await admin
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('user_id', userId)

        console.log(`[webhook] Pagamento falhou — user ${userId}`)
        break
      }

      default:
        console.log(`[webhook] Evento ignorado: ${event.type}`)
    }
  } catch (err) {
    console.error('[webhook] Erro ao processar evento:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }

  return NextResponse.json({ recebido: true })
}
