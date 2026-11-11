import { notFound } from 'next/navigation'
import { RadarSemana } from '@/components/radar/RadarSemana'
import { partesDaSemana } from '@/lib/radar/formato'
import { lerSemana, listarSemanas } from '@/lib/radar/ler'
import { metadados } from '@/lib/metadados'

interface Props {
  params: Promise<{ semana: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return listarSemanas().map((semana) => ({ semana }))
}

export async function generateMetadata({ params }: Props) {
  const { semana } = await params
  const edicao = lerSemana(semana)
  if (!edicao) return {}
  const { ano, numero } = partesDaSemana(semana)
  return metadados({
    titulo: `Radar nº ${numero} · ${ano}`,
    descricao: `${edicao.artigos.length} artigos de IA resumidos na semana ${numero} de ${ano}.`,
    caminho: `/radar/${semana}`,
  })
}

export default async function PaginaDaSemana({ params }: Props) {
  const { semana } = await params
  const edicao = lerSemana(semana)
  if (!edicao) notFound()
  return <RadarSemana key={edicao.semana} edicao={edicao} semanas={listarSemanas()} />
}
