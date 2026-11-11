import { describe, expect, it } from 'vitest'
import { artigoDeExemplo } from './exemplos'
import { contar, filtrar, ordenar, type Filtros } from './filtro'

const SEM_FILTRO: Filtros = { area: '', conceito: '', q: '', ordem: 'nota' }
const artigos = [
  artigoDeExemplo({ chave: 'a', titulo: 'Agentes que planejam', categoria: 'agentes', conceitos: ['planning'], nota: 3.0, votos: 9, publicado: '2026-11-03' }),
  artigoDeExemplo({ chave: 'b', titulo: 'Compressão de modelos', categoria: 'modelos', conceitos: ['model compression', 'planning'], nota: 3.8, votos: 0, publicado: '2026-11-06' }),
  artigoDeExemplo({ chave: 'c', titulo: 'Avaliar agentes', autores: 'Bo Li', categoria: 'agentes', conceitos: [], nota: 3.4, votos: 9, publicado: '2026-11-05' }),
]
const chaves = (lista: ReturnType<typeof filtrar>) => lista.map((a) => a.chave)

describe('filtrar', () => {
  it('sem filtro devolve tudo', () => {
    expect(chaves(filtrar(artigos, SEM_FILTRO))).toEqual(['a', 'b', 'c'])
  })

  it('combina área, conceito e busca', () => {
    expect(chaves(filtrar(artigos, { ...SEM_FILTRO, area: 'agentes' }))).toEqual(['a', 'c'])
    expect(chaves(filtrar(artigos, { ...SEM_FILTRO, conceito: 'planning' }))).toEqual(['a', 'b'])
    expect(chaves(filtrar(artigos, { ...SEM_FILTRO, area: 'agentes', conceito: 'planning' }))).toEqual(['a'])
  })

  it('busca em título e autores, sem diferenciar maiúsculas', () => {
    expect(chaves(filtrar(artigos, { ...SEM_FILTRO, q: '  AGENTES ' }))).toEqual(['a', 'c'])
    expect(chaves(filtrar(artigos, { ...SEM_FILTRO, q: 'bo li' }))).toEqual(['c'])
  })

  it('ignora o filtro pedido, para contar as opções do próprio grupo', () => {
    expect(chaves(filtrar(artigos, { ...SEM_FILTRO, area: 'modelos' }, ['area']))).toEqual(['a', 'b', 'c'])
  })
})

describe('ordenar', () => {
  it('por nota, por votos com desempate na nota, e por data', () => {
    expect(chaves(ordenar(artigos, 'nota'))).toEqual(['b', 'c', 'a'])
    expect(chaves(ordenar(artigos, 'votos'))).toEqual(['c', 'a', 'b'])
    expect(chaves(ordenar(artigos, 'data'))).toEqual(['b', 'c', 'a'])
  })

  it('não altera a lista recebida', () => {
    ordenar(artigos, 'nota')
    expect(chaves(artigos)).toEqual(['a', 'b', 'c'])
  })
})

describe('contar', () => {
  it('conta por chave, do mais frequente para o menos, com desempate alfabético', () => {
    expect(contar(artigos, (a) => [a.categoria])).toEqual([['agentes', 2], ['modelos', 1]])
    expect(contar(artigos, (a) => a.conceitos)).toEqual([['planning', 2], ['model compression', 1]])
  })
})
