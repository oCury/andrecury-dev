import type { Metadata } from 'next'
import { SITE } from './site'

interface Entrada {
  titulo?: string
  descricao: string
  caminho: string
  tipo?: 'website' | 'article'
}

export function metadados({ titulo, descricao, caminho, tipo = 'website' }: Entrada): Metadata {
  return {
    ...(titulo ? { title: titulo } : {}),
    description: descricao,
    alternates: { canonical: caminho, types: { 'application/rss+xml': '/rss.xml' } },
    openGraph: {
      type: tipo,
      locale: 'pt_BR',
      siteName: SITE.nome,
      url: caminho,
      title: titulo ?? SITE.titulo,
      description: descricao,
    },
  }
}
