import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    video: 'on',   
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  reporter: [['html', { open: 'never' }]],
});