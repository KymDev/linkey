// src/app/api/stripe/checkout/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { stripe, PRECOS, type PlanoId } from '@/lib/stripe'

const PLANOS_PAGOS: PlanoId[] = ['pro', 'allstar']

export async function POST(request: NextRequest) {
  try {
    const { plano, periodo } = await request.json()

    if (!PLANOS_PAGOS.includes(plano)) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
    }
    if (!['mensal', 'anual'].includes(periodo)) {
      return NextResponse.json({ error: 'Período inválido' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const admin = createAdminClient()
    const { data: profile } = await admin
      .from('profiles')
      .select('stripe_customer_id, nome')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        name:  profile?.nome ?? undefined,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await admin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const priceId = PRECOS[plano as keyof typeof PRECOS][periodo as 'mensal' | 'anual']

    if (!priceId) {
      return NextResponse.json({ error: 'Preço não configurado' }, { status: 500 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!

    const session = await stripe.checkout.sessions.create({
      customer:   customerId,
      mode:       'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/planos?sucesso=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl}/dashboard/planos?cancelado=1`,
      metadata: { supabase_user_id: user.id, plano },
      subscription_data: {
        metadata: { supabase_user_id: user.id, plano },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      locale: 'pt-BR',
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[stripe/checkout]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
