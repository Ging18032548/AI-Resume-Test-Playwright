import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ExtendedDashboardPage } from '../pages/ExtendedDashboardPage';
import { ProfilePage } from '../pages/ProfilePage';
import { env, hasTestAccount } from '../utils/testData';
import { createValidCvPdf } from '../utils/testFiles';

test.describe('Critical user journey', () => {
  test.beforeEach(async () => {
    test.skip(!hasTestAccount(), 'Set TEST_EMAIL and TEST_PASSWORD in .env to run the critical journey.');
  });

  test('user can analyze a resume and safely leave the account', async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new ExtendedDashboardPage(page);
    const profile = new ProfilePage(page);

    await login.login(env.testEmail, env.testPassword);
    await login.expectLoggedIn();

    await dashboard.goto();
    await expect(dashboard.fileInput).toBeAttached();

    await dashboard.uploadResume(createValidCvPdf('critical-journey.pdf'));
    await dashboard.expectFileAccepted('critical-journey.pdf');
    await dashboard.selectFirstJobPositionIfAvailable();
    await dashboard.analyze();
    await dashboard.expectResultsVisible();
    await dashboard.expectScoreInValidRange();
    await dashboard.expectFeedbackAvailable();
    await dashboard.expectKeywordSectionAvailable();

    const scoreBeforeReload = await dashboard.getOverallScoreValue();
    await page.reload();
    await dashboard.expectResultsVisible();
    await expect(dashboard.getOverallScoreValue()).resolves.toBe(scoreBeforeReload);

    await profile.goto();
    await expect(profile.displayNameInput).toBeVisible();

    await login.logout();
    await login.expectLoggedOut();
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/sign-in|login/i);
  });
});