import { describe, expect, it } from 'vitest'
import { metadados } from './metadados'
import { SITE } from './site'

describe('metadados', () => {
  it('usa o caminho como canonical e anuncia o RSS', () => {
    const lido = metadados({ titulo: 'Blog', descricao: 'Textos', caminho: '/blog' })
    expect(lido.title).toBe('Blog')
    expect(lido.alternates).toEqual({ canonical: '/blog', types: { 'application/rss+xml': '/rss.xml' } })
  })

  it('sem título deixa valer o título padrão do layout', () => {
    const lido = metadados({ descricao: 'Início', caminho: '/' })
    expect('title' in lido).toBe(false)
    expect(lido.openGraph?.title).toBe(SITE.titulo)
  })

  it('o domínio do site é o próprio, nunca o da hospedagem', () => {
    expect(SITE.url).toBe('https://blog.andrecury.dev.br')
    expect(JSON.stringify(SITE)).not.toContain('vercel.app')
  })
})
