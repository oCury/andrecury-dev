import type { ReactNode } from 'react'
import type { Artigo } from '@/lib/radar/esquema'
import { rotuloDaArea, virgula } from '@/lib/radar/formato'
import { Paragrafos } from './Paragrafos'

interface Props {
  artigo: Artigo
  nivelDoTitulo: 'h1' | 'h2'
  conceitos: ReactNode[]
  acoesExtras?: ReactNode
}

export function CorpoDoArtigo({ artigo, nivelDoTitulo: Titulo, conceitos, acoesExtras }: Props) {
  const Secao = Titulo === 'h1' ? 'h2' : 'h3'
  return (
    <>
      <p className="leitura-area">{rotuloDaArea(artigo.categoria)} · {artigo.publicado}</p>
      <Titulo className="leitura-titulo">{artigo.titulo}</Titulo>
      <p className="leitura-autores">{artigo.autores || 'Autores não informados'}</p>
      {artigo.frase && <p className="leitura-chamada">{artigo.frase}</p>}
      <dl className="medidas">
        <div><dt>Relevância (0–4)</dt><dd>{virgula(artigo.relevancia, 2)}</dd></div>
        <div><dt>Votos na comunidade</dt><dd>{artigo.votos}</dd></div>
        <div><dt>Resultado novo</dt><dd>{Math.round(artigo.novo * 100)}%</dd></div>
      </dl>
      {artigo.secoes.map(([titulo, conteudo]) => (
        <section key={titulo}>
          <Secao className="leitura-secao">{titulo}</Secao>
          <Paragrafos texto={conteudo} />
        </section>
      ))}
      <p className="leitura-aviso">Resumo gerado por IA; leia o original.</p>
      {conceitos.length > 0 && <div className="nuvem">{conceitos}</div>}
      <div className="acoes">
        {artigo.id && (
          <a className="botao" href={`https://arxiv.org/abs/${artigo.id}`} target="_blank" rel="noopener noreferrer">
            Abrir no arXiv ↗
          </a>
        )}
        {acoesExtras}
      </div>
    </>
  )
}
