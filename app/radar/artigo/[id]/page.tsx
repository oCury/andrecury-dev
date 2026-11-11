import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Comentarios } from '@/components/comentarios/Comentarios'
import { CorpoDoArtigo } from '@/components/radar/CorpoDoArtigo'
import { corDaArea, partesDaSemana } from '@/lib/radar/formato'
import { buscarArtigo, listarArtigos } from '@/lib/radar/ler'
import { metadados } from '@/lib/metadados'

interface Props {
  params: Promise<{ id: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return listarArtigos().map(({ chave }) => ({ id: chave }))
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const artigo = buscarArtigo(id)
  if (!artigo) return {}
  return metadados({
    titulo: artigo.titulo,
    descricao: artigo.frase || 'Resumo em português de um artigo de IA.',
    caminho: `/radar/artigo/${artigo.chave}`,
    tipo: 'article',
  })
}

export default async function PaginaDoArtigo({ params }: Props) {
  const { id } = await params
  const artigo = buscarArtigo(id)
  if (!artigo) notFound()
  const { numero } = partesDaSemana(artigo.semana)
  return (
    <div className="radar radar-artigo">
      <article className="leitura" style={corDaArea(artigo.categoria)}>
        <p><Link className="botao secundario" href={`/radar/${artigo.semana}`}>← Radar nº {numero}</Link></p>
        <CorpoDoArtigo artigo={artigo} nivelDoTitulo="h1"
          conceitos={artigo.conceitos.map((conceito) => (
            <Link key={conceito} className="etiqueta" href={`/radar/${artigo.semana}?conceito=${encodeURIComponent(conceito)}`}>
              {conceito}
            </Link>
          ))} />
      </article>
      <Comentarios />
    </div>
  )
}
