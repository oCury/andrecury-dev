import type { Metadata } from 'next'
import { IBM_Plex_Mono, Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import { Cabecalho } from '@/components/site/Cabecalho'
import { Rodape } from '@/components/site/Rodape'
import { SITE } from '@/lib/site'
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/site.css'

const sans = Inter({ subsets: ['latin'], display: 'swap', variable: '--fonte-sans' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--fonte-mono' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.titulo, template: `%s · ${SITE.nome}` },
  description: SITE.descricao,
  robots: { index: true, follow: true },
}

export default function LayoutRaiz({ children }: { children: ReactNode }) {
  return (
    <html lang={SITE.idioma} className={`${sans.variable} ${mono.variable}`}>
      <body>
        <Cabecalho />
        <main id="conteudo" tabIndex={-1}>{children}</main>
        <Rodape />
      </body>
    </html>
  )
}
