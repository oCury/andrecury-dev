import Link from 'next/link'
import { IndiceDePosts } from '@/components/conteudo/IndiceDePosts'
import { IndiceDeProjetos } from '@/components/conteudo/IndiceDeProjetos'
import { listarPosts, listarProjetos } from '@/lib/conteudo/ler'
import { metadados } from '@/lib/metadados'
import { SITE } from '@/lib/site'

const PROJETOS_NO_INICIO = 4
const POSTS_NO_INICIO = 3

export const metadata = metadados({ descricao: SITE.descricao, caminho: '/' })

export default function PaginaInicial() {
  return (
    <>
      <header className="capa">
        <p className="capa-rotulo">Projetos · textos · radar de IA</p>
        <h1 className="capa-titulo">André <em>Cury</em></h1>
        <p className="capa-chamada">{SITE.descricao}</p>
      </header>
      <div className="inicio-secoes">
        <section className="inicio-secao inicio-secao--larga" aria-labelledby="inicio-projetos">
          <div className="secao-topo">
            <h2 id="inicio-projetos">Projetos</h2>
            <Link href="/projetos">Ver todos</Link>
          </div>
          <IndiceDeProjetos projetos={listarProjetos().slice(0, PROJETOS_NO_INICIO)} nivel="h3" />
        </section>
        <section className="inicio-secao" aria-labelledby="inicio-blog">
          <div className="secao-topo">
            <h2 id="inicio-blog">Blog</h2>
            <Link href="/blog">Ver todos</Link>
          </div>
          <IndiceDePosts posts={listarPosts().slice(0, POSTS_NO_INICIO)} nivel="h3" estreito />
        </section>
      </div>
    </>
  )
}
