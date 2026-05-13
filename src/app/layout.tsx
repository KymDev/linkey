import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const APP_URL = 'https://linkey.cloud'
const APP_NAME = 'LinKey'
const APP_DESCRIPTION =
  'Crie seu cartão digital profissional em minutos. Para músicos, atletas, tatuadores, atores, autores, empresas e criadores. Links ilimitados, Pix nativo, analytics e página personalizada por nicho. Alternativa brasileira ao Linktree.'

export const viewport: Viewport = {
  themeColor: '#7C6FFF',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: 'LinKey — Cartão Digital Profissional para Criadores e Atletas',
    template: '%s | LinKey',
  },

  description: APP_DESCRIPTION,

  keywords: [
    'link na bio',
    'linktree brasil',
    'alternativa linktree',
    'cartão digital',
    'página profissional',
    'bio link',
    'link instagram bio',
    'página atleta',
    'ficha digital atleta',
    'link para músico',
    'link para tatuador',
    'link para corretor',
    'link para personal',
    'pix link bio',
    'analytics link na bio',
    'linkey',
    'criar página grátis',
    'presença digital profissional',
    'ficha digital esportiva',
    'cartão digital ator',
    'cartão digital empresa',
  ],

  authors: [{ name: 'LinKey', url: APP_URL }],
  creator: 'LinKey',
  publisher: 'LinKey',

  // Canonical + alternates
  alternates: {
    canonical: APP_URL,
    languages: {
      'pt-BR': APP_URL,
    },
  },

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: APP_URL,
    siteName: APP_NAME,
    title: 'LinKey — Cartão Digital Profissional para Criadores e Atletas',
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'LinKey — Seu cartão digital profissional',
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    site: '@linkeybr',
    creator: '@linkeybr',
    title: 'LinKey — Cartão Digital Profissional',
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // App / PWA
  applicationName: APP_NAME,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: APP_NAME,
  },

  // Verificação Google Search Console (substitua pelo seu código real)
  verification: {
    google: 'COLE_SEU_CODIGO_GOOGLE_SEARCH_CONSOLE_AQUI',
  },

  // Categoria
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Schema.org — Organização */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'LinKey',
              url: APP_URL,
              description: APP_DESCRIPTION,
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              offers: [
                {
                  '@type': 'Offer',
                  name: 'Free',
                  price: '0',
                  priceCurrency: 'BRL',
                  description: 'Plano gratuito para sempre',
                },
                {
                  '@type': 'Offer',
                  name: 'Pro',
                  price: '19.00',
                  priceCurrency: 'BRL',
                  description: 'Links ilimitados, Pix nativo, analytics completo',
                },
                {
                  '@type': 'Offer',
                  name: 'All-Star',
                  price: '99.99',
                  priceCurrency: 'BRL',
                  description: 'Ficha personalizada para atletas, atores, autores e empresas',
                },
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '128',
              },
              inLanguage: 'pt-BR',
              publisher: {
                '@type': 'Organization',
                name: 'LinKey',
                url: APP_URL,
                logo: {
                  '@type': 'ImageObject',
                  url: `${APP_URL}/logo.png`,
                },
              },
            }),
          }}
        />

        {/* Schema.org — FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'O LinKey é gratuito?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Sim. O plano Free é gratuito para sempre, sem cartão de crédito. Você cria sua página agora e só faz upgrade quando quiser.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Qual a diferença do LinKey para o Linktree?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'O LinKey é focado em criadores e profissionais brasileiros, com templates por nicho, botão de pagamento Pix nativo, ficha personalizada para atletas e artistas, e suporte humano próximo.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Posso cancelar minha assinatura quando quiser?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Sim. Sem fidelidade, sem letras miúdas. Cancele diretamente pelo painel em qualquer momento.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Precisa saber programar para usar o LinKey?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Não. Você preenche um formulário, escolhe as cores e compartilha o link. Em menos de 3 minutos sua página está no ar.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'O LinKey funciona para atletas e esportistas?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Sim! O plano All-Star tem fichas personalizadas para futebolistas, lutadores de MMA, nadadores, atletas do atletismo e muito mais, com dados como cartel, recordes, overall e clube.',
                  },
                },
              ],
            }),
          }}
        />

        {/* Schema.org — BreadcrumbList para homepage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              url: APP_URL,
              name: 'LinKey',
              description: APP_DESCRIPTION,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${APP_URL}/{search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className={plusJakarta.className}>
        <div className="bg-app" aria-hidden="true" />
        <div className="bg-noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
