import { FaixaDeProjeto } from '@/components/conteudo/FaixaDeProjeto'
import { IndiceDeProjetos } from '@/components/conteudo/IndiceDeProjetos'
import { Bancada } from '@/components/site/Bancada'
import { listarDestaques, listarOutrosProjetos } from '@/lib/conteudo/ler'
import { metadados } from '@/lib/metadados'

export const metadata = metadados({ titulo: 'Projetos', descricao: 'O que André Cury construiu e está construindo.', caminho: '/projetos' })

export default function PaginaProjetos() {
  const destaques = listarDestaques()
  const outros = listarOutrosProjetos()
  const temDestaques = destaques.length > 0
  return (
    <>
      <header className="capa">
        <Bancada />
        <p className="capa-rotulo">Portfólio</p>
        <h1 className="capa-titulo">Projetos</h1>
      </header>
      {temDestaques && (
        <section className="destaques-secao" aria-labelledby="projetos-destaque">
          <h2 id="projetos-destaque">Em destaque</h2>
          <ol className="destaques">
            {destaques.map((projeto, indice) => (
              <li key={projeto.slug}>
                <FaixaDeProjeto projeto={projeto} prioritaria={indice === 0} />
              </li>
            ))}
          </ol>
        </section>
      )}
      {(outros.length > 0 || !temDestaques) && (
        <section className="coluna" aria-label={temDestaques ? 'Outros projetos' : 'Lista de projetos'}>
          {temDestaques && <h2 className="outros-titulo">Outros projetos</h2>}
          <IndiceDeProjetos projetos={outros} nivel={temDestaques ? 'h3' : 'h2'} />
        </section>
      )}
    </>
  )
}
