import type { MetadataRoute } from 'next'
import { listarPosts, listarProjetos } from '@/lib/conteudo/ler'
import { SITE } from '@/lib/site'

const PAGINAS_FIXAS = ['', '/projetos', '/blog', '/sobre', '/privacidade']

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGINAS_FIXAS.map((caminho) => ({ url: `${SITE.url}${caminho}` })),
    ...listarProjetos().map((projeto) => ({ url: `${SITE.url}/projetos/${projeto.slug}` })),
    ...listarPosts().map((post) => ({ url: `${SITE.url}/blog/${post.slug}`, lastModified: post.data })),
  ]
}
