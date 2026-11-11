import Texto from '@/content/paginas/sobre.mdx'
import { metadados } from '@/lib/metadados'

export const metadata = metadados({ titulo: 'Sobre', descricao: 'Quem é André Cury e o que este site reúne.', caminho: '/sobre' })

export default function PaginaSobre() {
  return (
    <>
      <header className="capa">
        <p className="capa-rotulo">Quem escreve</p>
        <h1 className="capa-titulo">Sobre</h1>
      </header>
      <div className="coluna prosa"><Texto /></div>
    </>
  )
}
