import { expect, test } from '@playwright/test'

const DESTAQUES = [
  { titulo: 'AgendaHora', slug: 'agendahora' },
  { titulo: 'Motor de Vendas', slug: 'motor-de-vendas' },
  { titulo: 'Olho3D', slug: 'olho3d' },
  { titulo: 'Vida', slug: 'vida' },
]

test('/projetos mostra os quatro destaques em ordem, cada um com imagem carregada e descrita', async ({ page }) => {
  await page.goto('/projetos')
  const faixas = page.locator('.faixa')
  await expect(faixas).toHaveCount(DESTAQUES.length)
  for (const [indice, { titulo }] of DESTAQUES.entries()) {
    const faixa = faixas.nth(indice)
    await expect(faixa.getByRole('heading', { level: 3, name: titulo })).toBeVisible()
    const imagem = faixa.locator('img')
    await imagem.scrollIntoViewIfNeeded()
    await expect.poll(() => imagem.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
    await expect(imagem).toHaveAttribute('alt', /.{15,}/)
  }
})

test('o título da faixa leva à ficha do projeto', async ({ page }) => {
  await page.goto('/projetos')
  for (const { titulo, slug } of DESTAQUES) {
    await page.goto('/projetos')
    await page.locator('.faixa').getByRole('link', { name: titulo, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/projetos/${slug}$`))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(titulo)
  }
})

test('o Vida mostra o link para o código aberto', async ({ page }) => {
  await page.goto('/projetos')
  const link = page.locator('.faixa').filter({ hasText: 'Vida' }).getByRole('link', { name: /código/i })
  await expect(link).toHaveAttribute('href', 'https://github.com/oCury/vida')
  await expect(link).toHaveAttribute('rel', /noopener/)
})

test('os destaques não se repetem em "Outros projetos"', async ({ page }) => {
  await page.goto('/projetos')
  await expect(page.getByRole('heading', { level: 2, name: 'Em destaque' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Outros projetos' })).toBeVisible()
  const titulosDaLista = await page.locator('.indice h3').allTextContents()
  for (const { titulo } of DESTAQUES) expect(titulosDaLista).not.toContain(titulo)
})
