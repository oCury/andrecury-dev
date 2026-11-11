import type { Artigo } from './esquema'

export function artigoDeExemplo(extra: Partial<Artigo> = {}): Artigo {
  return {
    id: '2611.00001', chave: '2611.00001', titulo: 'Um artigo sobre agentes', autores: 'Ana Silva',
    publicado: '2026-11-05', semana: '2026-W46', categoria: 'agentes', nota: 3.1, relevancia: 3.1, novo: 0.5,
    votos: 3, resumido: true, frase: 'Uma frase.', secoes: [['O que propõe', 'Texto.']],
    conceitos: ['llm agents'], abstract: '', ...extra,
  }
}
