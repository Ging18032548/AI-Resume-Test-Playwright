import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Dashboard Page Tests', () => {
  test('should load dashboard successfully', async ({ page }) => {
    // เปลี่ยน URL ไปยังหน้าเว็บของคุณ หรือใช้ mock page
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });
});