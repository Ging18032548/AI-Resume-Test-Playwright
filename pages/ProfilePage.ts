import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/** ProfilePage: จัดการโปรไฟล์ผู้ใช้และการตั้งค่า (ชื่อที่แสดง, เปลี่ยนรหัสผ่าน) */
export class ProfilePage extends BasePage {
  readonly displayNameInput: Locator;
  readonly saveButton: Locator;
  readonly successToast: Locator;

  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmNewPasswordInput: Locator;
  readonly changePasswordButton: Locator;
  readonly formError: Locator;

  constructor(page: Page) {
    super(page);
    this.displayNameInput = page
      .getByLabel(/display name|full name|^name/i)
      .or(page.locator('[data-testid="display-name-input"]'));
    this.saveButton = page
      .getByRole('button', { name: /save/i })
      .or(page.locator('[data-testid="save-profile"]'));
    this.successToast = page
      .getByRole('status')
      .or(page.getByText(/saved|updated successfully/i))
      .or(page.locator('[data-testid="success-toast"]'));

    this.currentPasswordInput = page
      .getByLabel(/current password/i)
      .or(page.locator('[data-testid="current-password-input"]'));
    this.newPasswordInput = page
      .getByLabel(/^new password/i)
      .or(page.locator('[data-testid="new-password-input"]'));
    this.confirmNewPasswordInput = page
      .getByLabel(/confirm/i)
      .or(page.locator('[data-testid="confirm-new-password-input"]'));
    this.changePasswordButton = page
      .getByRole('button', { name: /change password|update password/i })
      .or(page.locator('[data-testid="change-password-submit"]'));
    this.formError = page.getByRole('alert').or(page.locator('[data-testid="form-error"]'));
  }

  async goto(): Promise<void> {
    await this.page.goto('/profile');
    await expect(this.displayNameInput).toBeVisible();
  }

  async updateDisplayName(name: string): Promise<void> {
    await this.displayNameInput.fill(name);
    await this.saveButton.click();
  }

  async expectSaved(): Promise<void> {
    await expect(this.successToast.first()).toBeVisible();
  }

  async changePassword(current: string, next: string, confirm: string): Promise<void> {
    await this.currentPasswordInput.fill(current);
    await this.newPasswordInput.fill(next);
    await this.confirmNewPasswordInput.fill(confirm);
    await this.changePasswordButton.click();
  }

  async expectFormError(pattern: RegExp): Promise<void> {
    await expect(this.formError.first()).toBeVisible();
    await expect(this.formError.first()).toContainText(pattern);
  }
}
