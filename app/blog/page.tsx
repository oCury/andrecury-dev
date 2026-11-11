import { IndiceDePosts } from '@/components/conteudo/IndiceDePosts'
import { listarPosts } from '@/lib/conteudo/ler'
import { metadados } from '@/lib/metadados'

export const metadata = metadados({ titulo: 'Blog', descricao: 'Textos de André Cury sobre software e IA.', caminho: '/blog' })

export default function PaginaBlog() {
  return (
    <>
      <header className="capa">
        <p className="capa-rotulo">Textos</p>
        <h1 className="capa-titulo">Blog</h1>
      </header>
      <section className="coluna" aria-label="Textos publicados">
        <IndiceDePosts posts={listarPosts()} />
      </section>
    </>
  )
}
