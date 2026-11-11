'use client'

import Link from 'next/link'
import type { MouseEvent } from 'react'
import type { Artigo } from '@/lib/radar/esquema'
import { corDaArea, rotuloDaArea, virgula } from '@/lib/radar/formato'
import { mudarEstado } from './estadoNaUrl'

/** Clique simples abre o painel; com tecla modificadora o link segue para a página do artigo. */
function abrirNoPainel(evento: MouseEvent<HTMLAnchorElement>, chave: string) {
  if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return
  evento.preventDefault()
  mudarEstado({ artigo: chave })
}

export function ListaDeArtigos({ artigos, chaveAberta }: { artigos: readonly Artigo[]; chaveAberta: string }) {
  return (
    <ol className="artigos">
      {artigos.map((artigo) => (
        <li key={artigo.chave}>
          <Link href={`/radar/artigo/${artigo.chave}`} prefetch={false} className="item" style={corDaArea(artigo.categoria)}
            aria-current={artigo.chave === chaveAberta ? 'true' : undefined}
            onClick={(evento) => abrirNoPainel(evento, artigo.chave)}>
            <span className="item-nota">{virgula(artigo.nota, 1)}<small>NOTA</small></span>
            <span className="item-titulo">{artigo.titulo}</span>
            <span className="item-frase">{artigo.frase}</span>
            <span className="item-meta">
              <span className="area">{rotuloDaArea(artigo.categoria)}</span>
              <span>{artigo.publicado}</span>
              {artigo.votos > 0 && <span>{artigo.votos} votos</span>}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  )
}
