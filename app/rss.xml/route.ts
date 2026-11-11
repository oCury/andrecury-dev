import { listarPosts } from '@/lib/conteudo/ler'
import { montarRss, type ItemRss } from '@/lib/rss'
import { SITE } from '@/lib/site'

export const dynamic = 'force-static'

export function GET(): Response {
  const itens: ItemRss[] = listarPosts().map((post) => ({
    titulo: post.titulo,
    caminho: `/blog/${post.slug}`,
    resumo: post.resumo,
    data: post.data,
  }))
  return new Response(montarRss({ site: SITE, itens }), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
