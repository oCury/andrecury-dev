import { describe, expect, it } from 'vitest'
import { ESTADO_PADRAO, escreverEstado, lerEstado } from './estadoUrl'

describe('estado no endereço', () => {
  it('endereço vazio é o estado padrão, e o padrão não escreve nada', () => {
    expect(lerEstado('')).toEqual(ESTADO_PADRAO)
    expect(escreverEstado(ESTADO_PADRAO)).toBe('')
  })

  it('vai e volta sem perder nada', () => {
    const estado = { area: 'agentes', conceito: 'tool use', q: 'memória', ordem: 'votos' as const, artigo: '2611.00001' }
    expect(lerEstado(escreverEstado(estado))).toEqual(estado)
  })

  it('troca ordem desconhecida pela padrão e descarta artigo que não é chave válida', () => {
    expect(lerEstado('?ordem=aleatoria').ordem).toBe('nota')
    expect(lerEstado('?artigo=%3Cscript%3E').artigo).toBe('')
    expect(lerEstado('?artigo=../../x').artigo).toBe('')
  })

  it('corta texto longo demais', () => {
    expect(lerEstado(`?q=${'a'.repeat(500)}`).q).toHaveLength(100)
  })
})
