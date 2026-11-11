// Sem zod de propósito: este módulo vai para o navegador (filtros e estado no endereço).
// Importar valores de esquema.ts em código de cliente leva o zod inteiro junto, e ele sonda eval, que a CSP bloqueia.
export const AREAS = {
  agentes: 'Agentes', modelos: 'Modelos', avaliacao: 'Avaliação', sistemas: 'Sistemas',
  engenharia: 'Engenharia', seguranca: 'Segurança', outros: 'Outros',
} as const

export const CHAVE_VALIDA = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/
export const SEMANA_VALIDA = /^\d{4}-W\d{2}$/
