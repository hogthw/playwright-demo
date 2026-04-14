import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { getOTP } from '../utils/getOTP';

const URL = 'https://stg-cm-backoffice.eton.vn/client/otp-login';


test('Check lỗi bỏ trống Email', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('button', { name: 'Gửi mã OTP' }).click();

  await expect(page.locator('body'))
    .toContainText(/vui lòng nhập email/i);
});


test('Check lỗi Email sai định dạng', async ({ page }) => {
  await page.goto(URL);

  const emailInput = page.getByRole('textbox', { name: 'Thư điện tử' });

  await emailInput.fill('ffff');

  await page.getByRole('button', { name: 'Gửi mã OTP' }).click();

  const validationMessage = await emailInput.evaluate(
    (input: HTMLInputElement) => input.validationMessage
  );

  expect(validationMessage).toContain("@");
});


test('Check Email chưa được tạo trên hệ thống', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Thư điện tử' })
    .fill('fake_email_999999@gmail.com');

  await page.getByRole('button', { name: 'Gửi mã OTP' }).click();

  await expect(page.locator('body'))
    .toContainText(/không tồn tại|không tìm thấy|tài khoản/i);
});

test('Login thất bại với mã OTP sai', async ({ page }) => {

  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Thư điện tử' })
    .fill(process.env.GMAIL_USER!);

  await page.getByRole('button', { name: 'Gửi mã OTP' }).click();

  const otpInput = page.getByRole('textbox', { name: 'Mã xác thực' });
  await expect(otpInput).toBeVisible();

  await otpInput.fill('000000');

  await page.getByRole('button', { name: 'Xác thực' }).click();

  await expect(page.locator('body'))
    .toContainText(/không hợp lệ|hết hạn|sai/i);
});

test('Login bằng OTP Gmail', async ({ page }) => {

  await page.goto(URL);

  const emailInput = page.getByRole('textbox', { name: 'Thư điện tử' });
  await expect(emailInput).toBeVisible();

  await emailInput.fill(process.env.GMAIL_USER!);

  await page.getByRole('button', { name: 'Gửi mã OTP' }).click();

  await expect(page.locator('.otp-user'))
    .toContainText(process.env.GMAIL_USER!);

  const otpInput = page.getByRole('textbox', { name: 'Mã xác thực' });
  await expect(otpInput).toBeVisible();

  let otp: string | null = null;

  for (let i = 0; i < 10; i++) {
    otp = await getOTP();
    console.log(`Lần thử ${i + 1}: OTP ->`, otp);

    if (otp) break;

    await page.waitForTimeout(3000);
  }

  expect(otp).toBeTruthy();

  await otpInput.fill(otp!);

  await page.getByRole('button', { name: 'Xác thực' }).click();

  await page.waitForLoadState('networkidle');

  await expect(page.locator('body'))
    .toContainText(process.env.GMAIL_USER!);
});