import Texto from '@/content/paginas/privacidade.mdx'
import { metadados } from '@/lib/metadados'

export const metadata = metadados({ titulo: 'Privacidade', descricao: 'O que este site guarda sobre quem o visita.', caminho: '/privacidade' })

export default function PaginaPrivacidade() {
  return (
    <>
      <header className="capa">
        <p className="capa-rotulo">Seus dados</p>
        <h1 className="capa-titulo">Privacidade</h1>
      </header>
      <div className="coluna prosa"><Texto /></div>
    </>
  )
}
