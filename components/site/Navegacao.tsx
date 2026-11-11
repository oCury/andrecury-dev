'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITENS = [
  { href: '/projetos', rotulo: 'Projetos' },
  { href: '/blog', rotulo: 'Blog' },
  { href: '/sobre', rotulo: 'Sobre' },
] as const

export function Navegacao() {
  const caminho = usePathname()
  return (
    <nav className="site-nav" aria-label="Navegação principal">
      <ul>
        {ITENS.map(({ href, rotulo }) => (
          <li key={href}>
            <Link href={href} aria-current={caminho === href || caminho.startsWith(`${href}/`) ? 'page' : undefined}>
              {rotulo}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
