import Link from 'next/link'

export default function NaoEncontrada() {
  return (
    <>
      <header className="capa">
        <p className="capa-rotulo">Erro 404</p>
        <h1 className="capa-titulo">Página não encontrada</h1>
      </header>
      <div className="coluna prosa">
        <p>O endereço pode ter mudado. Volte para o <Link href="/">início</Link> ou veja o <Link href="/blog">blog</Link>.</p>
      </div>
    </>
  )
}
