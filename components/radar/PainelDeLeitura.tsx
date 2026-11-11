'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import type { Artigo } from '@/lib/radar/esquema'
import { corDaArea } from '@/lib/radar/formato'
import { CorpoDoArtigo } from './CorpoDoArtigo'
import { mudarEstado } from './estadoNaUrl'

export function PainelDeLeitura({ artigo, conceitoAtivo }: { artigo: Artigo | null; conceitoAtivo: string }) {
  const painel = useRef<HTMLElement>(null)
  const chave = artigo?.chave

  useEffect(() => {
    if (painel.current) painel.current.scrollTop = 0
  }, [chave])

  return (
    <article ref={painel} className="leitura" aria-live="polite" style={artigo ? corDaArea(artigo.categoria) : undefined}>
      {artigo ? (
        <>
          <button type="button" className="botao secundario leitura-fechar" onClick={() => mudarEstado({ artigo: '' })}>
            ← Voltar à lista
          </button>
          <CorpoDoArtigo artigo={artigo} nivelDoTitulo="h2"
            conceitos={artigo.conceitos.map((conceito) => (
              <button key={conceito} type="button" className="etiqueta" aria-pressed={conceito === conceitoAtivo}
                onClick={() => mudarEstado({ conceito, artigo: '' })}>
                {conceito}
              </button>
            ))}
            acoesExtras={<Link className="botao secundario" href={`/radar/artigo/${artigo.chave}`}>Link permanente</Link>} />
        </>
      ) : (
        <p className="leitura-vazia">Escolha um artigo da lista para ler o resumo, as limitações e os conceitos ligados a ele.</p>
      )}
    </article>
  )
}
