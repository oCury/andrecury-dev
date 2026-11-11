import { test } from '@playwright/test'

const LARGURAS = [320, 768, 1024, 1440]
const PAGINAS = { inicio: '/', blog: '/blog', post: '/blog/modelo-de-post', projetos: '/projetos', projeto: '/projetos/modelo-de-projeto', sobre: '/sobre' }

for (const tema of ['light', 'dark'] as const) {
  for (const largura of LARGURAS) {
    test(`capturas ${tema} ${largura}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' })
      await page.setViewportSize({ width: largura, height: 900 })
      for (const [nome, caminho] of Object.entries(PAGINAS)) {
        await page.goto(caminho)
        await page.screenshot({ path: `test-results/capturas/${tema}-${largura}-${nome}.png`, fullPage: true })
      }
    })
  }
}
