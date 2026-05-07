// src/lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const PRECOS = {
  pro: {
    mensal: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    anual:  process.env.STRIPE_PRICE_PRO_YEARLY!,
  },
  allstar: {
    mensal: process.env.STRIPE_PRICE_ALLSTAR_MONTHLY!,
    anual:  process.env.STRIPE_PRICE_ALLSTAR_YEARLY!,
  },
}

export type PlanoId = 'free' | 'pro' | 'allstar'

export function planoDoPreco(priceId: string): PlanoId {
  if (Object.values(PRECOS.pro).includes(priceId))     return 'pro'
  if (Object.values(PRECOS.allstar).includes(priceId)) return 'allstar'
  return 'free'
}
