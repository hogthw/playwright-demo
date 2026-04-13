import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly url: string = 'https://stg-cm-backoffice.eton.vn/user/login';
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
   
    this.usernameInput = page.getByRole('textbox', { name: 'Tên người dùng' });
    this.passwordInput = page.getByRole('textbox', { name: 'Mật khẩu' });
    this.loginButton = page.getByRole('button', { name: 'Đăng nhập' });
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async login(user: string, pass: string) {
  
    if (user !== undefined) await this.usernameInput.fill(user);
    if (pass !== undefined) await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }

  async loginWithEnter(user: string, pass: string) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.page.keyboard.press('Enter');
  }

  async clearInputs() {
    await this.usernameInput.fill('');
    await this.passwordInput.fill('');
  }
}