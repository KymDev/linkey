// src/app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const code  = searchParams.get('code')
  const next  = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')

  // Se Supabase retornou erro (ex: link expirado)
  if (error) {
    console.error('[Auth callback error]', error)
    return NextResponse.redirect(
      `${origin}/auth/login?erro=link-invalido`
    )
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // Troca o code pela sessão
  const { data, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('[Auth exchange error]', exchangeError.message)
    return NextResponse.redirect(`${origin}/auth/login?erro=sessao-invalida`)
  }

  // Verifica se o usuário já completou o onboarding
  // (tem página criada = onboarding completo)
  const { data: page } = await supabase
    .from('pages')
    .select('id')
    .eq('user_id', data.user.id)
    .single()

  // Se não tem página → vai pro onboarding
  if (!page) {
    return NextResponse.redirect(`${origin}/onboarding`)
  }

  // Se já tem página → vai pro dashboard
  return NextResponse.redirect(`${origin}${next}`)
}
