import AxeBuilder from '@axe-core/playwright'
import { expect, test, type APIRequestContext } from '@playwright/test'

const DOMINIO = 'https://blog.andrecury.dev.br'
const LARGURAS = [320, 768, 1024, 1440]
const VIOLACAO_DE_CSP = /Content.Security.Policy|Refused to/i

async function caminhosDoSitemap(request: APIRequestContext): Promise<string[]> {
  const resposta = await request.get('/sitemap.xml')
  expect(resposta.ok()).toBe(true)
  const xml = await resposta.text()
  expect(xml).not.toContain('vercel.app')
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url.replace(DOMINIO, '') || '/')
}

test('a casca tem navegação principal, link para pular e link de volta à página inicial', async ({ page, browserName }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const navegacao = page.getByRole('navigation', { name: 'Navegação principal' })
  for (const rotulo of ['Projetos', 'Blog', 'Sobre']) {
    await expect(navegacao.getByRole('link', { name: rotulo })).toBeVisible()
  }
  await expect(page.getByRole('link', { name: 'Contato e página inicial' })).toHaveAttribute('href', 'https://andrecury.dev.br')
  // No Safari, Tab sozinho pula os links (padrão do macOS); Option+Tab percorre todos.
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab')
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused()
})

test('endereço que não existe responde 404 com a página do site', async ({ page }) => {
  const resposta = await page.goto('/nao-existe')
  expect(resposta?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Página não encontrada')
})

test('o blog lista os textos e abre um deles com data e corpo', async ({ page }) => {
  await page.goto('/blog')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Blog')
  await page.getByRole('link', { name: 'Modelo de post' }).click()
  await expect(page).toHaveURL(/\/blog\/modelo-de-post$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Modelo de post')
  await expect(page.locator('time')).toHaveAttribute('datetime', '2026-11-11')
  await expect(page.locator('.prosa')).toContainText('frontmatter')
  await expect(page.locator('.prosa')).not.toContainText('titulo: Modelo de post')
})

test('projetos lista os projetos e abre a ficha de um deles', async ({ page }) => {
  await page.goto('/projetos')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projetos')
  await page.getByRole('link', { name: 'Modelo de projeto' }).click()
  await expect(page).toHaveURL(/\/projetos\/modelo-de-projeto$/)
  const ficha = page.locator('.ficha')
  await expect(ficha).toContainText('estudo')
  await expect(ficha).toContainText('2026')
  await expect(page.locator('.prosa')).toContainText('O problema')
})

test('o início mostra projetos e textos, e as páginas Sobre e Privacidade abrem', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 2, name: 'Projetos' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Blog' })).toBeVisible()
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Sobre' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sobre')
  await page.getByRole('link', { name: 'Privacidade' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacidade')
  await expect(page.locator('.prosa')).toContainText('não usa cookies próprios')
})

test('toda página do sitemap responde 200, tem um h1, canonical no domínio próprio e não viola a CSP', async ({ page, request }) => {
  const violacoes: string[] = []
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error' && VIOLACAO_DE_CSP.test(mensagem.text())) violacoes.push(mensagem.text())
  })
  const caminhos = await caminhosDoSitemap(request)
  expect(caminhos.length).toBeGreaterThanOrEqual(5)
  for (const caminho of caminhos) {
    const resposta = await page.goto(caminho)
    expect(resposta?.status(), caminho).toBe(200)
    await expect(page.locator('h1'), caminho).toHaveCount(1)
    expect(await page.content(), caminho).not.toContain('vercel.app')
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical, caminho).toMatch(/^https:\/\/blog\.andrecury\.dev\.br(\/|$)/)
  }
  expect(violacoes).toEqual([])
})

test('nenhuma página rola de lado em 320, 768, 1024 e 1440', async ({ page, request }) => {
  const caminhos = await caminhosDoSitemap(request)
  for (const largura of LARGURAS) {
    await page.setViewportSize({ width: largura, height: 900 })
    for (const caminho of caminhos) {
      await page.goto(caminho)
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(sobra, `${caminho} em ${largura}px`).toBeLessThanOrEqual(0)
    }
  }
})

test('acessibilidade: sem violação WCAG A e AA, no tema claro e no escuro', async ({ page, request, browserName }) => {
  test.skip(browserName !== 'chromium', 'o axe roda uma vez; os outros navegadores cobrem comportamento')
  const caminhos = await caminhosDoSitemap(request)
  for (const tema of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: tema })
    for (const caminho of caminhos) {
      await page.goto(caminho)
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
      expect(violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`), `${caminho} (${tema})`).toEqual([])
    }
  }
})

test('cabeçalhos de segurança e RSS saem como esperado', async ({ request }) => {
  const inicio = await request.get('/')
  const cabecalhos = inicio.headers()
  expect(cabecalhos['content-security-policy']).toContain("frame-ancestors 'none'")
  expect(cabecalhos['x-frame-options']).toBe('DENY')
  expect(cabecalhos['x-content-type-options']).toBe('nosniff')
  expect(cabecalhos['strict-transport-security']).toContain('max-age=')
  expect(cabecalhos['x-powered-by']).toBeUndefined()

  const rss = await request.get('/rss.xml')
  expect(rss.headers()['content-type']).toContain('application/rss+xml')
  const xml = await rss.text()
  expect(xml).toContain('<rss version="2.0"')
  expect(xml).not.toContain('vercel.app')
})
