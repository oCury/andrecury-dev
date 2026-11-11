import createMDX from '@next/mdx'
import type { NextConfig } from 'next'
import { cabecalhosDeSeguranca } from './lib/seguranca/cabecalhos'
import { redirecionamentosDeHost } from './lib/seguranca/redirecionamentos'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    const emDesenvolvimento = process.env.NODE_ENV === 'development'
    return [{ source: '/:caminho*', headers: cabecalhosDeSeguranca({ emDesenvolvimento }) }]
  },
  async redirects() {
    return redirecionamentosDeHost({ ambienteVercel: process.env.VERCEL_ENV })
  },
}

// Com Turbopack os plugins vão pelo nome, como texto.
const comMdx = createMDX({ options: { remarkPlugins: ['remark-frontmatter', 'remark-gfm'] } })

export default comMdx(nextConfig)
