// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'LinKey — Seu Link. Assuma Seu Holofote',
    template: '%s | LinKey',
  },
  description: 'Crie sua presença digital profissional com links, analytics e identidade personalizada',
  keywords: ['bio link', 'link na bio', 'instagram bio', 'linktree', 'bio link page', 'página profissional'],
  openGraph: {
    title: 'LinKey — Seu link profissional',
    description: 'Sua página profissional com links, analytics e personalização por nicho.',
    url: 'https://linkey.cloud',
    siteName: 'LinKey',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="bg-app" aria-hidden="true" />
        <div className="bg-noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
