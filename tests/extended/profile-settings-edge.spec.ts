import {
  test,
  expect,
} from '@playwright/test';

import {
  env,
  hasTestAccount,
  STRONG_PASSWORD,
} from '../../utils/testData';

import { LoginPage } from '../../pages/LoginPage';
import { ProfilePage } from '../../pages/ProfilePage';

test.describe(
  'Profile & Settings - Extended',
  () => {

    test.beforeEach(
      async ({ page }) => {

        test.skip(!hasTestAccount(), 'Set TEST_EMAIL and TEST_PASSWORD in .env to run profile checks.');

        const login =
          new LoginPage(page);

        await login.login(
          env.testEmail,
          env.testPassword
        );
      }
    );


    test(
      'PROFILE-EDGE-001: Open profile page',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        await profile.goto();

        await expect(
          profile.displayNameInput
        ).toBeVisible();
      }
    );


    test(
      'PROFILE-EDGE-002: Update display name',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        await profile.goto();

        await profile.updateDisplayName(
          `QA User ${Date.now()}`
        );

        await profile.expectSaved();
      }
    );


    test(
      'PROFILE-EDGE-003: Empty display name',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        await profile.goto();

        await profile.displayNameInput.fill('');

        await profile.saveButton.click();

        await expect(
          profile.formError.first()
        ).toBeVisible();
      }
    );


    test(
      'PROFILE-EDGE-004: Password mismatch',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        await profile.goto();

        await profile.changePassword(
          env.testPassword,
          STRONG_PASSWORD,
          'DifferentPassword123!'
        );

        await profile.expectFormError(
          /match|password|confirm/i
        );
      }
    );


    test(
      'PROFILE-EDGE-005: Wrong current password',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        await profile.goto();

        await profile.changePassword(
          'WrongCurrentPassword999!',
          STRONG_PASSWORD,
          STRONG_PASSWORD
        );

        await profile.expectFormError(
          /incorrect|invalid|wrong|password/i
        );
      }
    );


    test(
      'PROFILE-EDGE-006: Weak new password',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        await profile.goto();

        await profile.changePassword(
          env.testPassword,
          '123',
          '123'
        );

        await profile.expectFormError(
          /password|weak|characters|length/i
        );
      }
    );


    test(
      'PROFILE-EDGE-007: Password fields are masked',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        await profile.goto();

        await expect(
          profile.currentPasswordInput
        ).toHaveAttribute(
          'type',
          'password'
        );

        await expect(
          profile.newPasswordInput
        ).toHaveAttribute(
          'type',
          'password'
        );

        await expect(
          profile.confirmNewPasswordInput
        ).toHaveAttribute(
          'type',
          'password'
        );
      }
    );

  }
);