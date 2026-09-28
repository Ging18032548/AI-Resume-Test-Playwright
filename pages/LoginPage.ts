import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage: หน้า Authentication ทั้งหมด — Login, Register, Password Reset, Logout
 * Locator หลักใช้ role/label (ทนต่อการเปลี่ยน CSS) และมี data-testid เป็นตัวสำรองผ่าน .or()
 * ต้องปรับ path (/login, /register, /forgot-password) และ testid ให้ตรงกับแอปจริง
 */
export class LoginPage extends BasePage {
  // --- Login ---
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;
  readonly forgotPasswordLink: Locator;

  // --- Register ---
  readonly nameInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;

  // --- Password reset ---
  readonly resetEmailInput: Locator;
  readonly resetSubmitButton: Locator;
  readonly resetConfirmation: Locator;

  // --- Logout ---
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);

    this.emailInput = page.getByLabel(/email/i).or(page.locator('[data-testid="email-input"]'));
    // /^password/ ไม่ match "Confirm password" จึงไม่เกิด strict-mode violation ในหน้า Register
    this.passwordInput = page.getByLabel(/^password/i).or(page.locator('[data-testid="password-input"]'));
    this.loginButton = page
      .getByRole('button', { name: /^(log ?in|sign ?in)$/i })
      .or(page.locator('[data-testid="login-submit"]'));
    this.errorMessage = page.getByRole('alert').or(page.locator('[data-testid="form-error"]'));
    this.registerLink = page
      .getByRole('link', { name: /register|sign ?up|create account/i })
      .or(page.locator('[data-testid="register-link"]'));
    this.forgotPasswordLink = page
      .getByRole('link', { name: /forgot|reset password/i })
      .or(page.locator('[data-testid="forgot-password-link"]'));

    this.nameInput = page.getByLabel(/name/i).or(page.locator('[data-testid="name-input"]'));
    this.confirmPasswordInput = page
      .getByLabel(/confirm/i)
      .or(page.locator('[data-testid="confirm-password-input"]'));
    this.registerButton = page
      .getByRole('button', { name: /register|sign ?up|create account/i })
      .or(page.locator('[data-testid="register-submit"]'));

    this.resetEmailInput = page.getByLabel(/email/i).or(page.locator('[data-testid="reset-email-input"]'));
    this.resetSubmitButton = page
      .getByRole('button', { name: /send|reset/i })
      .or(page.locator('[data-testid="reset-submit"]'));
    this.resetConfirmation = page
      .getByText(/check your email|reset link|sent/i)
      .or(page.locator('[data-testid="reset-confirmation"]'));

    this.logoutButton = page
      .getByRole('button', { name: /log ?out|sign ?out/i })
      .or(page.getByRole('menuitem', { name: /log ?out|sign ?out/i }))
      .or(page.locator('[data-testid="logout-button"]'));
  }

  // ---------------- Login ----------------
  async gotoLogin(): Promise<void> {
    await this.page.goto('/login');
    await expect(this.emailInput).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.gotoLogin();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard|analy[sz]e|home/i);
  }

  async expectLoginError(pattern: RegExp = /invalid|incorrect|wrong|failed/i): Promise<void> {
    await expect(this.errorMessage.first()).toBeVisible();
    await expect(this.errorMessage.first()).toContainText(pattern);
  }

  // ---------------- Register ----------------
  async gotoRegister(): Promise<void> {
    await this.page.goto('/register');
    await expect(this.registerButton).toBeVisible();
  }

  async register(name: string, email: string, password: string, confirmPassword = password): Promise<void> {
    await this.gotoRegister();
    if (await this.nameInput.first().isVisible().catch(() => false)) {
      await this.nameInput.first().fill(name);
    }
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    if (await this.confirmPasswordInput.first().isVisible().catch(() => false)) {
      await this.confirmPasswordInput.first().fill(confirmPassword);
    }
    await this.registerButton.click();
  }

  // ---------------- Password reset ----------------
  async requestPasswordReset(email: string): Promise<void> {
    await this.gotoLogin();
    await this.forgotPasswordLink.click();
    await this.resetEmailInput.fill(email);
    await this.resetSubmitButton.click();
  }

  async expectPasswordResetRequested(): Promise<void> {
    await expect(this.resetConfirmation.first()).toBeVisible();
  }

  // ---------------- Logout ----------------
  async logout(): Promise<void> {
    await this.openMobileMenuIfPresent();
    // ปุ่ม logout อาจซ่อนอยู่ในเมนูผู้ใช้ — เปิดเมนูก่อนถ้ายังไม่เห็นปุ่ม
    if (!(await this.logoutButton.first().isVisible().catch(() => false))) {
      await this.userMenuButton.first().click();
    }
    await this.logoutButton.first().click();
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.page).toHaveURL(/login|\/$/);
    await expect(this.loginButton.or(this.emailInput).first()).toBeVisible();
  }
}
