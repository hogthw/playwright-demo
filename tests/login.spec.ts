import { test, expect } from '@playwright/test';

const URL = 'https://stg-cm-backoffice.eton.vn/vi/user/login';

test('TC01 - Login success', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Tên người dùng' }).fill('hongthao');
  await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('Thaovu@123');

  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  await expect(page).toHaveURL(/dashboard|home|vi/);
});


test('TC02 - Wrong password', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Tên người dùng' }).fill('hongthao');
  await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('wrongpass');

  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  await expect(page).toHaveURL(/login/);
});


test('TC03 - Wrong username', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Tên người dùng' }).fill('wronguser');
  await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('Thaovu@123');

  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  await expect(page).toHaveURL(/login/);
});


test('TC04 - Empty fields', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  await expect(page).toHaveURL(/login/);
});


test('TC05 - Only username', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Tên người dùng' }).fill('hongthao');

  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  await expect(page).toHaveURL(/login/);
});


test('TC06 - Only password', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('Thaovu@123');

  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  await expect(page).toHaveURL(/login/);
});


test('TC07 - Enter key login', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Tên người dùng' }).fill('hongthao');
  await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('Thaovu@123');

  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/dashboard|home|vi/);
});