import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import {
  testEmail,
  testPassword,
} from '../../utils/testData';

test.describe('Mobile UI Tests', () => {

  test.beforeEach(async ({ page }) => {

    if (!testEmail || !testPassword) {
      test.skip(
        true,
        'TEST_EMAIL and TEST_PASSWORD are not configured in .env'
      );
    }

    const login = new LoginPage(page);

    await login.login(
      testEmail,
      testPassword
    );

    await login.expectLoggedIn();
  });

  test('MOBILE-001 - dashboard should load on mobile', async ({
    page,
  }) => {

    const dashboard = new DashboardPage(page);

    await dashboard.goto();

    await expect(page).toHaveURL(
      /dashboard/i
    );
  });

  test('MOBILE-002 - hamburger menu should be usable when available', async ({
    page,
  }) => {

    const menuButton = page.locator(
      '[data-testid="hamburger-menu"], ' +
      'button[aria-label*="menu" i], ' +
      'button[aria-label*="navigation" i]'
    ).first();

    if (await menuButton.count() === 0) {
      test.skip(
        true,
        'Mobile hamburger menu is not present.'
      );
    }

    if (!(await menuButton.isVisible())) {
      test.skip(
        true,
        'Mobile hamburger menu is not visible.'
      );
    }

    await menuButton.click();

    await expect(menuButton).toBeVisible();
  });

  test('MOBILE-003 - login page should be usable on mobile', async ({
    page,
  }) => {

    await page.goto('/login', {
      waitUntil: 'domcontentloaded',
    });

    await expect(
      page.getByLabel(/email/i).first()
    ).toBeVisible();

    await expect(
      page.getByLabel(/password/i).first()
    ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: /login|sign in/i,
      }).first()
    ).toBeVisible();
  });

});