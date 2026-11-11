const FORMATO = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** '2026-11-01' → '1 de novembro de 2026'. */
export function dataPorExtenso(dataIso: string): string {
  return FORMATO.format(new Date(`${dataIso}T00:00:00Z`))
}
