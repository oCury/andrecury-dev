import type { CSSProperties } from 'react'
import { AREAS, SEMANA_VALIDA } from './esquema'

const DIAS_DA_SEMANA = 7
const eAreaConhecida = (categoria: string): categoria is keyof typeof AREAS => Object.hasOwn(AREAS, categoria)

export const rotuloDaArea = (categoria: string): string => (eAreaConhecida(categoria) ? AREAS[categoria] : categoria)

export const corDaArea = (categoria: string): CSSProperties =>
  ({ '--cat': `var(--cat-${eAreaConhecida(categoria) ? categoria : 'outros'})` }) as CSSProperties

export const virgula = (valor: number, casas: number): string => valor.toFixed(casas).replace('.', ',')

export function partesDaSemana(semana: string): { ano: number; numero: number } {
  if (!SEMANA_VALIDA.test(semana)) throw new Error(`semana inválida: ${semana}`)
  const [ano, numero] = semana.split('-W').map(Number)
  return { ano, numero }
}

export function rotuloDaSemana(semana: string): string {
  const { ano, numero } = partesDaSemana(semana)
  return `${ano} · semana ${numero}`
}

/** Segunda-feira da semana ISO: a semana 1 é a que contém o dia 4 de janeiro. */
export function segundaDaSemana(semana: string): string {
  const { ano, numero } = partesDaSemana(semana)
  const diaDoQuatro = new Date(Date.UTC(ano, 0, 4)).getUTCDay() || DIAS_DA_SEMANA
  const segunda = new Date(Date.UTC(ano, 0, 4 - (diaDoQuatro - 1) + (numero - 1) * DIAS_DA_SEMANA))
  return segunda.toISOString().slice(0, 10)
}
