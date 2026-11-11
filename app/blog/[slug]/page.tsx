import { notFound } from 'next/navigation'
import { listarPosts } from '@/lib/conteudo/ler'
import { dataPorExtenso } from '@/lib/datas'
import { metadados } from '@/lib/metadados'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return listarPosts().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = listarPosts().find((item) => item.slug === slug)
  if (!post) return {}
  return metadados({ titulo: post.titulo, descricao: post.resumo, caminho: `/blog/${slug}`, tipo: 'article' })
}

export default async function PaginaDoPost({ params }: Props) {
  const { slug } = await params
  const post = listarPosts().find((item) => item.slug === slug)
  if (!post) notFound()
  const { default: Corpo } = await import(`@/content/blog/${slug}.mdx`)
  return (
    <article className="coluna">
      <header className="artigo-topo">
        <p className="rotulo"><time dateTime={post.data}>{dataPorExtenso(post.data)}</time></p>
        <h1>{post.titulo}</h1>
        <p className="artigo-resumo">{post.resumo}</p>
      </header>
      <div className="prosa"><Corpo /></div>
    </article>
  )
}
