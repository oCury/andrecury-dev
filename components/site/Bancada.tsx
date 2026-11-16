// Bancada: foto de uma bancada de trabalho com uma luminária, de fundo da capa de /projetos.
// Dia para o tema claro; a mesma cena à noite, com a luminária acesa, para o escuro. A troca é do <picture>, sem JavaScript.
// Decorativa e fora do fluxo: o bloco que a recebe precisa de position: relative e isolation: isolate (a .capa já tem).
// As fotos ficam em /public/bancada, nos mesmos três tamanhos da ruína.

const LARGURAS = [960, 1600, 2400] as const
// No celular a foto cobre a capa pela altura, então ocupa bem mais que a largura da tela.
const TAMANHOS = '(max-width: 1000px) 250vw, 106vw'

const fotos = (tema: 'dia' | 'noite') => LARGURAS.map((largura) => `/bancada/cena-${tema}-${largura}.avif ${largura}w`).join(', ')

export function Bancada() {
  return (
    <div className="bancada" aria-hidden="true">
      <picture>
        <source media="(prefers-color-scheme: dark)" type="image/avif" srcSet={fotos('noite')} sizes={TAMANHOS} />
        <source media="(prefers-color-scheme: dark)" srcSet="/bancada/cena-noite-1600.jpg" />
        <source type="image/avif" srcSet={fotos('dia')} sizes={TAMANHOS} />
        <img className="bancada-foto" src="/bancada/cena-dia-1600.jpg" alt="" width={1600} height={905} fetchPriority="high" decoding="async" />
      </picture>
      <div className="bancada-veu" />
    </div>
  )
}
