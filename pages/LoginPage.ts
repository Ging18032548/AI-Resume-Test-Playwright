import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  readonly registerLink: Locator;
  readonly forgotPasswordLink: Locator;

  readonly nameInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;

  readonly resetEmailInput: Locator;
  readonly resetSubmitButton: Locator;
  readonly resetConfirmation: Locator;

  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);

    // =========================
    // Login
    // =========================

    this.emailInput = page
      .locator('input[type="email"]')
      .first();

    this.passwordInput = page
      .locator('input[type="password"]')
      .first();

    this.loginButton = page
      .locator('button[type="submit"]')
      .first();

    this.errorMessage = page
      .locator(
        '[role="alert"], ' +
        '[data-testid="login-error"], ' +
        '.error-message, ' +
        '.form-error'
      )
      .first();

    // =========================
    // Register / Sign Up
    // =========================

    this.registerLink = page
      .getByRole('link', {
        name: /register|sign up|create account/i,
      })
      .first();

    this.forgotPasswordLink = page
      .getByRole('link', {
        name: /forgot password|reset password/i,
      })
      .first();

    this.nameInput = page
      .getByLabel(
        /name|full name|display name/i
      )
      .first();

    this.confirmPasswordInput = page
      .getByLabel(
        /confirm password|password confirmation/i
      )
      .first();

    this.registerButton = page
      .getByRole('button', {
        name: /register|sign up|create account/i,
      })
      .first();

    // =========================
    // Password Reset
    // =========================

    this.resetEmailInput = page
      .locator('input[type="email"]')
      .first();

    this.resetSubmitButton = page
      .getByRole('button', {
        name: /reset|send|submit/i,
      })
      .first();

    this.resetConfirmation = page
      .locator(
        '[data-testid="reset-confirmation"], ' +
        '[role="status"], ' +
        '.success-message'
      )
      .first();

    // =========================
    // Logout
    // =========================

    this.logoutButton = page
      .getByRole('button', {
        name: /logout|sign out/i,
      })
      .first();
  }

  // =========================
  // Login
  // =========================

  async gotoLogin() {
    await this.page.goto('/login', {
      waitUntil: 'domcontentloaded',
    });
  }

  async login(
    email: string,
    password: string
  ) {
    await this.gotoLogin();

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    await expect(
      this.loginButton
    ).toBeEnabled();

    await this.loginButton.click();
  }

  async expectLoggedIn() {
    await expect(this.page).toHaveURL(
      /dashboard|analyze|home/i
    );
  }

  async expectLoginError(pattern?: RegExp) {
    await expect(
      this.errorMessage
    ).toBeVisible();

    if (pattern) {
      await expect(
        this.errorMessage
      ).toHaveText(pattern);
    }
  }

  // =========================
  // Register
  // =========================

  async gotoRegister() {
    await this.page.goto('/register', {
      waitUntil: 'domcontentloaded',
    });
  }

  async register(
    name: string,
    email: string,
    password: string,
    confirmPassword = password
  ) {
    await this.gotoRegister();

    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(
      confirmPassword
    );

    await this.registerButton.click();
  }

  // =========================
  // Password Reset
  // =========================

  async requestPasswordReset(
    email: string
  ) {
    await this.page.goto(
      '/forgot-password',
      {
        waitUntil: 'domcontentloaded',
      }
    );

    await this.resetEmailInput.fill(email);
    await this.resetSubmitButton.click();
  }

  async expectPasswordResetRequested() {
    await expect(
      this.resetConfirmation
    ).toBeVisible();
  }

  // =========================
  // Logout
  // =========================

  async logout() {
    await this.openMobileMenuIfPresent();
    await this.openUserMenuIfPresent();

    await expect(
      this.logoutButton
    ).toBeVisible();

    await this.logoutButton.click();
  }

  async expectLoggedOut() {
    await expect(this.page).toHaveURL(
      /login|signin|auth/i
    );
  }
}