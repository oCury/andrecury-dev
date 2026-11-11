import { listarPosts } from '@/lib/conteudo/ler'
import { partesDaSemana, segundaDaSemana } from '@/lib/radar/formato'
import { lerSemana, listarSemanas } from '@/lib/radar/ler'
import { montarRss, type ItemRss } from '@/lib/rss'
import { SITE } from '@/lib/site'

export const dynamic = 'force-static'

export function GET(): Response {
  const posts: ItemRss[] = listarPosts().map((post) => ({
    titulo: post.titulo,
    caminho: `/blog/${post.slug}`,
    resumo: post.resumo,
    data: post.data,
  }))
  const edicoes: ItemRss[] = listarSemanas().flatMap((semana) => {
    const edicao = lerSemana(semana)
    if (!edicao) return []
    return [{
      titulo: `Radar nº ${partesDaSemana(semana).numero}`,
      caminho: `/radar/${semana}`,
      resumo: `${edicao.artigos.length} artigos de IA resumidos nesta semana.`,
      data: segundaDaSemana(semana),
    }]
  })
  return new Response(montarRss({ site: SITE, itens: [...posts, ...edicoes] }), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
