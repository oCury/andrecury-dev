'use client'

import { useEffect, useRef } from 'react'
import { atributosDoGiscus, CONFIG_DO_GISCUS } from '@/lib/comentarios'

const SCRIPT_DO_GISCUS = 'https://giscus.app/client.js'
const MARGEM_PARA_CARREGAR = '400px'

/** Só fala com o giscus quando o leitor chega perto do fim da página. */
export function Comentarios() {
  const alvo = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const no = alvo.current
    if (!no || !CONFIG_DO_GISCUS) return
    const config = CONFIG_DO_GISCUS
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        observador.disconnect()
        const script = document.createElement('script')
        script.src = SCRIPT_DO_GISCUS
        script.async = true
        script.crossOrigin = 'anonymous'
        for (const [nome, valor] of Object.entries(atributosDoGiscus(config))) script.setAttribute(nome, valor)
        no.append(script)
      },
      { rootMargin: MARGEM_PARA_CARREGAR },
    )
    observador.observe(no)
    return () => observador.disconnect()
  }, [])

  if (!CONFIG_DO_GISCUS) return null
  return (
    <section className="comentarios" aria-labelledby="comentarios-titulo">
      <h2 id="comentarios-titulo" className="rotulo">Comentários</h2>
      <div ref={alvo} className="giscus" />
    </section>
  )
}
