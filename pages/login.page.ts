import { Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  emailInput = () => this.page.getByRole('textbox', { name: 'Thư điện tử' });
  sendOtpBtn = () => this.page.getByRole('button', { name: 'Gửi mã OTP' });
  otpInput = () => this.page.getByRole('textbox', { name: 'OTP' });
  confirmBtn = () => this.page.getByRole('button', { name: 'Xác nhận' });

  async goto(url: string) {
    await this.page.goto(url);
  }

  async sendOTP(email: string) {
    await this.emailInput().fill(email);
    await this.sendOtpBtn().click();
  }

  async login(otp: string) {
    await this.otpInput().fill(otp);
    await this.confirmBtn().click();
  }
}