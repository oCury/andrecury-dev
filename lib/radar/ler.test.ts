import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { artigoDeExemplo } from './exemplos'
import { buscarArtigo, lerSemana, listarSemanas } from './ler'

const edicao = (semana: string, artigos: unknown[]) =>
  JSON.stringify({ semana, totais: { coletados: 10, triados: 8 }, artigos })

function pastaCom(arquivos: Record<string, string>): string {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'radar-'))
  for (const [nome, texto] of Object.entries(arquivos)) fs.writeFileSync(path.join(pasta, nome), texto)
  return pasta
}

describe('leitura do radar', () => {
  it('lista as semanas da mais nova para a mais antiga', () => {
    const pasta = pastaCom({ '2026-W45.json': edicao('2026-W45', []), '2026-W46.json': edicao('2026-W46', []) })
    expect(listarSemanas(pasta)).toEqual(['2026-W46', '2026-W45'])
  })

  it('lê uma edição válida', () => {
    const pasta = pastaCom({ '2026-W46.json': edicao('2026-W46', [artigoDeExemplo()]) })
    expect(lerSemana('2026-W46', pasta)?.artigos[0].titulo).toBe('Um artigo sobre agentes')
  })

  it('recusa arquivo que traga o caminho local da nota', () => {
    const vazado = { ...artigoDeExemplo(), nota_caminho: '/Users/alguem/vault/nota.md' }
    const pasta = pastaCom({ '2026-W46.json': edicao('2026-W46', [vazado]) })
    expect(() => lerSemana('2026-W46', pasta)).toThrow(/2026-W46\.json/)
  })

  it('recusa arquivo cujo nome não bate com a semana de dentro', () => {
    const pasta = pastaCom({ '2026-W46.json': edicao('2026-W45', []) })
    expect(() => lerSemana('2026-W46', pasta)).toThrow(/diz ser da semana 2026-W45/)
  })

  it('recusa artigo guardado na semana errada e chave que não serve de endereço', () => {
    const outraSemana = pastaCom({ '2026-W46.json': edicao('2026-W46', [artigoDeExemplo({ semana: '2026-W45' })]) })
    expect(() => lerSemana('2026-W46', outraSemana)).toThrow(/2611\.00001/)
    const chaveRuim = pastaCom({ '2026-W46.json': edicao('2026-W46', [artigoDeExemplo({ chave: '../x' })]) })
    expect(() => lerSemana('2026-W46', chaveRuim)).toThrow(/chave/)
  })

  it('recusa arquivo .json com nome fora do padrão', () => {
    expect(() => listarSemanas(pastaCom({ 'rascunho.json': '{}' }))).toThrow(/rascunho\.json/)
  })

  it('devolve vazio ou null quando não há o que ler', () => {
    const pasta = pastaCom({})
    expect(listarSemanas(path.join(pasta, 'nao-existe'))).toEqual([])
    expect(lerSemana('2026-W01', pasta)).toBeNull()
    expect(lerSemana('../../etc/passwd', pasta)).toBeNull()
  })

  it('encontra um artigo pela chave em qualquer semana', () => {
    const pasta = pastaCom({
      '2026-W45.json': edicao('2026-W45', [artigoDeExemplo({ chave: '2611.00009', semana: '2026-W45' })]),
      '2026-W46.json': edicao('2026-W46', [artigoDeExemplo()]),
    })
    expect(buscarArtigo('2611.00009', pasta)?.semana).toBe('2026-W45')
    expect(buscarArtigo('0000.00000', pasta)).toBeNull()
  })
})
