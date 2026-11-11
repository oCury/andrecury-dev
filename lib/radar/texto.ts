export interface Trecho {
  texto: string
  enfase: boolean
}

export const separarParagrafos = (texto: string): string[] =>
  texto.split(/\n\s*\n/).map((bloco) => bloco.trim()).filter(Boolean)

/** 'a *b* c' → trechos; quem desenha usa texto puro e <em>, nunca HTML vindo do dado. */
export function partirEnfase(bloco: string): Trecho[] {
  return bloco
    .split(/\*([^*\n]+)\*/)
    .map((texto, indice) => ({ texto, enfase: indice % 2 === 1 }))
    .filter((trecho) => trecho.texto !== '')
}
