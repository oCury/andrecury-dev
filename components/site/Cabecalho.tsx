import Link from 'next/link'
import { SITE } from '@/lib/site'
import { Navegacao } from './Navegacao'

export function Cabecalho() {
  return (
    <header className="site-cabecalho">
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <Link className="site-marca" href="/">{SITE.nome}</Link>
      <Navegacao />
    </header>
  )
}
