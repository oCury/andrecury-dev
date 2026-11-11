import { describe, expect, it } from 'vitest'
import { montarRss } from './rss'
import { SITE } from './site'

const itens = [
  { titulo: 'Antigo', caminho: '/blog/antigo', resumo: 'r', data: '2026-01-05' },
  { titulo: 'Tom & Jerry <b>', caminho: '/blog/novo', resumo: 'a < b', data: '2026-11-11' },
]

describe('montarRss', () => {
  const xml = montarRss({ site: SITE, itens })

  it('escapa o que vem do conteúdo', () => {
    expect(xml).toContain('<title>Tom &amp; Jerry &lt;b&gt;</title>')
    expect(xml).toContain('<description>a &lt; b</description>')
  })

  it('usa o domínio próprio nos links e põe o mais novo primeiro', () => {
    expect(xml).toContain('<link>https://blog.andrecury.dev.br/blog/novo</link>')
    expect(xml.indexOf('/blog/novo')).toBeLessThan(xml.indexOf('/blog/antigo'))
    expect(xml).not.toContain('vercel.app')
  })

  it('escreve a data no formato que os leitores de RSS esperam', () => {
    expect(xml).toContain('<pubDate>Wed, 11 Nov 2026 12:00:00 GMT</pubDate>')
  })
})
