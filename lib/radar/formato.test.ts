import { describe, expect, it } from 'vitest'
import { corDaArea, partesDaSemana, rotuloDaArea, rotuloDaSemana, segundaDaSemana, virgula } from './formato'
import { partirEnfase, separarParagrafos } from './texto'

describe('formato', () => {
  it('dá nome às áreas conhecidas e devolve a própria palavra nas desconhecidas', () => {
    expect(rotuloDaArea('avaliacao')).toBe('Avaliação')
    expect(rotuloDaArea('robotica')).toBe('robotica')
  })

  it('só usa cor de área conhecida, mesmo que o nome exista em todo objeto', () => {
    expect(corDaArea('modelos')).toEqual({ '--cat': 'var(--cat-modelos)' })
    expect(corDaArea('toString')).toEqual({ '--cat': 'var(--cat-outros)' })
  })

  it('escreve número com vírgula', () => {
    expect(virgula(3.14159, 1)).toBe('3,1')
  })

  it('separa ano e número da semana e recusa formato errado', () => {
    expect(partesDaSemana('2026-W46')).toEqual({ ano: 2026, numero: 46 })
    expect(rotuloDaSemana('2026-W46')).toBe('2026 · semana 46')
    expect(() => partesDaSemana('46/2026')).toThrow(/semana inválida/)
  })

  it('acha a segunda-feira da semana ISO, inclusive quando ela cai no ano anterior', () => {
    expect(segundaDaSemana('2026-W46')).toBe('2026-11-09')
    expect(segundaDaSemana('2026-W01')).toBe('2025-12-29')
  })
})

describe('texto', () => {
  it('separa parágrafos por linha em branco', () => {
    expect(separarParagrafos('um\n\n dois \n\n\n')).toEqual(['um', 'dois'])
  })

  it('marca como ênfase o que está entre asteriscos, sem gerar HTML', () => {
    expect(partirEnfase('a *b* c')).toEqual([
      { texto: 'a ', enfase: false },
      { texto: 'b', enfase: true },
      { texto: ' c', enfase: false },
    ])
    expect(partirEnfase('<script>')).toEqual([{ texto: '<script>', enfase: false }])
  })
})
