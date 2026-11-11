export interface ConfigDoGiscus {
  repositorio: string
  idDoRepositorio: string
  categoria: string
  idDaCategoria: string
}

const REPOSITORIO_VALIDO = /^[\w.-]+\/[\w.-]+$/

export function lerConfigDoGiscus(valores: Partial<Record<keyof ConfigDoGiscus, string | undefined>>): ConfigDoGiscus | null {
  const { repositorio, idDoRepositorio, categoria, idDaCategoria } = valores
  if (!repositorio || !idDoRepositorio || !categoria || !idDaCategoria) return null
  if (!REPOSITORIO_VALIDO.test(repositorio)) return null
  return { repositorio, idDoRepositorio, categoria, idDaCategoria }
}

export function atributosDoGiscus(config: ConfigDoGiscus): Record<string, string> {
  return {
    'data-repo': config.repositorio,
    'data-repo-id': config.idDoRepositorio,
    'data-category': config.categoria,
    'data-category-id': config.idDaCategoria,
    'data-mapping': 'pathname',
    'data-strict': '1',
    'data-reactions-enabled': '1',
    'data-emit-metadata': '0',
    'data-input-position': 'top',
    'data-theme': 'preferred_color_scheme',
    'data-lang': 'pt',
  }
}

// O Next só embute variável pública escrita por extenso, uma a uma.
export const CONFIG_DO_GISCUS = lerConfigDoGiscus({
  repositorio: process.env.NEXT_PUBLIC_GISCUS_REPO,
  idDoRepositorio: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
  categoria: process.env.NEXT_PUBLIC_GISCUS_CATEGORIA,
  idDaCategoria: process.env.NEXT_PUBLIC_GISCUS_CATEGORIA_ID,
})
