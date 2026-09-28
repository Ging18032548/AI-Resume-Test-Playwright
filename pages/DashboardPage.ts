import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DashboardPage: อัปโหลดเรซูเม่ (PDF/DOCX), สั่งวิเคราะห์ด้วย AI และอ่านผลลัพธ์
 * (Score, Feedback, Keyword Matching)
 */
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

    // <input type="file"> มักถูกซ่อนไว้หลัง dropzone — setInputFiles ใช้กับ input ที่ซ่อนได้
    this.fileInput = page.locator('input[type="file"]');
    this.uploadedFileName = page.locator('[data-testid="uploaded-file-name"]');
    this.uploadError = page.getByRole('alert').or(page.locator('[data-testid="upload-error"]'));
    this.jobPositionSelect = page
      .getByLabel(/job position|position|role/i)
      .or(page.locator('[data-testid="job-position-select"]'));
    this.analyzeButton = page
      .getByRole('button', { name: /analy[sz]e/i })
      .or(page.locator('[data-testid="analyze-button"]'));
    this.loadingIndicator = page.locator('[data-testid="analysis-loading"]');

    this.resultsSection = page.locator('[data-testid="analysis-results"]');
    this.overallScore = page.locator('[data-testid="overall-score"]');
    this.feedbackItems = page.locator('[data-testid="feedback-item"]');
    this.matchedKeywords = page.locator('[data-testid="matched-keyword"]');
    this.missingKeywords = page.locator('[data-testid="missing-keyword"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
    await expect(this.fileInput).toBeAttached();
  }

  // ---------------- Upload ----------------
  async uploadResume(filePath: string): Promise<void> {
    await this.fileInput.setInputFiles(filePath);
  }

  async expectFileAccepted(fileName: string): Promise<void> {
    await expect(this.uploadedFileName).toContainText(fileName);
    await expect(this.uploadError).toHaveCount(0);
  }

  async expectUploadError(pattern: RegExp): Promise<void> {
    await expect(this.uploadError.first()).toBeVisible();
    await expect(this.uploadError.first()).toContainText(pattern);
  }

  async selectJobPosition(position: string): Promise<void> {
    const tag = await this.jobPositionSelect.evaluate((el) => el.tagName.toLowerCase());
    if (tag === 'select') {
      await this.jobPositionSelect.selectOption({ label: position }); // native <select>
    } else {
      await this.jobPositionSelect.click(); // custom dropdown
      await this.page.getByRole('option', { name: position }).click();
    }
  }

  // ---------------- Analysis ----------------
  async analyze(): Promise<void> {
    await this.analyzeButton.click();
  }

  /** รอจนผลลัพธ์แสดง (AI ใช้เวลานาน จึงให้ timeout ยาวเป็นพิเศษ) */
  async waitForResults(timeout = 75_000): Promise<void> {
    await expect(this.resultsSection).toBeVisible({ timeout });
  }

  /** ดึงคะแนนรวมเป็นตัวเลข เช่น "82/100" -> 82 */
  async getOverallScore(): Promise<number> {
    const text = (await this.overallScore.textContent()) ?? '';
    const match = text.match(/\d+(\.\d+)?/);
    if (!match) throw new Error(`Overall score is not numeric: "${text}"`);
    return Number(match[0]);
  }

  async getKeywordTexts(kind: 'matched' | 'missing'): Promise<string[]> {
    const locator = kind === 'matched' ? this.matchedKeywords : this.missingKeywords;
    return (await locator.allTextContents()).map((t) => t.trim()).filter(Boolean);
  }
}
