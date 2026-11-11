import { CHAVE_VALIDA } from './constantes'
import { ORDENS, type Filtros, type Ordem } from './filtro'

export interface Estado extends Filtros {
  artigo: string
}

export const ESTADO_PADRAO: Estado = { area: '', conceito: '', q: '', ordem: 'nota', artigo: '' }

const CAMPOS = ['area', 'conceito', 'q', 'ordem', 'artigo'] as const
const TAMANHO_MAXIMO = 100
const eOrdem = (valor: string): valor is Ordem => (ORDENS as readonly string[]).includes(valor)

/** Tudo que vem do endereço é dado de fora: cortar, validar e cair no padrão. */
export function lerEstado(busca: string): Estado {
  const lido = new URLSearchParams(busca)
  const texto = (campo: string) => (lido.get(campo) ?? '').slice(0, TAMANHO_MAXIMO)
  const ordem = texto('ordem')
  const artigo = texto('artigo')
  return {
    area: texto('area'),
    conceito: texto('conceito'),
    q: texto('q'),
    ordem: eOrdem(ordem) ? ordem : ESTADO_PADRAO.ordem,
    artigo: CHAVE_VALIDA.test(artigo) ? artigo : '',
  }
}

export function escreverEstado(estado: Estado): string {
  const saida = new URLSearchParams()
  for (const campo of CAMPOS) {
    if (estado[campo] !== ESTADO_PADRAO[campo]) saida.set(campo, estado[campo])
  }
  const texto = saida.toString()
  return texto === '' ? '' : `?${texto}`
}
