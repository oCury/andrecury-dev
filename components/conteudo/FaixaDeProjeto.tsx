import Link from 'next/link'
import type { Projeto } from '@/lib/conteudo/esquema'

interface Props {
  projeto: Projeto
  /** A primeira faixa da página carrega a imagem com prioridade; as outras, só ao chegar perto. */
  prioritaria?: boolean
}

export function FaixaDeProjeto({ projeto, prioritaria = false }: Props) {
  const { imagem } = projeto
  // O esquema já garante imagem e resultado em destaque; isto só estreita o tipo.
  if (!imagem || !projeto.resultado) throw new Error(`${projeto.slug}: destaque sem imagem ou sem resultado`)
  const base = `/projetos/${imagem.arquivo}`
  return (
    <article className="faixa">
      <div className="faixa-imagem">
        <picture>
          <source srcSet={`${base}.avif`} type="image/avif" />
          <source srcSet={`${base}.webp`} type="image/webp" />
          <img
            src={`${base}.webp`}
            alt={imagem.alt}
            width={imagem.largura}
            height={imagem.altura}
            loading={prioritaria ? 'eager' : 'lazy'}
            fetchPriority={prioritaria ? 'high' : 'auto'}
            decoding="async"
          />
        </picture>
      </div>
      <div className="faixa-texto">
        <p className="faixa-meta">{projeto.ano} · {projeto.estado}</p>
        <h3><Link href={`/projetos/${projeto.slug}`}>{projeto.titulo}</Link></h3>
        <p className="faixa-resumo">{projeto.resumo}</p>
        <p className="faixa-resultado">{projeto.resultado}</p>
        {projeto.stack.length > 0 && <p className="faixa-stack">{projeto.stack.join(' · ')}</p>}
        <p className="faixa-links">
          <span className="faixa-ver" aria-hidden="true">Ver o projeto →</span>
          {projeto.link && <a href={projeto.link} target="_blank" rel="noopener noreferrer">Abrir ↗</a>}
          {projeto.repositorio && <a href={projeto.repositorio} target="_blank" rel="noopener noreferrer">Ver o código ↗</a>}
        </p>
      </div>
    </article>
  )
}
