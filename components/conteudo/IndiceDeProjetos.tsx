import Link from 'next/link'
import type { Projeto } from '@/lib/conteudo/esquema'

interface Props {
  projetos: readonly Projeto[]
  nivel?: 'h2' | 'h3'
}

export function IndiceDeProjetos({ projetos, nivel: Titulo = 'h2' }: Props) {
  if (projetos.length === 0) return <p className="vazio">Os projetos ainda não foram publicados.</p>
  return (
    <ol className="indice">
      {projetos.map((projeto) => (
        <li key={projeto.slug}>
          <p className="indice-meta">{projeto.ano} · {projeto.estado}</p>
          <Titulo><Link href={`/projetos/${projeto.slug}`}>{projeto.titulo}</Link></Titulo>
          <p className="indice-resumo">{projeto.resumo}</p>
          {projeto.stack.length > 0 && <p className="indice-stack">{projeto.stack.join(' · ')}</p>}
        </li>
      ))}
    </ol>
  )
}
