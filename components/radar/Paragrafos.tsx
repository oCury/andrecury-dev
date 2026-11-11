import { partirEnfase, separarParagrafos } from '@/lib/radar/texto'

export function Paragrafos({ texto }: { texto: string }) {
  return (
    <>
      {separarParagrafos(texto).map((bloco, indice) => (
        <p key={indice}>
          {partirEnfase(bloco).map((trecho, posicao) =>
            trecho.enfase ? <em key={posicao}>{trecho.texto}</em> : trecho.texto,
          )}
        </p>
      ))}
    </>
  )
}
