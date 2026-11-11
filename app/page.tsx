import { metadados } from '@/lib/metadados'
import { SITE } from '@/lib/site'

export const metadata = metadados({ descricao: SITE.descricao, caminho: '/' })

export default function PaginaInicial() {
  return (
    <header className="capa">
      <p className="capa-rotulo">Projetos · textos · radar de IA</p>
      <h1 className="capa-titulo">André <em>Cury</em></h1>
      <p className="capa-chamada">{SITE.descricao}</p>
    </header>
  )
}
