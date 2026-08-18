import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    hookTimeout: 60000,
    testTimeout: 60000,
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: [
            'layers/*/test/unit/**/*.test.ts',
            'test/unit/**/*.test.ts',
          ],
        },
      },
      // Note: defineVitestProject is async, but inside an array it might need to be resolved.
      // Wait, in the template it has `await defineVitestProject(...)` but top-level await might not work without some tsconfig changes, let's see. 
      // The template uses `await defineVitestProject({ ... })` inside the array. I will use the exact template.
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      await defineVitestProject({
        test: {
          name: 'nuxt',
          environment: 'nuxt',
          hookTimeout: 60000,
          testTimeout: 60000,
          include: [
            'layers/*/test/nuxt/**/*.test.ts',
            'test/nuxt/**/*.test.ts',
          ],
        },
      }),
    ],
  },
})
