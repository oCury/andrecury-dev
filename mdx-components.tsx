import type { MDXComponents } from 'mdx/types'

const EXTERNO = /^https?:\/\//

const components: MDXComponents = {
  a: ({ href = '', children }) =>
    EXTERNO.test(href) ? (
      <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
    ) : (
      <a href={href}>{children}</a>
    ),
}

export function useMDXComponents(): MDXComponents {
  return components
}
