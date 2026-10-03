import {
  test,
  expect,
} from '@playwright/test';

import {
  createValidCvPdf,
  createValidCvDocx,
} from '../../utils/testFiles';

import {
  hasTestAccount,
  env,
} from '../../utils/testData';

import { LoginPage } from '../../pages/LoginPage';
import { ExtendedDashboardPage } from '../../pages/ExtendedDashboardPage';

test.describe(
  'AI Resume Analysis - Extended',
  () => {

    test.beforeEach(
      async ({ page }) => {

        test.skip(!hasTestAccount(), 'Set TEST_EMAIL and TEST_PASSWORD in .env to run analysis checks.');

        const login =
          new LoginPage(page);

        await login.login(
          env.testEmail,
          env.testPassword
        );
      }
    );


    test(
      'AI-EDGE-001: Analyze PDF successfully',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        await dashboard.goto();

        await dashboard.uploadResume(
          createValidCvPdf(
            'analysis-pdf.pdf'
          )
        );

        await dashboard.analyze();

        await dashboard.expectResultsVisible();
      }
    );


    test(
      'AI-EDGE-002: Analyze DOCX successfully',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        await dashboard.goto();

        await dashboard.uploadResume(
          createValidCvDocx(
            'analysis-docx.docx'
          )
        );

        await dashboard.analyze();

        await dashboard.expectResultsVisible();
      }
    );


    test(
      'AI-EDGE-003: Score must be between 0 and 100',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        await dashboard.goto();

        await dashboard.uploadResume(
          createValidCvPdf()
        );

        await dashboard.analyze();

        await dashboard.expectResultsVisible();

        await dashboard.expectScoreInValidRange();
      }
    );


    test(
      'AI-EDGE-004: Feedback is displayed',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        await dashboard.goto();

        await dashboard.uploadResume(
          createValidCvPdf()
        );

        await dashboard.analyze();

        await dashboard.expectResultsVisible();

        await dashboard.expectFeedbackAvailable();
      }
    );


    test(
      'AI-EDGE-005: Keyword matching is displayed',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        await dashboard.goto();

        await dashboard.uploadResume(
          createValidCvPdf()
        );

        await dashboard.analyze();

        await dashboard.expectResultsVisible();

        await dashboard.expectKeywordSectionAvailable();
      }
    );


    test(
      'AI-EDGE-006: Loading indicator appears or analysis completes',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        await dashboard.goto();

        await dashboard.uploadResume(
          createValidCvPdf()
        );

        await dashboard.analyze();

        const loading =
          dashboard.loadingIndicator;

        const results =
          dashboard.resultsSection;

        await Promise.race([
          loading.waitFor({
            state: 'visible',
            timeout: 5_000,
          }).catch(() => undefined),

          results.waitFor({
            state: 'visible',
            timeout: 75_000,
          }),
        ]);

        await dashboard.expectResultsVisible();
      }
    );


    test(
      'AI-EDGE-007: Result remains valid after reload',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        await dashboard.goto();

        await dashboard.uploadResume(
          createValidCvPdf()
        );

        await dashboard.analyze();

        await dashboard.expectResultsVisible();

        const scoreBefore =
          await dashboard.getOverallScoreValue();

        await page.reload();

        await dashboard.expectResultsVisible();

        const scoreAfter =
          await dashboard.getOverallScoreValue();

        expect(scoreAfter)
          .toBe(scoreBefore);
      }
    );


    test(
      'AI-EDGE-008: User can analyze another resume',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        await dashboard.goto();

        await dashboard.uploadResume(
          createValidCvPdf(
            'resume-one.pdf'
          )
        );

        await dashboard.analyze();

        await dashboard.expectResultsVisible();

        const firstScore =
          await dashboard.getOverallScoreValue();

        await dashboard.uploadResume(
          createValidCvDocx(
            'resume-two.docx'
          )
        );

        await dashboard.analyze();

        await dashboard.expectResultsVisible();

        const secondScore =
          await dashboard.getOverallScoreValue();

        expect(
          Number.isFinite(firstScore)
        ).toBeTruthy();

        expect(
          Number.isFinite(secondScore)
        ).toBeTruthy();
      }
    );

  }
);