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
