import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://tiki.vn/login');
  }

async login(email: string, password: string) {
  await this.page.waitForSelector('input[type="text"]');

  await this.page.locator('input[type="text"]').first().fill(email);
  await this.page.locator('input[type="password"]').fill(password);

  await this.page.click('button[type="submit"]');
}

  errorMessage() {
    return this.page.locator('text=không đúng');
  }
}