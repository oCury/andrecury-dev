const ORIGEM_GISCUS = 'https://giscus.app'
const UM_ANO_EM_SEGUNDOS = 31_536_000

export function montarCsp({ emDesenvolvimento }: { emDesenvolvimento: boolean }): string {
  const diretivas: Array<[string, string[]]> = [
    ['default-src', ["'self'"]],
    ['script-src', ["'self'", "'unsafe-inline'", ORIGEM_GISCUS, ...(emDesenvolvimento ? ["'unsafe-eval'"] : [])]],
    ['style-src', ["'self'", "'unsafe-inline'", ORIGEM_GISCUS]],
    ['img-src', ["'self'", 'data:']],
    ['font-src', ["'self'"]],
    ['connect-src', ["'self'", ...(emDesenvolvimento ? ['ws:'] : [])]],
    ['frame-src', [ORIGEM_GISCUS]],
    ['object-src', ["'none'"]],
    ['base-uri', ["'self'"]],
    ['form-action', ["'self'"]],
    ['frame-ancestors', ["'none'"]],
  ]
  return diretivas.map(([nome, valores]) => `${nome} ${valores.join(' ')}`).join('; ')
}

export function cabecalhosDeSeguranca({ emDesenvolvimento }: { emDesenvolvimento: boolean }) {
  return [
    { key: 'Content-Security-Policy', value: montarCsp({ emDesenvolvimento }) },
    { key: 'Strict-Transport-Security', value: `max-age=${UM_ANO_EM_SEGUNDOS}; includeSubDomains` },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  ]
}
