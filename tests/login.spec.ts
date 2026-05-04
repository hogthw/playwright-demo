import { test, expect } from '@playwright/test';

const URL = 'https://stg-cm-backoffice.eton.vn/vi/user/login';

// =========================
// TC01 - LOGIN SUCCESS
// =========================
test('TC01 - Login success', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Tên người dùng' }).fill('hongthao');
  await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('Thaovu@123');

  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  // verify login success (URL change)
  await expect(page).toHaveURL(/dashboard|home|vi/);
});


// =========================
// TC02 - WRONG PASSWORD
// =========================
test('TC02 - Wrong password', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Tên người dùng' }).fill('hongthao');
  await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('wrongpass');

  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  // check still in login page
  await expect(page).toHaveURL(/login/);
});


// =========================
// TC03 - WRONG USERNAME
// =========================
test('TC03 - Wrong username', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Tên người dùng' }).fill('wronguser');
  await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('Thaovu@123');

  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  await expect(page).toHaveURL(/login/);
});


// =========================
// TC04 - EMPTY FIELDS
// =========================
test('TC04 - Empty fields', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  // vẫn ở login page là PASS
  await expect(page).toHaveURL(/login/);
});


// =========================
// TC05 - ONLY USERNAME
// =========================
test('TC05 - Only username', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Tên người dùng' }).fill('hongthao');

  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  await expect(page).toHaveURL(/login/);
});


// =========================
// TC06 - ONLY PASSWORD
// =========================
test('TC06 - Only password', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('Thaovu@123');

  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  await expect(page).toHaveURL(/login/);
});


// =========================
// TC07 - ENTER KEY LOGIN
// =========================
test('TC07 - Enter key login', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('textbox', { name: 'Tên người dùng' }).fill('hongthao');
  await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('Thaovu@123');

  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/dashboard|home|vi/);
});