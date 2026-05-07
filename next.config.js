/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Bloqueia o site de ser embutido em iframes — previne clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  // Impede o browser de tentar adivinhar o content-type
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Força HTTPS por 1 ano, inclui subdomínios
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  // Não envia o Referer completo para outros domínios
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Remove informações do browser sobre recursos permitidos
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Proteção XSS para browsers mais antigos
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: próprio domínio + Stripe (checkout) + Supabase
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      // Estilos: próprio domínio + inline (Next.js usa inline styles)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Imagens: próprio domínio + Supabase Storage + data URIs
      "img-src 'self' data: blob: https://*.supabase.co",
      // Fontes
      "font-src 'self' https://fonts.gstatic.com",
      // Conexões: próprio domínio + Supabase + Stripe
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com",
      // iFrames: só Stripe (checkout embutido)
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      // Formulários só para o próprio domínio
      "form-action 'self'",
      // Não herda CSP de frames pai
      "frame-ancestors 'none'",
    ].join('; '),
  },
]

const nextConfig = {
  serverExternalPackages: ['stripe'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  async headers() {
    return [
      {
        // Aplica em todas as rotas
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
