import Link from 'next/link'
import type { Post } from '@/lib/conteudo/esquema'
import { dataPorExtenso } from '@/lib/datas'

interface Props {
  posts: readonly Post[]
  nivel?: 'h2' | 'h3'
  estreito?: boolean
}

export function IndiceDePosts({ posts, nivel: Titulo = 'h2', estreito = false }: Props) {
  if (posts.length === 0) return <p className="vazio">Ainda não há textos publicados.</p>
  return (
    <ol className={estreito ? 'indice indice--estreito' : 'indice'}>
      {posts.map((post) => (
        <li key={post.slug}>
          <p className="indice-meta"><time dateTime={post.data}>{dataPorExtenso(post.data)}</time></p>
          <Titulo><Link href={`/blog/${post.slug}`}>{post.titulo}</Link></Titulo>
          <p className="indice-resumo">{post.resumo}</p>
        </li>
      ))}
    </ol>
  )
}
