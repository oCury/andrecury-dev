'use client'

import { useEffect, useMemo, useRef } from 'react'
import type { SemanaDoRadar } from '@/lib/radar/esquema'
import { filtrar, ordenar, ORDENS, type Ordem } from '@/lib/radar/filtro'
import { partesDaSemana } from '@/lib/radar/formato'
import { mudarEstado, useEstadoDoRadar, useHidratado } from './estadoNaUrl'
import { Filtros } from './Filtros'
import { ListaDeArtigos } from './ListaDeArtigos'
import { PainelDeLeitura } from './PainelDeLeitura'

const TELA_ESTREITA = '(max-width: 760px)'
const ROTULOS_DE_ORDEM: Record<Ordem, string> = { nota: 'Maior nota', votos: 'Mais votados', data: 'Mais recentes' }
const CAMPO_DE_TEXTO = /^(INPUT|SELECT|TEXTAREA)$/

export function RadarSemana({ edicao, semanas }: { edicao: SemanaDoRadar; semanas: readonly string[] }) {
  const estado = useEstadoDoRadar()
  const hidratado = useHidratado()
  const raiz = useRef<HTMLDivElement>(null)
  const visiveis = useMemo(() => ordenar(filtrar(edicao.artigos, estado), estado.ordem), [edicao.artigos, estado])
  const aberto = edicao.artigos.find((artigo) => artigo.chave === estado.artigo) ?? null
  const { ano, numero } = partesDaSemana(edicao.semana)

  // Em tela estreita os filtros começam recolhidos para a lista aparecer logo.
  useEffect(() => {
    if (!window.matchMedia(TELA_ESTREITA).matches) return
    raiz.current?.querySelectorAll('details').forEach((grupo) => { grupo.open = false })
  }, [])

  useEffect(() => {
    function andar(passo: number) {
      if (visiveis.length === 0) return
      const posicao = visiveis.findIndex((artigo) => artigo.chave === estado.artigo)
      const alvo = visiveis[Math.max(0, Math.min(visiveis.length - 1, posicao + passo))]
      mudarEstado({ artigo: alvo.chave })
    }
    function aoTeclar(evento: KeyboardEvent) {
      const alvo = evento.target as HTMLElement
      const digitando = CAMPO_DE_TEXTO.test(alvo.tagName)
      if (evento.key === 'Escape') {
        if (digitando) alvo.blur()
        else if (estado.artigo) mudarEstado({ artigo: '' })
        return
      }
      if (digitando || evento.metaKey || evento.ctrlKey || evento.altKey) return
      if (evento.key === '/') {
        evento.preventDefault()
        raiz.current?.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
      }
      if (evento.key === 'j') andar(1)
      if (evento.key === 'k') andar(-1)
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [visiveis, estado.artigo])

  useEffect(() => {
    raiz.current?.querySelector('.item[aria-current="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [estado.artigo])

  return (
    <div ref={raiz} className="radar" data-lendo={aberto ? 'true' : undefined} data-pronto={hidratado ? 'true' : undefined}>
      <header className="cabecalho">
        <p className="cabecalho-rotulo">Leitura semanal · IA e tecnologia · {ano}</p>
        <h1 className="cabecalho-titulo">Radar <span className="cabecalho-edicao">nº {numero}</span></h1>
        <p className="cabecalho-funil">
          <strong>{edicao.totais.triados.toLocaleString('pt-BR')}</strong> artigos triados →{' '}
          <strong>{edicao.artigos.length}</strong> resumidos para leitura
        </p>
      </header>

      <div className="pagina">
        <Filtros artigos={edicao.artigos} estado={estado} semanaAtual={edicao.semana} semanas={semanas} />
        <section id="lista" className="lista" aria-label="Artigos da semana">
          <div className="lista-topo">
            <p className="rotulo" aria-live="polite">{visiveis.length} artigo(s)</p>
            <label className="ordem">
              <span className="rotulo">Ordenar</span>
              <select value={estado.ordem} onChange={(evento) => mudarEstado({ ordem: evento.target.value as Ordem })}>
                {ORDENS.map((ordem) => <option key={ordem} value={ordem}>{ROTULOS_DE_ORDEM[ordem]}</option>)}
              </select>
            </label>
          </div>
          <ListaDeArtigos artigos={visiveis} chaveAberta={estado.artigo} />
          {visiveis.length === 0 && (
            <p className="vazio">
              Nenhum artigo com esses filtros.{' '}
              <button type="button" className="link" onClick={() => mudarEstado({ area: '', conceito: '', q: '' })}>Limpar filtros</button>
            </p>
          )}
        </section>
        <PainelDeLeitura artigo={aberto} conceitoAtivo={estado.conceito} />
      </div>

      <footer className="rodape">
        <p><kbd>j</kbd> <kbd>k</kbd> percorrem a lista · <kbd>/</kbd> busca · <kbd>Esc</kbd> fecha a leitura</p>
      </footer>
    </div>
  )
}
