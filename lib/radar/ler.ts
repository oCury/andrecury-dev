import fs from 'node:fs'
import path from 'node:path'
import { SEMANA_VALIDA } from './constantes'
import { esquemaSemana, type Artigo, type SemanaDoRadar } from './esquema'

const PASTA_RADAR = path.join(process.cwd(), 'content', 'radar')
const EXTENSAO = '.json'

// turbopackIgnore: a pasta é parâmetro só para os testes; as páginas leem em tempo de build, e sem a marca
// o Turbopack rastrearia o projeto inteiro para dentro do código de servidor.
export function listarSemanas(pasta = PASTA_RADAR): string[] {
  if (!fs.existsSync(/* turbopackIgnore: true */ pasta)) return []
  const semanas = fs.readdirSync(/* turbopackIgnore: true */ pasta).filter((nome) => nome.endsWith(EXTENSAO)).map((nome) => nome.slice(0, -EXTENSAO.length))
  const invalida = semanas.find((semana) => !SEMANA_VALIDA.test(semana))
  if (invalida !== undefined) throw new Error(`${pasta}/${invalida}${EXTENSAO}: o nome precisa ser AAAA-Www.json`)
  return semanas.sort().reverse()
}

export function lerSemana(semana: string, pasta = PASTA_RADAR): SemanaDoRadar | null {
  if (!SEMANA_VALIDA.test(semana)) return null
  const origem = path.join(pasta, `${semana}${EXTENSAO}`)
  if (!fs.existsSync(origem)) return null
  const lido = esquemaSemana.safeParse(JSON.parse(fs.readFileSync(origem, 'utf8')))
  if (!lido.success) {
    const problemas = lido.error.issues.map((p) => `${p.path.join('.') || 'raiz'}: ${p.message}`).join('; ')
    throw new Error(`${origem}: formato inválido (${problemas})`)
  }
  if (lido.data.semana !== semana) throw new Error(`${origem}: o arquivo diz ser da semana ${lido.data.semana}`)
  const deslocado = lido.data.artigos.find((artigo) => artigo.semana !== semana)
  if (deslocado) throw new Error(`${origem}: o artigo ${deslocado.chave} é da semana ${deslocado.semana}`)
  return lido.data
}

export function listarArtigos(pasta = PASTA_RADAR): Artigo[] {
  return listarSemanas(pasta).flatMap((semana) => lerSemana(semana, pasta)?.artigos ?? [])
}

export function buscarArtigo(chave: string, pasta = PASTA_RADAR): Artigo | null {
  return listarArtigos(pasta).find((artigo) => artigo.chave === chave) ?? null
}
