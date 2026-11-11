import { describe, expect, it } from 'vitest'
import { dataPorExtenso } from './datas'

describe('dataPorExtenso', () => {
  it('escreve a data em português sem deslocar o dia pelo fuso', () => {
    expect(dataPorExtenso('2026-11-01')).toBe('1 de novembro de 2026')
  })
})
