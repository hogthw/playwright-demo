import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  reporter: [
    ['html', { open: 'never' }]
  ],

  use: {
    screenshot: 'only-on-failure',
    video: 'on',
    trace: 'on-first-retry',
  },

  outputDir: 'test-results',
});