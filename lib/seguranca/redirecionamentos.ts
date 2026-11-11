import { SITE } from '../site'

/** Só em produção: nos previews o host da hospedagem é o único endereço que existe. */
export function redirecionamentosDeHost({ ambienteVercel }: { ambienteVercel: string | undefined }) {
  if (ambienteVercel !== 'production') return []
  return [
    {
      source: '/:caminho*',
      has: [{ type: 'host' as const, value: '.*\\.vercel\\.app' }],
      destination: `${SITE.url}/:caminho*`,
      permanent: true,
    },
  ]
}
