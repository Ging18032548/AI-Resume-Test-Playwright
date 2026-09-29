import {
  test,
  expect,
} from '@playwright/test';

import {
  createValidCvPdf,
  createValidCvDocx,
  createInvalidFileType,
  createFakePdfExtension,
  createOversizedCvPdf,
} from '../../utils/testFiles';

import {
  env,
  MAX_UPLOAD_MB,
} from '../../utils/testData';

import { LoginPage } from '../../pages/LoginPage';
import { ExtendedDashboardPage } from '../../pages/ExtendedDashboardPage';

test.describe(
  'Resume Upload - Extended',
  () => {

    test.beforeEach(
      async ({ page }) => {

        const login =
          new LoginPage(page);

        await login.login(
          env.testEmail,
          env.testPassword
        );
      }
    );


    test(
      'UPLOAD-EDGE-001: Dashboard opens without a resume',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        await dashboard.goto();

        await expect(
          dashboard.fileInput
        ).toBeAttached();

        await dashboard.expectNoFileSelected();
      }
    );


    test(
      'UPLOAD-EDGE-002: Analyze without selecting resume',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        await dashboard.goto();

        await dashboard.analyze();

        await dashboard.expectUploadError(
          /resume|file|upload|select/i
        );
      }
    );


    test(
      'UPLOAD-EDGE-003: Upload valid PDF',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        const file =
          createValidCvPdf(
            'extended-valid.pdf'
          );

        await dashboard.goto();

        await dashboard.uploadResume(file);

        await dashboard.expectFileAccepted(
          'extended-valid.pdf'
        );
      }
    );


    test(
      'UPLOAD-EDGE-004: Upload valid DOCX',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        const file =
          createValidCvDocx(
            'extended-valid.docx'
          );

        await dashboard.goto();

        await dashboard.uploadResume(file);

        await dashboard.expectFileAccepted(
          'extended-valid.docx'
        );
      }
    );


    test(
      'UPLOAD-EDGE-005: Reject TXT file',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        const file =
          createInvalidFileType();

        await dashboard.goto();

        await dashboard.uploadResume(file);

        await dashboard.expectUploadError(
          /file|type|format|pdf|docx/i
        );
      }
    );


    test(
      'UPLOAD-EDGE-006: Reject fake PDF',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        const file =
          createFakePdfExtension();

        await dashboard.goto();

        await dashboard.uploadResume(file);

        await dashboard.expectUploadError(
          /invalid|corrupt|file|pdf/i
        );
      }
    );


    test(
      'UPLOAD-EDGE-007: Reject oversized PDF',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        const file =
          createOversizedCvPdf(
            MAX_UPLOAD_MB + 2
          );

        await dashboard.goto();

        await dashboard.uploadResume(file);

        await dashboard.expectUploadError(
          /size|large|maximum|limit|mb/i
        );
      }
    );


    test(
      'UPLOAD-EDGE-008: Replace PDF with DOCX',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        const pdf =
          createValidCvPdf(
            'first-resume.pdf'
          );

        const docx =
          createValidCvDocx(
            'second-resume.docx'
          );

        await dashboard.goto();

        await dashboard.uploadResume(pdf);

        await dashboard.expectFileAccepted(
          'first-resume.pdf'
        );

        await dashboard.uploadResume(docx);

        await dashboard.expectFileAccepted(
          'second-resume.docx'
        );
      }
    );


    test(
      'UPLOAD-EDGE-009: Upload filename containing spaces',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        const file =
          createValidCvPdf(
            'My Resume Final.pdf'
          );

        await dashboard.goto();

        await dashboard.uploadResume(file);

        await dashboard.expectFileAccepted(
          'My Resume Final.pdf'
        );
      }
    );


    test(
      'UPLOAD-EDGE-010: Upload same PDF twice',
      async ({ page }) => {

        const dashboard =
          new ExtendedDashboardPage(page);

        const file =
          createValidCvPdf(
            'duplicate-upload.pdf'
          );

        await dashboard.goto();

        await dashboard.uploadResume(file);

        await dashboard.expectFileAccepted(
          'duplicate-upload.pdf'
        );

        await dashboard.uploadResume(file);

        await dashboard.expectFileAccepted(
          'duplicate-upload.pdf'
        );
      }
    );

  }
);