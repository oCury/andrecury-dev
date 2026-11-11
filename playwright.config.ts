import { defineConfig, devices } from '@playwright/test'

const PORTA = 3040
const urlLocal = `http://localhost:${PORTA}`
const urlExterna = process.env.URL_BASE

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: [['list']],
  use: { baseURL: urlExterna ?? urlLocal, trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: urlExterna
    ? undefined
    : {
        command: `MOSTRAR_RASCUNHOS=1 npm run build && npm run start -- --port ${PORTA}`,
        url: urlLocal,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
})
