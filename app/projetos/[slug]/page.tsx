import { notFound } from 'next/navigation'
import { listarProjetos } from '@/lib/conteudo/ler'
import { metadados } from '@/lib/metadados'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return listarProjetos().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const projeto = listarProjetos().find((item) => item.slug === slug)
  if (!projeto) return {}
  return metadados({ titulo: projeto.titulo, descricao: projeto.resumo, caminho: `/projetos/${slug}`, tipo: 'article' })
}

export default async function PaginaDoProjeto({ params }: Props) {
  const { slug } = await params
  const projeto = listarProjetos().find((item) => item.slug === slug)
  if (!projeto) notFound()
  const { default: Corpo } = await import(`@/content/projetos/${slug}.mdx`)
  return (
    <article className="coluna">
      <header className="artigo-topo">
        <p className="rotulo">Projeto</p>
        <h1>{projeto.titulo}</h1>
        <p className="artigo-resumo">{projeto.resumo}</p>
      </header>
      <dl className="ficha">
        <div><dt>Estado</dt><dd>{projeto.estado}</dd></div>
        <div><dt>Ano</dt><dd>{projeto.ano}</dd></div>
        {projeto.stack.length > 0 && <div><dt>Feito com</dt><dd>{projeto.stack.join(', ')}</dd></div>}
      </dl>
      <div className="prosa">
        <Corpo />
        {(projeto.link || projeto.repositorio) && (
          <p>
            {projeto.link && <a href={projeto.link} target="_blank" rel="noopener noreferrer">Abrir o projeto ↗</a>}
            {projeto.link && projeto.repositorio && ' · '}
            {projeto.repositorio && <a href={projeto.repositorio} target="_blank" rel="noopener noreferrer">Ver o código ↗</a>}
          </p>
        )}
      </div>
    </article>
  )
}
