import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: './tests',

  outputDir: './test-results',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  timeout: 90_000,

  expect: {
    timeout: 15_000,
  },

  reporter: [
    ['list'],
    ['html', {
      outputFolder: 'playwright-report',
      open: 'always', // เพิ่มให้เปิดเบราว์เซอร์ดูรายงานอัตโนมัติทุกครั้งเมื่อรันเสร็จ
    }],
  ],

  use: {
    baseURL,

    actionTimeout: 15_000,

    navigationTimeout: 30_000,

    trace: 'retain-on-failure',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    ignoreHTTPSErrors: true,

    // Show the browser during local runs; CI remains headless.
    headless: !!process.env.CI,
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: {
          width: 1920,
          height: 1080,
        },
      },
    },

    {
      name: 'Desktop Firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: {
          width: 1920,
          height: 1080,
        },
      },
    },

    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 14 Pro'],
      },
    },

    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
  ],
});