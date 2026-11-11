export interface ItemRss {
  titulo: string
  caminho: string
  resumo: string
  data: string
}

interface Canal {
  nome: string
  descricao: string
  url: string
  idioma: string
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }
const escapar = (texto: string): string => texto.replace(/[&<>"']/g, (letra) => ESCAPES[letra])
const dataRfc822 = (dataIso: string): string => new Date(`${dataIso}T12:00:00Z`).toUTCString()

export function montarRss({ site, itens }: { site: Canal; itens: readonly ItemRss[] }): string {
  const entradas = [...itens]
    .sort((a, b) => b.data.localeCompare(a.data))
    .map((item) => {
      const link = escapar(`${site.url}${item.caminho}`)
      return [
        '    <item>',
        `      <title>${escapar(item.titulo)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <pubDate>${dataRfc822(item.data)}</pubDate>`,
        `      <description>${escapar(item.resumo)}</description>`,
        '    </item>',
      ].join('\n')
    })
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapar(site.nome)}</title>`,
    `    <link>${escapar(site.url)}</link>`,
    `    <description>${escapar(site.descricao)}</description>`,
    `    <language>${escapar(site.idioma)}</language>`,
    `    <atom:link href="${escapar(site.url)}/rss.xml" rel="self" type="application/rss+xml"/>`,
    ...entradas,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')
}
