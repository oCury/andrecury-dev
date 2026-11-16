import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { listarPosts, listarProjetos } from './ler'

function pastaCom(arquivos: Record<string, string>): string {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'conteudo-'))
  for (const [nome, texto] of Object.entries(arquivos)) fs.writeFileSync(path.join(pasta, nome), texto)
  return pasta
}

const mdx = (campos: string) => `---\n${campos}\n---\n\nTexto.\n`
const projeto = (campos: string) => mdx(`resumo: r\nano: 2026\nestado: em uso\n${campos}`)

describe('listarPosts', () => {
  it('ordena do mais novo para o mais antigo', () => {
    const pasta = pastaCom({
      'antigo.mdx': mdx('titulo: Antigo\ndata: "2026-01-05"\nresumo: r'),
      'novo.mdx': mdx('titulo: Novo\ndata: "2026-11-11"\nresumo: r'),
    })
    expect(listarPosts(pasta, false).map((post) => post.slug)).toEqual(['novo', 'antigo'])
  })

  it('aceita data sem aspas, que o YAML entrega como Date, e devolve AAAA-MM-DD', () => {
    const pasta = pastaCom({ 'a.mdx': mdx('titulo: A\ndata: 2026-01-05\nresumo: r') })
    expect(listarPosts(pasta, false)[0].data).toBe('2026-01-05')
  })

  it('esconde rascunho, a não ser que seja pedido', () => {
    const pasta = pastaCom({ 'a.mdx': mdx('titulo: A\ndata: 2026-01-05\nresumo: r\nrascunho: true') })
    expect(listarPosts(pasta, false)).toEqual([])
    expect(listarPosts(pasta, true)).toHaveLength(1)
  })

  it('recusa chave desconhecida, para um erro de digitação em rascunho não publicar o texto', () => {
    const pasta = pastaCom({ 'quase.mdx': mdx('titulo: A\ndata: 2026-01-05\nresumo: r\nrascunhos: true') })
    expect(() => listarPosts(pasta, false)).toThrow(/quase\.mdx[\s\S]*rascunhos/)
  })

  it('falha citando o arquivo e o campo quando falta o título', () => {
    const pasta = pastaCom({ 'sem-titulo.mdx': mdx('data: 2026-01-05\nresumo: r') })
    expect(() => listarPosts(pasta, false)).toThrow(/sem-titulo\.mdx[\s\S]*titulo/)
  })

  it('recusa nome de arquivo fora do padrão', () => {
    const pasta = pastaCom({ 'Meu Post.mdx': mdx('titulo: A\ndata: 2026-01-05\nresumo: r') })
    expect(() => listarPosts(pasta, false)).toThrow(/nome de arquivo inválido/)
  })

  it('devolve lista vazia quando a pasta não existe', () => {
    expect(listarPosts(path.join(os.tmpdir(), 'pasta-que-nao-existe'), false)).toEqual([])
  })
})

describe('listarProjetos', () => {
  it('ordena por ordem e, no empate, pelo ano mais recente', () => {
    const pasta = pastaCom({
      'c.mdx': projeto('titulo: C\nordem: 2'),
      'a.mdx': mdx('titulo: A\nresumo: r\nano: 2024\nestado: estudo\nordem: 1'),
      'b.mdx': projeto('titulo: B\nordem: 1'),
    })
    expect(listarProjetos(pasta, false).map((p) => p.slug)).toEqual(['b', 'a', 'c'])
  })

  it('recusa link que não seja https', () => {
    const pasta = pastaCom({ 'a.mdx': projeto('titulo: A\nlink: "javascript:alert(1)"') })
    expect(() => listarProjetos(pasta, false)).toThrow(/a\.mdx[\s\S]*link/)
  })
})

const IMAGEM = 'imagem:\n  arquivo: agendahora\n  alt: Agenda com consultas do dia\n  largura: 1600\n  altura: 1000'

describe('esquema de projeto em destaque', () => {
  it('aceita destaque com imagem e resultado', () => {
    const pasta = pastaCom({ 'a.mdx': projeto(`titulo: A\ndestaque: true\nresultado: 170 rotas\n${IMAGEM}`) })
    const [a] = listarProjetos(pasta, false)
    expect(a.destaque).toBe(true)
    expect(a.imagem).toEqual({ arquivo: 'agendahora', alt: 'Agenda com consultas do dia', largura: 1600, altura: 1000 })
    expect(a.resultado).toBe('170 rotas')
  })

  it('projeto comum não é destaque e dispensa imagem e resultado', () => {
    const pasta = pastaCom({ 'a.mdx': projeto('titulo: A') })
    const [a] = listarProjetos(pasta, false)
    expect(a.destaque).toBe(false)
    expect(a.imagem).toBeUndefined()
    expect(a.resultado).toBeUndefined()
  })

  it('recusa destaque sem imagem, citando o arquivo e o campo', () => {
    const pasta = pastaCom({ 'a.mdx': projeto('titulo: A\ndestaque: true\nresultado: x') })
    expect(() => listarProjetos(pasta, false)).toThrow(/a\.mdx[\s\S]*imagem/)
  })

  it('recusa destaque sem resultado, citando o arquivo e o campo', () => {
    const pasta = pastaCom({ 'a.mdx': projeto(`titulo: A\ndestaque: true\n${IMAGEM}`) })
    expect(() => listarProjetos(pasta, false)).toThrow(/a\.mdx[\s\S]*resultado/)
  })

  it('recusa nome de arquivo de imagem com caminho ou extensão', () => {
    const ruim = 'imagem:\n  arquivo: ../x.png\n  alt: t\n  largura: 1600\n  altura: 1000'
    const pasta = pastaCom({ 'a.mdx': projeto(`titulo: A\ndestaque: true\nresultado: x\n${ruim}`) })
    expect(() => listarProjetos(pasta, false)).toThrow(/imagem\.arquivo/)
  })

  it('recusa dimensão que não seja inteiro positivo', () => {
    const ruim = 'imagem:\n  arquivo: x\n  alt: t\n  largura: 0\n  altura: 1000'
    const pasta = pastaCom({ 'a.mdx': projeto(`titulo: A\ndestaque: true\nresultado: x\n${ruim}`) })
    expect(() => listarProjetos(pasta, false)).toThrow(/imagem\.largura/)
  })
})
