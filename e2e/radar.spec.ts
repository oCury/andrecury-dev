import { expect, test, type Page } from '@playwright/test'

const LIMITE_DE_DESLOCAMENTO = 0.1 // meta de CLS do projeto

async function abrirRadar(page: Page, caminho = '/radar') {
  await page.goto(caminho)
  await expect(page.locator('.radar[data-pronto="true"]')).toBeVisible()
}

test.describe('radar', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  test('abre a leitura pelo clique, guarda no endereço e restaura ao recarregar', async ({ page }) => {
    await abrirRadar(page)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Radar nº')
    const primeiro = page.locator('.radar .item').first()
    const titulo = (await primeiro.locator('.item-titulo').textContent()) ?? ''
    await primeiro.click()
    await expect(page.locator('.leitura-titulo')).toHaveText(titulo)
    await expect(page.getByText('Resumo gerado por IA; leia o original.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Abrir no arXiv ↗' })).toHaveAttribute('href', /^https:\/\/arxiv\.org\/abs\/\d{4}\.\d{4,5}$/)
    await expect(page).toHaveURL(/\?artigo=/)
    await page.reload()
    await expect(page.locator('.leitura-titulo')).toHaveText(titulo)
  })

  test('teclas: j e k percorrem, barra foca a busca, Esc fecha', async ({ page }) => {
    await abrirRadar(page)
    const itens = page.locator('.radar .item')
    await page.keyboard.press('j')
    await expect(itens.nth(0)).toHaveAttribute('aria-current', 'true')
    await page.keyboard.press('j')
    await expect(itens.nth(1)).toHaveAttribute('aria-current', 'true')
    await page.keyboard.press('k')
    await expect(itens.nth(0)).toHaveAttribute('aria-current', 'true')
    await page.keyboard.press('Escape')
    await expect(page.locator('.leitura-vazia')).toBeVisible()
    await page.keyboard.press('/')
    await expect(page.getByRole('searchbox')).toBeFocused()
  })

  test('filtro por área reduz a lista; busca sem resultado oferece limpar', async ({ page }) => {
    await abrirRadar(page)
    const itens = page.locator('.radar .item')
    const total = await itens.count()
    const area = page.locator('.radar .filtros button.opcao').first()
    const esperado = Number(await area.locator('.conta').textContent())
    await area.click()
    await expect(itens).toHaveCount(esperado)
    await expect(page).toHaveURL(/area=/)
    await page.getByRole('searchbox').fill('zzzz-nada-com-esse-nome')
    await expect(page.getByText('Nenhum artigo com esses filtros.')).toBeVisible()
    await page.getByRole('button', { name: 'Limpar filtros' }).click()
    await expect(itens).toHaveCount(total)
  })

  test('em tela estreita a leitura cobre a lista e o botão volta', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await abrirRadar(page)
    await page.locator('.radar .item').first().click()
    await expect(page.locator('.leitura-titulo')).toBeInViewport()
    await page.getByRole('button', { name: '← Voltar à lista' }).click()
    await expect(page.locator('.radar')).not.toHaveAttribute('data-lendo', 'true')
  })

  test('em tela estreita a lista não pula quando os filtros recolhem', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'a medida de layout-shift só existe no Chromium')
    await page.setViewportSize({ width: 375, height: 800 })
    // Processador mais lento, como no Lighthouse: sem isso a hidratação termina antes do primeiro quadro.
    const sessao = await page.context().newCDPSession(page)
    await sessao.send('Emulation.setCPUThrottlingRate', { rate: 6 })
    await abrirRadar(page)
    await expect(page.locator('.radar details[open]')).toHaveCount(0)
    const deslocamento = await page.evaluate(() => new Promise<number>((resolver) => {
      let soma = 0
      const somar = (entradas: PerformanceEntryList) => {
        for (const entrada of entradas) soma += (entrada as PerformanceEntry & { value: number }).value
      }
      const observador = new PerformanceObserver((lista) => somar(lista.getEntries()))
      observador.observe({ type: 'layout-shift', buffered: true })
      requestAnimationFrame(() => requestAnimationFrame(() => {
        somar(observador.takeRecords())
        resolver(soma)
      }))
    }))
    expect(deslocamento).toBeLessThan(LIMITE_DE_DESLOCAMENTO)
  })

  test('a página do artigo abre sozinha, com aviso, original e volta para a edição', async ({ page }) => {
    await abrirRadar(page)
    const destino = await page.locator('.radar .item').first().getAttribute('href')
    await page.goto(destino ?? '')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText('Resumo gerado por IA; leia o original.')).toBeVisible()
    await page.getByRole('link', { name: /← Radar nº/ }).click()
    await expect(page).toHaveURL(/\/radar\/\d{4}-W\d{2}$/)
  })

  test('chegar ao radar por um conceito da página do artigo já traz a lista filtrada', async ({ page }) => {
    await abrirRadar(page)
    const destino = await page.locator('.radar .item').first().getAttribute('href')
    await page.goto(destino ?? '')
    await page.locator('.radar-artigo a.etiqueta').first().click()
    await expect(page.locator('.radar[data-pronto="true"]')).toBeVisible()
    await expect(page.locator('.radar .filtros .etiqueta[aria-pressed="true"]')).toHaveCount(1)
    await expect(page).toHaveURL(/conceito=/)
  })

  test('nada local vai para o ar: sem caminho de pasta, sem Obsidian, sem fila sem resumo', async ({ page }) => {
    await abrirRadar(page)
    const html = await page.content()
    expect(html).not.toContain('/Users/')
    expect(html).not.toContain('obsidian://')
    expect(html).not.toContain('triados sem resumo')
  })

  test('o início mostra a edição atual do radar', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 2, name: /Radar nº/ })).toBeVisible()
  })
})
