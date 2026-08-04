import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'
import type { ConfigOptions } from '@nuxt/test-utils/playwright'
// e2e always runs against the fully assembled app (all layers merged via
// `extends`), so there's exactly one rootDir here — the project root.
export default defineConfig<ConfigOptions>({
  testDir: './test/e2e',
  use: {
    nuxt: {
      rootDir: fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
