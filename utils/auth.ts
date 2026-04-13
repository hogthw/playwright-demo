import { expect, Page } from '@playwright/test';

export async function login(page: Page) {
  await page.goto('https://stg-cm-backoffice.eton.vn/user/login');

  await page.getByRole('textbox', { name: 'Tên người dùng' }).fill('hongthao');
  await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('Thaovu@123');

  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  // 👇 QUAN TRỌNG: đợi login xong hẳn
  await page.waitForLoadState('networkidle');

  // hoặc tốt hơn:
  await expect(page).not.toHaveURL(/login/);
}