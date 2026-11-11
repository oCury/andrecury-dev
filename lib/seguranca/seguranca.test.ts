import { describe, expect, it } from 'vitest'
import { cabecalhosDeSeguranca, montarCsp } from './cabecalhos'
import { redirecionamentosDeHost } from './redirecionamentos'

describe('montarCsp', () => {
  it('em produção fecha objetos, molduras e base, e não libera eval', () => {
    const csp = montarCsp({ emDesenvolvimento: false })
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("base-uri 'self'")
    expect(csp).not.toContain('unsafe-eval')
  })

  it('libera o giscus só em script, estilo e moldura', () => {
    const csp = montarCsp({ emDesenvolvimento: false })
    expect(csp).toMatch(/script-src [^;]*https:\/\/giscus\.app/)
    // O client.js do giscus injeta a folha https://giscus.app/default.css, que dá largura ao quadro.
    expect(csp).toMatch(/style-src [^;]*https:\/\/giscus\.app/)
    expect(csp).toMatch(/frame-src https:\/\/giscus\.app/)
    expect(csp).not.toMatch(/connect-src [^;]*giscus/)
  })

  it('em desenvolvimento libera eval e websocket, que o Next usa', () => {
    const csp = montarCsp({ emDesenvolvimento: true })
    expect(csp).toContain("'unsafe-eval'")
    expect(csp).toMatch(/connect-src 'self' ws:/)
  })
})

describe('cabecalhosDeSeguranca', () => {
  it('traz os seis cabeçalhos e nenhum cita a hospedagem', () => {
    const cabecalhos = cabecalhosDeSeguranca({ emDesenvolvimento: false })
    expect(cabecalhos.map((c) => c.key)).toEqual([
      'Content-Security-Policy',
      'Strict-Transport-Security',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Referrer-Policy',
      'Permissions-Policy',
    ])
    expect(JSON.stringify(cabecalhos)).not.toContain('vercel.app')
  })
})

describe('redirecionamentosDeHost', () => {
  it('em produção manda qualquer host da hospedagem para o domínio próprio, com 308', () => {
    expect(redirecionamentosDeHost({ ambienteVercel: 'production' })).toEqual([
      {
        source: '/:caminho*',
        has: [{ type: 'host', value: '.*\\.vercel\\.app' }],
        destination: 'https://blog.andrecury.dev.br/:caminho*',
        permanent: true,
      },
    ])
  })

  it('fora de produção não redireciona, para os previews continuarem abrindo', () => {
    expect(redirecionamentosDeHost({ ambienteVercel: 'preview' })).toEqual([])
    expect(redirecionamentosDeHost({ ambienteVercel: undefined })).toEqual([])
  })
})
