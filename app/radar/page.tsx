import { RadarSemana } from '@/components/radar/RadarSemana'
import { lerSemana, listarSemanas } from '@/lib/radar/ler'
import { metadados } from '@/lib/metadados'

const DESCRICAO = 'Leitura semanal de artigos de IA: os mais relevantes da semana, resumidos em português.'

export function generateMetadata() {
  const [atual] = listarSemanas()
  return metadados({ titulo: 'Radar de artigos de IA', descricao: DESCRICAO, caminho: atual ? `/radar/${atual}` : '/radar' })
}

export default function PaginaRadar() {
  const semanas = listarSemanas()
  const edicao = semanas.length > 0 ? lerSemana(semanas[0]) : null
  if (!edicao) {
    return (
      <>
        <header className="capa">
          <p className="capa-rotulo">Leitura semanal · IA e tecnologia</p>
          <h1 className="capa-titulo">Radar</h1>
        </header>
        <div className="coluna"><p className="vazio">A primeira edição ainda não foi publicada.</p></div>
      </>
    )
  }
  return <RadarSemana key={edicao.semana} edicao={edicao} semanas={semanas} />
}
