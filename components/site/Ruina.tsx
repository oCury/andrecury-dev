'use client'

// Ruína: fotos de um templo tomado pela selva, com a tecnologia de quem o construiu ainda embutida na pedra.
// As imagens ficam em /public/ruina (cena de dia para o tema claro, a mesma cena à noite para o escuro).
// "capa" monta a cena inteira em camadas; "faixa" é uma tira da mesma cena para cabeçalhos baixos; "rodape" põe a relva sobre a linha do rodapé.
// Decorativa e fora do fluxo: o bloco que a recebe precisa de position: relative e isolation: isolate.
// O servidor entrega tudo parado; paralaxe e balanço vêm de animarRuina.ts (sem JavaScript ou com "reduzir movimento", fica a foto).

/* eslint-disable @next/next/no-img-element -- <picture> troca a foto pelo tema e os arquivos já saem nos tamanhos certos; next/image não cobre a troca por tema */

import { useEffect, useRef, type CSSProperties } from 'react'
import { animarRuina } from './animarRuina'

type Variante = 'capa' | 'faixa' | 'rodape'
type Tema = 'dia' | 'noite'
type Cipo = { arquivo: number; x: number; soEmTelaLarga?: boolean }

const LARGURAS_DA_CENA = [960, 1600, 2400] as const
// No celular a foto cobre a capa pela altura, então ocupa bem mais que a largura da tela; na faixa, cobre pela largura.
const TAMANHOS_DA_CENA = { capa: '(max-width: 1000px) 250vw, 106vw', faixa: '106vw' } as const
const PIXEL_VAZIO = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
// O mesmo limite de "tela estreita" de styles/site.css.
const TELA_LARGA = '(min-width: 1001px)'
const ALTURA_DO_MAIOR_CIPO = 749
const MEDIDAS_DOS_CIPOS: Record<number, readonly [largura: number, altura: number]> = {
  1: [159, 748], 2: [79, 463], 3: [162, 748], 4: [135, 307], 5: [88, 463], 6: [157, 749],
}
// x é a posição do cipó na largura do bloco, em %. Ficam fora do portal e do monólito, que são o centro da cena.
const CIPOS: Record<Exclude<Variante, 'rodape'>, readonly Cipo[]> = {
  capa: [{ arquivo: 4, x: 35, soEmTelaLarga: true }, { arquivo: 1, x: 46 }, { arquivo: 2, x: 61, soEmTelaLarga: true }, { arquivo: 5, x: 79 }, { arquivo: 6, x: 99 }],
  faixa: [{ arquivo: 3, x: 71, soEmTelaLarga: true }, { arquivo: 5, x: 85, soEmTelaLarga: true }, { arquivo: 6, x: 98, soEmTelaLarga: true }],
}

const fotosDaCena = (tema: Tema) => LARGURAS_DA_CENA.map((largura) => `/ruina/cena-${tema}-${largura}.avif ${largura}w`).join(', ')

function Cena({ tamanhos }: { tamanhos: string }) {
  return (
    <div className="ruina-cena" data-camada="0.18,18">
      <picture>
        <source media="(prefers-color-scheme: dark)" type="image/avif" srcSet={fotosDaCena('noite')} sizes={tamanhos} />
        <source media="(prefers-color-scheme: dark)" srcSet="/ruina/cena-noite-1600.jpg" />
        <source type="image/avif" srcSet={fotosDaCena('dia')} sizes={tamanhos} />
        <img className="ruina-foto" src="/ruina/cena-dia-1600.jpg" alt="" width={1600} height={905} fetchPriority="high" decoding="async" />
      </picture>
      {/* Só no tema escuro: a mesma foto por cima, clareando o que já brilha (as luzes da tecnologia pulsam).
          No claro o <img> fica com um pixel vazio, para a foto noturna não ser baixada à toa. */}
      <picture>
        <source media="(prefers-color-scheme: dark)" type="image/avif" srcSet={fotosDaCena('noite')} sizes={tamanhos} />
        <img className="ruina-brilho" src={PIXEL_VAZIO} alt="" width={1600} height={905} decoding="async" />
      </picture>
    </div>
  )
}

function Cipos({ cipos }: { cipos: readonly Cipo[] }) {
  return (
    <div className="ruina-cipos">
      {cipos.map(({ arquivo, x, soEmTelaLarga }) => {
        const [largura, altura] = MEDIDAS_DOS_CIPOS[arquivo]
        const estilo = { left: `${x}%`, '--comprimento': altura / ALTURA_DO_MAIOR_CIPO } as CSSProperties
        const foto = `/ruina/cipo-${arquivo}.webp`
        if (!soEmTelaLarga) return <img key={arquivo} className="ruina-cipo" data-balanco="cipo" style={estilo} src={foto} alt="" width={largura} height={altura} decoding="async" />
        // Escondido em tela estreita: lá o <img> fica com um pixel vazio, para a foto não ser baixada à toa.
        return (
          <picture key={arquivo}>
            <source media={TELA_LARGA} srcSet={foto} />
            <img className="ruina-cipo ruina-cipo--largo" data-balanco="cipo" style={estilo} src={PIXEL_VAZIO} alt="" width={largura} height={altura} decoding="async" />
          </picture>
        )
      })}
    </div>
  )
}

function Relva({ camada, tamanhos }: { camada: string; tamanhos: string }) {
  return (
    <div className="ruina-chao" data-camada={camada}>
      <img className="ruina-relva" data-balanco="relva" srcSet="/ruina/relva-900.webp 900w, /ruina/relva-1600.webp 1600w" sizes={tamanhos} src="/ruina/relva-900.webp" alt="" width={1600} height={674} loading="lazy" decoding="async" />
    </div>
  )
}

export function Ruina({ variante = 'capa' }: { variante?: Variante }) {
  const raiz = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!raiz.current) return undefined
    return animarRuina(raiz.current)
  }, [])

  return (
    <div ref={raiz} className={`ruina ruina--${variante}`} aria-hidden="true">
      {variante !== 'rodape' && <Cena tamanhos={TAMANHOS_DA_CENA[variante]} />}
      {variante === 'capa' && <div className="ruina-nevoa" data-camada="0.1,30" />}
      {variante !== 'rodape' && <div className="ruina-veu" />}
      {variante !== 'rodape' && <Cipos cipos={CIPOS[variante]} />}
      {variante === 'capa' && <Relva camada="-0.06,36" tamanhos="40vw" />}
      {variante === 'rodape' && <Relva camada="0,0" tamanhos="(max-width: 720px) 58vw, 21rem" />}
    </div>
  )
}
