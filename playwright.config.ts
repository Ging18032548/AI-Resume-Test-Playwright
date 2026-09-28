import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'node:path';

// โหลดตัวแปรจากไฟล์ .env (BASE_URL, API_BASE_URL, TEST_EMAIL, TEST_PASSWORD)
dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL = process.env.BASE_URL || 'https://town-blanket-franchise-ranking.trycloudflare.com';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results', // ที่เก็บ screenshot / video / trace ดิบ

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  timeout: 90_000, // การวิเคราะห์ CV ด้วย AI ใช้เวลานาน จึงตั้ง timeout ต่อเทสต์ให้สูง
  expect: { timeout: 15_000 },

  // ------------------------------------------------------------------
  // Reporter: HTML Report จะฝัง screenshot + video + trace ไว้ในหน้ารายงาน
  // เปิดดูและกดเล่นวิดีโอได้ทันทีบนเบราว์เซอร์ ไม่ต้องไปเปิดไฟล์ในโฟลเดอร์เอง
  //  - รันในเครื่อง: เปิดรายงานอัตโนมัติเมื่อเทสต์ 'ล้มเหลว'
  //  - รันบน CI: ไม่เปิดเบราว์เซอร์ (เพราะไม่มีหน้าจอ)
  // ------------------------------------------------------------------
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: process.env.CI ? 'never' : 'on-failure' }],
  ],

  use: {
    baseURL: BASE_URL,

    // --- Artifacts ---
    screenshot: 'only-on-failure', // ถ่ายภาพหน้าจอเฉพาะตอนเทสต์ล้ม
    video: 'retain-on-failure',    // อัดวิดีโอทุกเทสต์ แต่เก็บไว้เฉพาะเทสต์ที่ล้ม
    trace: 'retain-on-failure',    // เก็บ trace (ดู timeline/DOM/network ย้อนหลัง) เมื่อล้ม
    // หมายเหตุ: ถ้าอยากใช้ 'on-first-retry' ต้องตั้ง retries >= 1 มิฉะนั้น trace จะไม่ถูกเก็บ

    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    ignoreHTTPSErrors: true,
  },

  // ------------------------------------------------------------------
  // Cross-device projects
  // ------------------------------------------------------------------
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1920, height: 1080 } },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 14 Pro'] }, // WebKit + viewport/UA ของ iPhone 14 Pro (สลับเป็น 'iPhone 13' ได้)
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
