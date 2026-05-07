// middleware.ts — raiz do projeto
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Rotas que precisam de login
  const rotasProtegidas = ['/dashboard', '/onboarding']
  const precisaLogin = rotasProtegidas.some(r => pathname.startsWith(r))

  // Rotas só para não-logados
  const rotasPublicasAuth = ['/auth/login', '/auth/cadastro', '/auth/esqueci', '/auth/reset-senha']
  const sóSemLogin = rotasPublicasAuth.some(r => pathname.startsWith(r))

  if (precisaLogin && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (sóSemLogin && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
