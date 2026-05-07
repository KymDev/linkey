// src/app/dashboard/planos/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PlanosClient from './PlanosClient'

export default async function PlanosPage({
  searchParams,
}: {
  searchParams: { sucesso?: string; cancelado?: string }
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Busca perfil com plano atual
  const { data: profile } = await supabase
    .from('profiles')
    .select('plano, stripe_customer_id')
    .eq('id', user.id)
    .single()

  // Busca assinatura ativa
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plano, status, proximo_pagamento')
    .eq('user_id', user.id)
    .single()

  return (
    <div>
      {/* Banner de sucesso */}
      {searchParams.sucesso === '1' && (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(111,255,150,0.1)',
          border: '1px solid rgba(111,255,150,0.25)',
          borderRadius: '14px',
          marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{ fontSize: '24px' }}>🎉</span>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '2px' }}>
              Assinatura ativada com sucesso!
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
              Suas novas funcionalidades já estão disponíveis.
            </div>
          </div>
        </div>
      )}

      {/* Banner cancelado */}
      {searchParams.cancelado === '1' && (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(255,200,80,0.08)',
          border: '1px solid rgba(255,200,80,0.2)',
          borderRadius: '14px',
          marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{ fontSize: '20px' }}>ℹ️</span>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
            Pagamento cancelado. Nenhuma cobrança foi feita.
          </div>
        </div>
      )}

      <PlanosClient
        planoAtual={profile?.plano ?? 'free'}
        subscription={subscription ?? null}
        temStripe={!!profile?.stripe_customer_id}
      />
    </div>
  )
}
