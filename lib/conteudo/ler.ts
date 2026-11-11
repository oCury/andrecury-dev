import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { z } from 'zod'
import { esquemaPost, esquemaProjeto, type Post, type Projeto } from './esquema'

const PASTA_BLOG = path.join(process.cwd(), 'content', 'blog')
const PASTA_PROJETOS = path.join(process.cwd(), 'content', 'projetos')
const EXTENSAO = '.mdx'
const SLUG_VALIDO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const rascunhosVisiveis = (): boolean => process.env.MOSTRAR_RASCUNHOS === '1'

function lerPasta<Saida extends object>(pasta: string, esquema: z.ZodType<Saida>): Array<Saida & { slug: string }> {
  if (!fs.existsSync(pasta)) return []
  return fs
    .readdirSync(pasta)
    .filter((nome) => nome.endsWith(EXTENSAO))
    .map((nome) => {
      const origem = path.join(pasta, nome)
      const slug = nome.slice(0, -EXTENSAO.length)
      if (!SLUG_VALIDO.test(slug)) {
        throw new Error(`${origem}: nome de arquivo inválido; use minúsculas, números e hífens`)
      }
      const lido = esquema.safeParse(matter(fs.readFileSync(origem, 'utf8')).data)
      if (!lido.success) {
        const problemas = lido.error.issues.map((p) => `${p.path.join('.') || 'frontmatter'}: ${p.message}`).join('; ')
        throw new Error(`${origem}: frontmatter inválido (${problemas})`)
      }
      return { ...lido.data, slug }
    })
}

export function listarPosts(pasta = PASTA_BLOG, comRascunhos = rascunhosVisiveis()): Post[] {
  return lerPasta(pasta, esquemaPost)
    .filter((post) => comRascunhos || !post.rascunho)
    .sort((a, b) => b.data.localeCompare(a.data) || a.slug.localeCompare(b.slug))
}

export function listarProjetos(pasta = PASTA_PROJETOS, comRascunhos = rascunhosVisiveis()): Projeto[] {
  return lerPasta(pasta, esquemaProjeto)
    .filter((projeto) => comRascunhos || !projeto.rascunho)
    .sort((a, b) => a.ordem - b.ordem || b.ano - a.ano || a.slug.localeCompare(b.slug))
}
