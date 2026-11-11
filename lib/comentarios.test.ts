import { describe, expect, it } from 'vitest'
import { atributosDoGiscus, lerConfigDoGiscus } from './comentarios'

const completa = { repositorio: 'oCury/andrecury-dev', idDoRepositorio: 'R_abc', categoria: 'Comentários', idDaCategoria: 'DIC_abc' }

describe('lerConfigDoGiscus', () => {
  it('devolve a configuração quando os quatro valores existem', () => {
    expect(lerConfigDoGiscus(completa)).toEqual(completa)
  })

  it('devolve null quando falta qualquer valor', () => {
    expect(lerConfigDoGiscus({ ...completa, idDaCategoria: undefined })).toBeNull()
    expect(lerConfigDoGiscus({ ...completa, idDoRepositorio: '' })).toBeNull()
  })

  it('recusa repositório fora do formato dono/nome', () => {
    expect(lerConfigDoGiscus({ ...completa, repositorio: 'https://github.com/oCury/andrecury-dev' })).toBeNull()
  })
})

describe('atributosDoGiscus', () => {
  it('liga cada página à sua discussão pelo caminho, sem busca aproximada', () => {
    const atributos = atributosDoGiscus(completa)
    expect(atributos['data-repo']).toBe('oCury/andrecury-dev')
    expect(atributos['data-mapping']).toBe('pathname')
    expect(atributos['data-strict']).toBe('1')
    expect(atributos['data-lang']).toBe('pt')
    expect(atributos['data-theme']).toBe('preferred_color_scheme')
  })
})
