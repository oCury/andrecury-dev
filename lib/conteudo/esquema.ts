import { z } from 'zod'

const texto = z.string().min(1)
const enderecoHttps = z.string().regex(/^https:\/\/\S+$/, 'use um endereço https://')
const dataIso = z.preprocess(
  (valor) => (valor instanceof Date ? valor.toISOString().slice(0, 10) : valor),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use AAAA-MM-DD'),
)

export const esquemaPost = z.strictObject({
  titulo: texto,
  data: dataIso,
  resumo: texto,
  tags: z.array(texto).default([]),
  rascunho: z.boolean().default(false),
})

export const ESTADOS_DE_PROJETO = ['em uso', 'em desenvolvimento', 'estudo', 'encerrado'] as const

const nomeDeArquivo = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'use minúsculas, números e hífens, sem caminho nem extensão')

const imagemDeProjeto = z.strictObject({
  arquivo: nomeDeArquivo,
  alt: texto,
  largura: z.number().int().positive(),
  altura: z.number().int().positive(),
})

export const esquemaProjeto = z
  .strictObject({
    titulo: texto,
    resumo: texto,
    ano: z.number().int().min(2000).max(2100),
    estado: z.enum(ESTADOS_DE_PROJETO),
    stack: z.array(texto).default([]),
    link: enderecoHttps.optional(),
    repositorio: enderecoHttps.optional(),
    ordem: z.number().int().default(100),
    rascunho: z.boolean().default(false),
    destaque: z.boolean().default(false),
    imagem: imagemDeProjeto.optional(),
    resultado: texto.optional(),
  })
  .refine((projeto) => !projeto.destaque || projeto.imagem !== undefined, {
    path: ['imagem'],
    message: 'obrigatória quando destaque é true',
  })
  .refine((projeto) => !projeto.destaque || projeto.resultado !== undefined, {
    path: ['resultado'],
    message: 'obrigatório quando destaque é true',
  })

export type Post = z.infer<typeof esquemaPost> & { slug: string }
export type Projeto = z.infer<typeof esquemaProjeto> & { slug: string }
