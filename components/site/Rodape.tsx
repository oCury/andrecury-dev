import Link from 'next/link'
import { SITE } from '@/lib/site'

export function Rodape() {
  return (
    <footer className="site-rodape">
      <p>{SITE.nome} · {new Date().getFullYear()}</p>
      <ul>
        <li><a href={SITE.urlInicial}>Contato e página inicial</a></li>
        <li><a href={SITE.github} rel="noopener noreferrer">GitHub</a></li>
        <li><a href="/rss.xml">RSS</a></li>
        <li><Link href="/privacidade">Privacidade</Link></li>
      </ul>
    </footer>
  )
}
