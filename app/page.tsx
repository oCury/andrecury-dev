import Link from 'next/link'
import { IndiceDePosts } from '@/components/conteudo/IndiceDePosts'
import { IndiceDeProjetos } from '@/components/conteudo/IndiceDeProjetos'
import { listarPosts, listarProjetos } from '@/lib/conteudo/ler'
import { metadados } from '@/lib/metadados'
import { partesDaSemana, rotuloDaArea, virgula } from '@/lib/radar/formato'
import { lerSemana, listarSemanas } from '@/lib/radar/ler'
import { SITE } from '@/lib/site'

const PROJETOS_NO_INICIO = 4
const POSTS_NO_INICIO = 3
const ARTIGOS_NO_INICIO = 3

export const metadata = metadados({ descricao: SITE.descricao, caminho: '/' })

export default function PaginaInicial() {
  const [semanaAtual] = listarSemanas()
  const edicao = semanaAtual ? lerSemana(semanaAtual) : null
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
        {edicao && (
          <section className="inicio-secao" aria-labelledby="inicio-radar">
            <div className="secao-topo">
              <h2 id="inicio-radar">Radar <em>nº {partesDaSemana(edicao.semana).numero}</em></h2>
              <Link href="/radar">Abrir o radar</Link>
            </div>
            <ol className="indice indice--estreito">
              {edicao.artigos.slice(0, ARTIGOS_NO_INICIO).map((artigo) => (
                <li key={artigo.chave}>
                  <p className="indice-meta">nota {virgula(artigo.nota, 1)} · {rotuloDaArea(artigo.categoria)}</p>
                  <h3><Link href={`/radar/artigo/${artigo.chave}`}>{artigo.titulo}</Link></h3>
                  <p className="indice-resumo">{artigo.frase}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </>
  )
}
