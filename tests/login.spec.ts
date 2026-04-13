import { test, expect } from '@playwright/test';

const URL = 'https://stg-cm-backoffice.eton.vn/user/login';

const USER = {
  username: 'hongthao',
  password: 'Thaovu@123',
};

test.describe('Login Feature', () => {

  test('TC01 - Login thành công', async ({ page }) => {
    await page.goto(URL);

    await page.getByRole('textbox', { name: 'Tên người dùng' }).fill(USER.username);
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill(USER.password);
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page).not.toHaveURL(/login/);
  });

  test('TC02 - Bỏ trống password', async ({ page }) => {
    await page.goto(URL);

    await page.getByRole('textbox', { name: 'Tên người dùng' }).fill(USER.username);
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page).toHaveURL(/login/);
  });

  test('TC03 - Bỏ trống username', async ({ page }) => {
    await page.goto(URL);

    await page.getByRole('textbox', { name: 'Tên người dùng' }).fill('');
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill(USER.password);
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page).toHaveURL(/login/);
  });

  test('TC04 - Sai username/password', async ({ page }) => {
    await page.goto(URL);

    await page.getByRole('textbox', { name: 'Tên người dùng' }).fill('wronguser');
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('wrongpass');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page).toHaveURL(/login/);
  });

  test('TC05 - Login bằng phím Enter', async ({ page }) => {
    await page.goto(URL);

    await page.getByRole('textbox', { name: 'Tên người dùng' }).fill(USER.username);
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill(USER.password);
    await page.keyboard.press('Enter');

    await expect(page).not.toHaveURL(/login/);
  });

  test('TC06 - Clear input rồi nhập lại', async ({ page }) => {
    await page.goto(URL);

    const username = page.getByRole('textbox', { name: 'Tên người dùng' });
    const password = page.getByRole('textbox', { name: 'Mật khẩu' });

    await username.fill('temp');
    await password.fill('temp');

    await username.fill('');
    await password.fill('');

    await username.fill(USER.username);
    await password.fill(USER.password);

    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page).not.toHaveURL(/login/);
  });

});