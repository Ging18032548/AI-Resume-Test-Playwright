import {
  test,
  expect,
} from '@playwright/test';

import {
  env,
  uniqueEmail,
  STRONG_PASSWORD,
} from '../../utils/testData';

import { LoginPage } from '../../pages/LoginPage';

test.describe(
  'Authentication - Extended Edge Cases',
  () => {

    test(
      'AUTH-EDGE-001: Login with empty email and password',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.gotoLogin();

        await login.loginButton.click();

        await expect(
          page
        ).toHaveURL(/login/i);
      }
    );


    test(
      'AUTH-EDGE-002: Login with unknown email',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.login(
          `unknown-${Date.now()}@example.com`,
          STRONG_PASSWORD
        );

        await login.expectLoginError();
      }
    );


    test(
      'AUTH-EDGE-003: Login with wrong password',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.login(
          env.testEmail,
          'WrongPassword999!'
        );

        await login.expectLoginError();
      }
    );


    test(
      'AUTH-EDGE-004: Login with invalid email format',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.gotoLogin();

        await login.emailInput.fill(
          'invalid-email'
        );

        await login.passwordInput.fill(
          STRONG_PASSWORD
        );

        await login.loginButton.click();

        await expect(
          page
        ).toHaveURL(/login/i);
      }
    );


    test(
      'AUTH-EDGE-005: Register with unique email',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.register(
          'Extended QA User',
          uniqueEmail(),
          STRONG_PASSWORD
        );

        await expect(
          page
        ).not.toHaveURL(/register/i);
      }
    );


    test(
      'AUTH-EDGE-006: Register with duplicate email',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.register(
          'Duplicate QA User',
          env.testEmail,
          STRONG_PASSWORD
        );

        await expect(
          login.errorMessage.first()
        ).toBeVisible();
      }
    );


    test(
      'AUTH-EDGE-007: Register with password mismatch',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.register(
          'Mismatch User',
          uniqueEmail(),
          STRONG_PASSWORD,
          'DifferentPassword123!'
        );

        await expect(
          page
        ).toHaveURL(/register/i);
      }
    );


    test(
      'AUTH-EDGE-008: Register with weak password',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.register(
          'Weak Password User',
          uniqueEmail(),
          '123'
        );

        await expect(
          login.errorMessage.first()
        ).toBeVisible();
      }
    );


    test(
      'AUTH-EDGE-009: Password reset with invalid email',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.gotoLogin();

        await login.forgotPasswordLink.click();

        await expect(
          page
        ).toHaveURL(
          /forgot-password|reset-password/i
        );

        await login.resetEmailInput.fill(
          'invalid-email'
        );

        await login.resetSubmitButton.click();

        await expect(
          page
        ).toHaveURL(
          /forgot-password|reset-password/i
        );
      }
    );


    test(
      'AUTH-EDGE-010: Logout and access dashboard again',
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
        ).toHaveURL(/login/i);
      }
    );


    test(
      'AUTH-EDGE-011: Refresh login page',
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.gotoLogin();

        await page.reload();

        await expect(
          login.emailInput
        ).toBeVisible();

        await expect(
          login.passwordInput
        ).toBeVisible();
      }
    );

  }
);