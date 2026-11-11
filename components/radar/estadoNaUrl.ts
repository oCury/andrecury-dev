'use client'

import { useSyncExternalStore } from 'react'
import { ESTADO_PADRAO, escreverEstado, lerEstado, type Estado } from '@/lib/radar/estadoUrl'

// O Safari limita history.replaceState a 100 chamadas em 30 s; digitar na busca passaria disso.
const ATRASO_DA_URL_MS = 200
const ouvintes = new Set<() => void>()
let atual: Estado | null = null
let temporizador: number | undefined

const avisar = () => ouvintes.forEach((ouvinte) => ouvinte())

function lerDoEndereco() {
  atual = lerEstado(window.location.search)
  avisar()
}

function instantaneo(): Estado {
  atual ??= lerEstado(window.location.search)
  return atual
}

function assinar(ouvinte: () => void) {
  ouvintes.add(ouvinte)
  if (ouvintes.size === 1) window.addEventListener('popstate', lerDoEndereco)
  return () => {
    ouvintes.delete(ouvinte)
    if (ouvintes.size > 0) return
    window.removeEventListener('popstate', lerDoEndereco)
    window.clearTimeout(temporizador)
    atual = null
  }
}

export function mudarEstado(parcial: Partial<Estado>): void {
  atual = { ...instantaneo(), ...parcial }
  avisar()
  window.clearTimeout(temporizador)
  temporizador = window.setTimeout(() => {
    if (atual) window.history.replaceState(null, '', `${window.location.pathname}${escreverEstado(atual)}`)
  }, ATRASO_DA_URL_MS)
}

/** No servidor e na hidratação vale o padrão; logo depois, o que estiver no endereço. */
export function useEstadoDoRadar(): Estado {
  return useSyncExternalStore(assinar, instantaneo, () => ESTADO_PADRAO)
}

const semAssinatura = () => () => {}

/** Falso no HTML do servidor, verdadeiro depois da hidratação; os testes esperam por isso. */
export function useHidratado(): boolean {
  return useSyncExternalStore(semAssinatura, () => true, () => false)
}
