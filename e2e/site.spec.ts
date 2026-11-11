import { expect, test } from '@playwright/test'

test('a casca tem navegação principal, link para pular e link de volta à página inicial', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const navegacao = page.getByRole('navigation', { name: 'Navegação principal' })
  for (const rotulo of ['Projetos', 'Blog', 'Sobre']) {
    await expect(navegacao.getByRole('link', { name: rotulo })).toBeVisible()
  }
  await expect(page.getByRole('link', { name: 'Contato e página inicial' })).toHaveAttribute('href', 'https://andrecury.dev.br')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused()
})

test('endereço que não existe responde 404 com a página do site', async ({ page }) => {
  const resposta = await page.goto('/nao-existe')
  expect(resposta?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Página não encontrada')
})
