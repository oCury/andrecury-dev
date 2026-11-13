// Movimento da ruína (ver Ruina.tsx).
// Camadas ([data-camada="atraso,alcance"]) deslizam em paralaxe: "atraso" é a fração da rolagem que a camada fica para trás,
// "alcance" é quantos px ela se desloca contra o ponteiro. Peças ([data-balanco="cipo" | "relva"]) são pêndulos amortecidos:
// vento constante, empurrão do dedo ou do mouse e tranco da rolagem.
// Só escreve transform. Roda apenas com a ruína visível, a aba ativa e sem "reduzir movimento".

const PASSO_MAXIMO = 1 / 30
const MARGEM_DE_VISIBILIDADE = '80px'
const SUAVIZACAO_DO_PONTEIRO = 4
const FREIO_DO_PONTEIRO = 7
const TOQUE_EXPIRA_MS = 1400
const PAUSA_QUE_ZERA_A_VELOCIDADE_MS = 120
const RAIO_DO_TOQUE = 120
const FOLGA_ALEM_DA_PONTA = 40
const ALAVANCA_MINIMA = 0.25
const VELOCIDADE_MAXIMA_DO_TOQUE = 1500
const ROLAGEM_MAXIMA_POR_QUADRO = 80
const ALTURA_DE_REFERENCIA = 300
const ALTURA_MINIMA = 120
const ALTURA_MAXIMA = 600
const ALCANCE_VERTICAL = 0.6
const RADIANOS = Math.PI / 180

type Tipo = 'cipo' | 'relva'
type Regime = { rigidez: number; atrito: number; vento: number; arrasto: number; empurrao: number; rolagem: number; limite: number }
type Camada = { elemento: HTMLElement; atraso: number; alcance: number }
type Peca = {
  elemento: HTMLElement
  tipo: Tipo
  regime: Regime
  rigidez: number
  fase: number
  angulo: number
  velocidade: number
  centro: number
  topo: number
  altura: number
  largura: number
}
type Toque = { x: number; y: number; velocidade: number; quando: number }
type ToqueLocal = { x: number; y: number; velocidade: number }

// Ângulos em graus. O cipó gira pendurado pelo topo; a relva inclina presa pela base.
// Nos dois, ângulo positivo leva a ponta livre para a esquerda.
const REGIMES: Record<Tipo, Regime> = {
  cipo: { rigidez: 11, atrito: 1.2, vento: 9, arrasto: 0.4, empurrao: 120, rolagem: 0.08, limite: 14 },
  relva: { rigidez: 26, atrito: 2.6, vento: 7, arrasto: 0.05, empurrao: 30, rolagem: 0.03, limite: 4 },
}

const limitar = (valor: number, minimo: number, maximo: number) => Math.min(maximo, Math.max(minimo, valor))

function posicaoNaRaiz(elemento: HTMLElement, raiz: HTMLElement): [esquerda: number, topo: number] {
  let esquerda = 0
  let topo = 0
  for (let atual: HTMLElement | null = elemento; atual && atual !== raiz; atual = atual.offsetParent as HTMLElement | null) {
    esquerda += atual.offsetLeft
    topo += atual.offsetTop
  }
  return [esquerda, topo]
}

function montarCamadas(raiz: HTMLElement): Camada[] {
  return Array.from(raiz.querySelectorAll<HTMLElement>('[data-camada]'), (elemento) => {
    const [atraso = 0, alcance = 0] = (elemento.dataset.camada ?? '').split(',').map(Number)
    return { elemento, atraso, alcance }
  })
}

function montarPecas(raiz: HTMLElement): Peca[] {
  return Array.from(raiz.querySelectorAll<HTMLElement>('[data-balanco]'), (elemento, indice) => {
    const tipo: Tipo = elemento.dataset.balanco === 'relva' ? 'relva' : 'cipo'
    const regime = REGIMES[tipo]
    return { elemento, tipo, regime, rigidez: regime.rigidez, fase: indice * 1.7, angulo: 0, velocidade: 0, centro: 0, topo: 0, altura: 1, largura: 1 }
  })
}

// Mede a posição de repouso de cada peça dentro da raiz (o layout ignora o transform, então o balanço não atrapalha).
function medir(pecas: Peca[], raiz: HTMLElement): void {
  pecas.forEach((peca) => {
    const [esquerda, topo] = posicaoNaRaiz(peca.elemento, raiz)
    peca.largura = peca.elemento.offsetWidth || 1
    peca.altura = peca.elemento.offsetHeight || 1
    // O cipó é centrado em "left" por translate: -50%; a relva ocupa a própria caixa.
    peca.centro = peca.tipo === 'cipo' ? esquerda : esquerda + peca.largura / 2
    peca.topo = topo
    // Peça mais curta balança mais depressa.
    peca.rigidez = peca.regime.rigidez * (ALTURA_DE_REFERENCIA / limitar(peca.altura, ALTURA_MINIMA, ALTURA_MAXIMA))
  })
}

// Quanto o ponteiro (em px dentro da raiz) pega na peça: 0 = longe, 1 = em cima da ponta. "lado" é +1 com o ponteiro à direita.
function pegada(peca: Peca, x: number, y: number): { forca: number; lado: number } {
  const descida = y - peca.topo
  if (peca.tipo === 'relva') {
    if (descida < -FOLGA_ALEM_DA_PONTA || descida > peca.altura) return { forca: 0, lado: 0 }
    const distancia = x - peca.centro
    return { forca: Math.max(0, 1 - Math.abs(distancia) / (peca.largura / 2 + RAIO_DO_TOQUE)), lado: Math.sign(distancia) }
  }
  if (descida < 0 || descida > peca.altura + FOLGA_ALEM_DA_PONTA) return { forca: 0, lado: 0 }
  const distancia = x - (peca.centro - Math.tan(peca.angulo * RADIANOS) * descida)
  const alavanca = limitar(descida / peca.altura, ALAVANCA_MINIMA, 1)
  return { forca: Math.max(0, 1 - Math.abs(distancia) / RAIO_DO_TOQUE) * alavanca, lado: Math.sign(distancia) }
}

function moverPeca(peca: Peca, dt: number, tempo: number, toque: ToqueLocal | null, rolagem: number): void {
  const { regime } = peca
  const vento = regime.vento * (Math.sin(tempo * 0.9 + peca.fase) + 0.5 * Math.sin(tempo * 2.3 + peca.fase * 1.7))
  let impulso = 0
  if (toque) {
    // O ponteiro afasta a ponta de si e a arrasta no sentido em que se move.
    const { forca, lado } = pegada(peca, toque.x, toque.y)
    impulso = forca * (lado * regime.empurrao - toque.velocidade * regime.arrasto)
  }
  const aceleracao = -peca.rigidez * peca.angulo + vento + impulso
  const tranco = rolagem * regime.rolagem * (0.6 + 0.4 * Math.sin(peca.fase))
  peca.velocidade = (peca.velocidade + aceleracao * dt + tranco) * Math.exp(-regime.atrito * dt)
  peca.angulo = limitar(peca.angulo + peca.velocidade * dt, -regime.limite, regime.limite)
  if (Math.abs(peca.angulo) === regime.limite) peca.velocidade = 0
  const giro = peca.angulo.toFixed(2)
  peca.elemento.style.transform = peca.tipo === 'cipo' ? `rotate(${giro}deg)` : `skewX(${giro}deg)`
}

function ouvir(toque: Toque): () => void {
  const registrar = (x: number, y: number) => {
    const agora = performance.now()
    const intervalo = Math.max(agora - toque.quando, 8) / 1000
    const seguido = agora - toque.quando < PAUSA_QUE_ZERA_A_VELOCIDADE_MS
    toque.velocidade = seguido ? limitar((x - toque.x) / intervalo, -VELOCIDADE_MAXIMA_DO_TOQUE, VELOCIDADE_MAXIMA_DO_TOQUE) : 0
    toque.x = x
    toque.y = y
    toque.quando = agora
  }
  const aoPonteiro = (evento: PointerEvent) => registrar(evento.clientX, evento.clientY)
  const aoToque = (evento: TouchEvent) => {
    const dedo = evento.touches[0]
    if (dedo) registrar(dedo.clientX, dedo.clientY)
  }
  const passivo = { passive: true } as const
  window.addEventListener('pointermove', aoPonteiro, passivo)
  window.addEventListener('pointerdown', aoPonteiro, passivo)
  window.addEventListener('touchstart', aoToque, passivo)
  window.addEventListener('touchmove', aoToque, passivo)
  return () => {
    window.removeEventListener('pointermove', aoPonteiro)
    window.removeEventListener('pointerdown', aoPonteiro)
    window.removeEventListener('touchstart', aoToque)
    window.removeEventListener('touchmove', aoToque)
  }
}

export function animarRuina(raiz: HTMLElement): () => void {
  const camadas = montarCamadas(raiz)
  const pecas = montarPecas(raiz)
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)')
  const toque: Toque = { x: 0, y: 0, velocidade: 0, quando: -Infinity }
  const olhar = { x: 0, y: 0 }
  let visivel = false
  let quadroPedido = 0
  let anterior = 0
  let rolagemAnterior = window.scrollY

  function pedir(): void {
    if (quadroPedido || !visivel || document.hidden || reduzir.matches) return
    quadroPedido = requestAnimationFrame(quadro)
  }

  function quadro(agora: number): void {
    quadroPedido = 0
    const dt = Math.min(Math.max(agora - anterior, 0) / 1000, PASSO_MAXIMO)
    anterior = agora
    const caixa = raiz.getBoundingClientRect()
    const tocando = agora - toque.quando < TOQUE_EXPIRA_MS
    toque.velocidade *= Math.exp(-FREIO_DO_PONTEIRO * dt)

    const aproximar = 1 - Math.exp(-SUAVIZACAO_DO_PONTEIRO * dt)
    olhar.x += ((tocando ? toque.x / window.innerWidth - 0.5 : 0) - olhar.x) * aproximar
    olhar.y += ((tocando ? toque.y / window.innerHeight - 0.5 : 0) - olhar.y) * aproximar
    const rolado = window.scrollY
    const rolagem = limitar(rolado - rolagemAnterior, -ROLAGEM_MAXIMA_POR_QUADRO, ROLAGEM_MAXIMA_POR_QUADRO)
    rolagemAnterior = rolado
    const passado = limitar(rolado, 0, caixa.height + window.innerHeight)

    camadas.forEach(({ elemento, atraso, alcance }) => {
      const x = -olhar.x * alcance
      const y = passado * atraso - olhar.y * alcance * ALCANCE_VERTICAL
      elemento.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
    })
    const local = tocando ? { x: toque.x - caixa.left, y: toque.y - caixa.top, velocidade: toque.velocidade } : null
    pecas.forEach((peca) => moverPeca(peca, dt, agora / 1000, local, rolagem))
    pedir()
  }

  const retomar = () => {
    anterior = performance.now()
    rolagemAnterior = window.scrollY
    pedir()
  }

  const observadorDeVisibilidade = new IntersectionObserver(([entrada]) => {
    visivel = entrada.isIntersecting
    retomar()
  }, { rootMargin: MARGEM_DE_VISIBILIDADE })
  const observadorDeTamanho = new ResizeObserver(() => medir(pecas, raiz))
  const pararDeOuvir = ouvir(toque)

  medir(pecas, raiz)
  observadorDeVisibilidade.observe(raiz)
  observadorDeTamanho.observe(raiz)
  document.addEventListener('visibilitychange', retomar)
  reduzir.addEventListener('change', retomar)

  return () => {
    cancelAnimationFrame(quadroPedido)
    observadorDeVisibilidade.disconnect()
    observadorDeTamanho.disconnect()
    pararDeOuvir()
    document.removeEventListener('visibilitychange', retomar)
    reduzir.removeEventListener('change', retomar)
  }
}
