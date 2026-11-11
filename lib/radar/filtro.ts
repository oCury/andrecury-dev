import type { Artigo } from './esquema'

export const ORDENS = ['nota', 'votos', 'data'] as const
export type Ordem = (typeof ORDENS)[number]

export interface Filtros {
  area: string
  conceito: string
  q: string
  ordem: Ordem
}

type FiltroIgnoravel = 'area' | 'conceito'

const COMPARADORES: Record<Ordem, (a: Artigo, b: Artigo) => number> = {
  nota: (a, b) => b.nota - a.nota,
  votos: (a, b) => b.votos - a.votos || b.nota - a.nota,
  data: (a, b) => b.publicado.localeCompare(a.publicado) || b.nota - a.nota,
}

const textoDeBusca = (artigo: Artigo): string => `${artigo.titulo} ${artigo.autores} ${artigo.frase}`.toLowerCase()

/** Artigos que passam em todos os filtros, menos nos campos em `ignorar`. */
export function filtrar(artigos: readonly Artigo[], filtros: Filtros, ignorar: readonly FiltroIgnoravel[] = []): Artigo[] {
  const termo = filtros.q.trim().toLowerCase()
  const vale = (campo: FiltroIgnoravel) => filtros[campo] !== '' && !ignorar.includes(campo)
  return artigos.filter(
    (artigo) =>
      (!vale('area') || artigo.categoria === filtros.area) &&
      (!vale('conceito') || artigo.conceitos.includes(filtros.conceito)) &&
      (termo === '' || textoDeBusca(artigo).includes(termo)),
  )
}

export function ordenar(artigos: readonly Artigo[], ordem: Ordem): Artigo[] {
  return [...artigos].sort(COMPARADORES[ordem])
}

export function contar(artigos: readonly Artigo[], chavesDe: (artigo: Artigo) => readonly string[]): Array<[string, number]> {
  const contagem = new Map<string, number>()
  for (const artigo of artigos) {
    for (const chave of chavesDe(artigo)) contagem.set(chave, (contagem.get(chave) ?? 0) + 1)
  }
  return [...contagem.entries()].sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]))
}
