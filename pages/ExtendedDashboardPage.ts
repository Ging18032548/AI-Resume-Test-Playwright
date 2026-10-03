import { Page, Locator, expect } from '@playwright/test';
import { DashboardPage } from './DashboardPage';

export class ExtendedDashboardPage extends DashboardPage {
  readonly removeFileButton: Locator;
  readonly uploadZone: Locator;
  readonly resultSummary: Locator;

  constructor(page: Page) {
    super(page);

    this.removeFileButton = page
      .getByRole('button', {
        name: /remove|delete|clear/i,
      })
      .or(
        page.locator('[data-testid="remove-file"]')
      );

    this.uploadZone = page
      .locator('[data-testid="upload-zone"]')
      .or(
        page.locator(
          '[class*="upload"], [class*="dropzone"]'
        )
      );

    this.resultSummary = page
      .locator(
        '[data-testid="analysis-results"]'
      );
  }

  async expectNoFileSelected(): Promise<void> {
    await expect(
      this.fileInput
    ).toHaveValue('');
  }

  async removeFileIfPresent(): Promise<void> {
    if (
      await this.removeFileButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await this.removeFileButton
        .first()
        .click();
    }
  }

  async expectResultsVisible(): Promise<void> {
    await expect(
      this.resultsSection
    ).toBeVisible({
      timeout: 75_000,
    });
  }

  async expectScoreInValidRange(): Promise<void> {
    const score = await this.getOverallScoreValue();

    expect(score)
      .toBeGreaterThanOrEqual(0);

    expect(score)
      .toBeLessThanOrEqual(100);
  }

  async expectKeywordSectionAvailable(): Promise<void> {
    const matched =
      await this.getKeywordTexts('matched');

    const missing =
      await this.getKeywordTexts('missing');

    expect(
      matched.length + missing.length
    ).toBeGreaterThan(0);
  }

  async expectFeedbackAvailable(): Promise<void> {
    await expect(
      this.feedbackItems.first()
    ).toBeVisible();

    const feedback =
      await this.feedbackItems.allTextContents();

    expect(
      feedback.join(' ').trim()
    ).not.toBe('');
  }
}