import {
  test,
  expect,
} from '@playwright/test';

import {
  env,
} from '../../utils/testData';

import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe(
  'Navigation & Session',
  () => {

    test(
      'NAV-001: Dashboard can be opened after login',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        const dashboard =
          new DashboardPage(page);

        await login.login(
          env.testEmail,
          env.testPassword
        );

        await dashboard.goto();

        await expect(
          dashboard.fileInput
        ).toBeAttached();
      }
    );


    test(
      'NAV-002: Dashboard survives refresh',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.login(
          env.testEmail,
          env.testPassword
        );

        await page.reload();

        await expect(
          page
        ).toHaveURL(/dashboard|analy[sz]e|home/i);
      }
    );


    test(
      'NAV-003: Protected dashboard redirects after logout',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.login(
          env.testEmail,
          env.testPassword
        );

        await login.logout();

        await page.goto('/dashboard');

        await expect(
          page
        ).toHaveURL(/sign-in|login/i);
      }
    );


    test(
      'NAV-004: Profile page accessible',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.login(
          env.testEmail,
          env.testPassword
        );

        await page.goto('/profile');

        await expect(
          page
        ).toHaveURL(/profile/i);
      }
    );


    test(
      'NAV-005: Browser back navigation works',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.login(
          env.testEmail,
          env.testPassword
        );

        await page.goto('/profile');

        await page.goto('/dashboard');

        await page.goBack();

        await expect(
          page
        ).toHaveURL(/profile/i);
      }
    );


    test(
      'NAV-006: Browser forward navigation works',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.login(
          env.testEmail,
          env.testPassword
        );

        await page.goto('/profile');

        await page.goto('/dashboard');

        await page.goBack();

        await page.goForward();

        await expect(
          page
        ).toHaveURL(/dashboard/i);
      }
    );


    test(
      'NAV-007: Login session survives reload',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.login(
          env.testEmail,
          env.testPassword
        );

        await page.reload();

        await expect(
          page
        ).not.toHaveURL(/login/i);
      }
    );

  }
);
