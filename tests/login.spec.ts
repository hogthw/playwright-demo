import { test, expect } from '@playwright/test';
import 'dotenv/config';

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
    .fill(process.env.EMAIL!);

  await page.getByRole('button', { name: 'Gửi mã OTP' }).click();

  await page.pause();

  const otpInput = page.getByRole('textbox', { name: 'Mã xác thực' });
  await expect(otpInput).toBeVisible();

  await otpInput.fill('000000');

  await page.getByRole('button', { name: 'Xác thực' }).click();

  await expect(page.locator('body'))
    .toContainText(/không hợp lệ|hết hạn|sai/i);
});


test('Login bằng OTP (RPA)', async ({ page }) => {
  await page.goto(URL);

  const emailInput = page.getByRole('textbox', { name: 'Thư điện tử' });
  await expect(emailInput).toBeVisible();

  const email = process.env.EMAIL!;
  await emailInput.fill(email);

  await page.getByRole('button', { name: 'Gửi mã OTP' }).click();

  await page.pause(); // captcha

  const otpInput = page.getByRole('textbox', { name: 'Mã xác thực' });
  await expect(otpInput).toBeVisible();

  await page.pause(); // nhập OTP

  await page.getByRole('button', { name: 'Xác thực' }).click();

  await expect(page).toHaveURL(/claim-request/, { timeout: 15000 });
});


test('Multi Email Context', async ({ page }) => {
  const emailList = [
    'test@gmail.com',
    'test@outlook.com',
    'tester@vota.vn'
  ];

  for (const email of emailList) {
    await page.goto(URL);

    await page.getByRole('textbox', { name: 'Thư điện tử' }).fill(email);

    await page.getByRole('button', { name: 'Gửi mã OTP' }).click();

    await expect(page.locator('body')).toBeVisible();

    console.log('Test với email:', email);
  }
});


test('User Flow thực tế (RPA)', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Thư điện tử' })
    .fill(process.env.EMAIL!);

  await page.getByRole('button', { name: 'Gửi mã OTP' }).click();

  await page.pause();

  const otpInput = page.getByRole('textbox', { name: 'Mã xác thực' });
  await expect(otpInput).toBeVisible();

  await page.pause();

  await page.getByRole('button', { name: 'Xác thực' }).click();

  await expect(page).toHaveURL(/claim-request/, { timeout: 15000 });
});