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

  expect(validationMessage).toBeTruthy();
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

  const otpInput = page.getByRole('textbox', { name: 'Mã xác thực' });
  await expect(otpInput).toBeVisible();

  await otpInput.fill('000000');

  await page.getByRole('button', { name: 'Xác thực' }).click();

  await expect(page.locator('body'))
    .toContainText(/không hợp lệ|hết hạn|sai/i);
});

test('Login bằng OTP (Manual Debug)', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Thư điện tử' })
    .fill(process.env.EMAIL!);

  await page.getByRole('button', { name: 'Gửi mã OTP' }).click();

  const otpInput = page.getByRole('textbox', { name: 'Mã xác thực' });
  await expect(otpInput).toBeVisible();

  await page.pause();

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

    console.log(`Test với email: ${email}`);
  }
});


test('User Flow thực tế (RPA OTP flow UI Mail)', async ({ page, context }) => {

  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Thư điện tử' })
    .fill(process.env.EMAIL!);

  await page.getByRole('button', { name: 'Gửi mã OTP' }).click();

  const otpInput = page.getByRole('textbox', { name: 'Mã xác thực' });
  await expect(otpInput).toBeVisible();

  const mailPage = await context.newPage();

  await mailPage.goto('https://mail.vota.vn/');

  await mailPage.getByRole('textbox', { name: 'Username' })
    .fill('tester@vota.vn');

  await mailPage.getByRole('textbox', { name: 'Password' })
    .fill('123@TestingMail');

  await mailPage.getByRole('button', { name: 'Login' }).click();

  await mailPage.getByRole('link', { name: /hộp thư/i }).click();

  await mailPage.waitForTimeout(2000);

  const firstMail = mailPage.locator('table tbody tr').first();
  await firstMail.click();

const frame = await mailPage
  .locator('iframe[name="messagecontframe"]')
  .contentFrame();

const bodyText = await frame!.locator('body').textContent();

const otp = bodyText?.match(/\d{6}/)?.[0];

console.log('OTP:', otp);

await page.bringToFront();

await page.getByRole('textbox', { name: 'Mã xác thực' })
  .fill(otp!);

await page.pause();

await Promise.all([
  page.getByRole('button', { name: 'Xác thực' }).click(),
  page.waitForSelector('text=Claim Request', { timeout: 120000 })
]);

  await expect(page).toHaveURL(/claim-request/, { timeout: 15000 });
});