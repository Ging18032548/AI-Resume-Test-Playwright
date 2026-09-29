import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly fileInput: Locator;
  readonly uploadedFileName: Locator;
  readonly uploadError: Locator;
  readonly jobPositionSelect: Locator;
  readonly analyzeButton: Locator;
  readonly loadingIndicator: Locator;
  readonly resultsSection: Locator;
  readonly overallScore: Locator;
  readonly feedbackItems: Locator;
  readonly matchedKeywords: Locator;
  readonly missingKeywords: Locator;

  constructor(page: Page) {
    super(page);

    this.fileInput = page.locator(
      'input[type="file"]'
    );

    this.uploadedFileName = page.locator(
      '[data-testid="uploaded-file-name"], ' +
      '.uploaded-file-name, ' +
      '[class*="file-name"]'
    ).first();

    this.uploadError = page.locator(
      '[role="alert"], ' +
      '[data-testid="upload-error"], ' +
      '.upload-error, ' +
      '.error-message'
    ).first();

    this.jobPositionSelect = page.locator(
      'select[name="jobPosition"], ' +
      'select[name="job"], ' +
      '[data-testid="job-position"]'
    ).first();

    this.analyzeButton = page.getByRole('button', {
      name: /analy[sz]e/i,
    }).first();

    this.loadingIndicator = page.locator(
      '[data-testid="loading"], ' +
      '[role="progressbar"], ' +
      '.loading, ' +
      '.spinner'
    ).first();

    this.resultsSection = page.locator(
      '[data-testid="analysis-results"], ' +
      '[data-testid="results"], ' +
      '.analysis-results, ' +
      '.results'
    ).first();

    this.overallScore = page.locator(
      '[data-testid="overall-score"], ' +
      '.overall-score'
    ).first();

    this.feedbackItems = page.locator(
      '[data-testid="feedback-item"], ' +
      '.feedback-item'
    );

    this.matchedKeywords = page.locator(
      '[data-testid="matched-keyword"], ' +
      '.matched-keyword'
    );

    this.missingKeywords = page.locator(
      '[data-testid="missing-keyword"], ' +
      '.missing-keyword'
    );
  }

  async goto() {
    await this.page.goto('/dashboard', {
      waitUntil: 'domcontentloaded',
    });
  }

  async uploadResume(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
  }

  async expectFileAccepted(fileName: string) {
    await expect(
      this.page.getByText(fileName, { exact: false }).first()
    ).toBeVisible({
      timeout: 10_000,
    });
  }

  async expectUploadError(pattern: RegExp) {
    await expect(this.uploadError).toBeVisible({
      timeout: 10_000,
    });

    await expect(this.uploadError).toHaveText(pattern);
  }

  async selectJobPosition(position: string) {
    if (await this.jobPositionSelect.count() > 0) {
      const tagName = await this.jobPositionSelect.evaluate(
        (element) => element.tagName.toLowerCase()
      );

      if (tagName === 'select') {
        await this.jobPositionSelect.selectOption({
          label: position,
        });

        return;
      }
    }

    const dropdown = this.page.getByRole('combobox').first();

    if (await dropdown.count() > 0) {
      await dropdown.click();

      const option = this.page.getByRole('option', {
        name: position,
      }).first();

      if (await option.count() > 0) {
        await option.click();
        return;
      }
    }

    throw new Error(
      `Job position selector was not found for "${position}"`
    );
  }

  async analyze() {
    await expect(this.analyzeButton).toBeVisible();
    await expect(this.analyzeButton).toBeEnabled();

    await this.analyzeButton.click();
  }

  async waitForResults(timeout = 75_000) {
    await expect(this.resultsSection).toBeVisible({
      timeout,
    });
  }

  async getOverallScore() {
    await expect(this.overallScore).toBeVisible();

    return await this.overallScore.innerText();
  }

  async getKeywordTexts(
    kind: 'matched' | 'missing'
  ) {
    const locator =
      kind === 'matched'
        ? this.matchedKeywords
        : this.missingKeywords;

    return await locator.allTextContents();
  }
}

