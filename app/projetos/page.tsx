import { IndiceDeProjetos } from '@/components/conteudo/IndiceDeProjetos'
import { listarProjetos } from '@/lib/conteudo/ler'
import { metadados } from '@/lib/metadados'

export const metadata = metadados({ titulo: 'Projetos', descricao: 'O que André Cury construiu e está construindo.', caminho: '/projetos' })

export default function PaginaProjetos() {
  return (
    <>
      <header className="capa">
        <p className="capa-rotulo">Portfólio</p>
        <h1 className="capa-titulo">Projetos</h1>
      </header>
      <section className="coluna" aria-label="Lista de projetos">
        <IndiceDeProjetos projetos={listarProjetos()} />
      </section>
    </>
  )
}
