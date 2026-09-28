import { Page, Locator, TestInfo } from '@playwright/test';

/**
 * BasePage: ฟังก์ชันที่ทุกหน้าใช้ร่วมกัน (เมนูมือถือ, เมนูผู้ใช้, แนบภาพเข้ารายงาน)
 * แยกไว้ที่เดียวเพื่อไม่ให้ Page Object แต่ละหน้าเขียนซ้ำ
 */
export abstract class BasePage {
  readonly page: Page;
  readonly hamburgerMenuButton: Locator;
  readonly userMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hamburgerMenuButton = page
      .getByRole('button', { name: /menu|navigation/i })
      .or(page.locator('[data-testid="hamburger-menu"]'));
    this.userMenuButton = page
      .getByRole('button', { name: /account|profile|user menu/i })
      .or(page.locator('[data-testid="user-menu"]'));
  }

  /** true เมื่อ viewport แคบแบบมือถือ (Pixel 5 = 393px, iPhone 14 Pro = 393px) */
  protected isMobileViewport(): boolean {
    const viewport = this.page.viewportSize();
    return !!viewport && viewport.width < 768;
  }

  /** บนมือถือเมนูมักถูกซ่อนใน hamburger — เมธอดนี้เปิดให้เมื่อจำเป็น และไม่ทำอะไรบนเดสก์ท็อป */
  async openMobileMenuIfPresent(): Promise<void> {
    if (this.isMobileViewport() && (await this.hamburgerMenuButton.isVisible().catch(() => false))) {
      await this.hamburgerMenuButton.click();
    }
  }

  /**
   * ถ่ายภาพหน้าจอแล้ว "แนบเข้า HTML Report" ด้วย testInfo.attach
   * ภาพจะแสดงในรายงานทันที แม้เทสต์ผ่าน (ต่างจาก screenshot: 'only-on-failure' ที่ถ่ายเฉพาะตอนล้ม)
   */
  async attachScreenshot(testInfo: TestInfo, label: string, locator?: Locator): Promise<void> {
    const body = locator ? await locator.screenshot() : await this.page.screenshot({ fullPage: true });
    await testInfo.attach(`${label} [${testInfo.project.name}]`, { body, contentType: 'image/png' });
  }
}
