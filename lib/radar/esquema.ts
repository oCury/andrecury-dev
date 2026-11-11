import { z } from 'zod'
import { CHAVE_VALIDA, SEMANA_VALIDA } from './constantes'

// Só servidor e testes importam valores daqui; código de cliente usa `import type` ou constantes.ts.

// strictObject: campo a mais (como nota_caminho) derruba o build em vez de ir para o ar.
export const esquemaArtigo = z.strictObject({
  id: z.string().regex(/^(\d{4}\.\d{4,5})?$/),
  chave: z.string().regex(CHAVE_VALIDA),
  titulo: z.string().min(1),
  autores: z.string(),
  publicado: z.string(),
  semana: z.string().regex(SEMANA_VALIDA),
  categoria: z.string(),
  nota: z.number(),
  relevancia: z.number(),
  novo: z.number(),
  votos: z.number().int(),
  resumido: z.literal(true),
  frase: z.string(),
  secoes: z.array(z.tuple([z.string(), z.string()])),
  conceitos: z.array(z.string()),
  abstract: z.string(),
})

export const esquemaSemana = z.strictObject({
  semana: z.string().regex(SEMANA_VALIDA),
  totais: z.strictObject({ coletados: z.number().int(), triados: z.number().int() }),
  artigos: z.array(esquemaArtigo),
})

export type Artigo = z.infer<typeof esquemaArtigo>
export type SemanaDoRadar = z.infer<typeof esquemaSemana>
