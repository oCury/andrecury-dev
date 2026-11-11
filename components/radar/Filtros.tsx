'use client'

import Link from 'next/link'
import type { Artigo } from '@/lib/radar/esquema'
import type { Estado } from '@/lib/radar/estadoUrl'
import { contar, filtrar } from '@/lib/radar/filtro'
import { corDaArea, rotuloDaArea, rotuloDaSemana } from '@/lib/radar/formato'
import { mudarEstado } from './estadoNaUrl'

const CONCEITOS_VISIVEIS = 18

interface Props {
  artigos: readonly Artigo[]
  estado: Estado
  semanaAtual: string
  semanas: readonly string[]
}

export function Filtros({ artigos, estado, semanaAtual, semanas }: Props) {
  const areas = contar(filtrar(artigos, estado, ['area']), (artigo) => [artigo.categoria])
  const todosOsConceitos = contar(filtrar(artigos, estado, ['conceito']), (artigo) => artigo.conceitos)
  const maisFrequentes = todosOsConceitos.slice(0, CONCEITOS_VISIVEIS)
  // O conceito ativo aparece sempre, mesmo fora dos mais frequentes: sem isso o filtro ficava ligado e invisível.
  const ativo = todosOsConceitos.find(([conceito]) => conceito === estado.conceito)
  const conceitos = ativo && !maisFrequentes.includes(ativo) ? [...maisFrequentes, ativo] : maisFrequentes
  return (
    <aside className="filtros" aria-label="Filtros">
      <label className="busca">
        <span className="rotulo">Buscar <kbd>/</kbd></span>
        <input type="search" placeholder="título ou autor" autoComplete="off" spellCheck={false}
          value={estado.q} onChange={(evento) => mudarEstado({ q: evento.target.value })} />
      </label>

      <details className="grupo" open>
        <summary className="rotulo">Semana</summary>
        <div className="pilha">
          {semanas.map((semana) => (
            <Link key={semana} href={`/radar/${semana}`} className="opcao" aria-current={semana === semanaAtual ? 'page' : undefined}>
              {rotuloDaSemana(semana)}
            </Link>
          ))}
        </div>
      </details>

      <details className="grupo" open>
        <summary className="rotulo">Área</summary>
        <div className="pilha">
          {areas.map(([area, total]) => (
            <button key={area} type="button" className="opcao" aria-pressed={area === estado.area}
              onClick={() => mudarEstado({ area: area === estado.area ? '' : area })}>
              <span className="marca" style={corDaArea(area)} aria-hidden="true" />
              <span>{rotuloDaArea(area)}</span>
              <span className="conta">{total}</span>
            </button>
          ))}
        </div>
      </details>

      <details className="grupo" open>
        <summary className="rotulo">Conceito</summary>
        <div className="nuvem">
          {conceitos.map(([conceito, total]) => (
            <button key={conceito} type="button" className="etiqueta" aria-pressed={conceito === estado.conceito}
              onClick={() => mudarEstado({ conceito: conceito === estado.conceito ? '' : conceito })}>
              {conceito} {total}
            </button>
          ))}
        </div>
      </details>
    </aside>
  )
}
