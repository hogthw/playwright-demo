import { test, expect } from '@playwright/test';

test('Test form liên hệ Eton - Day 1', async ({ page }) => {
  // 1. Đi đến trang web
  await page.goto('https://eton.vn/vi/Contact');

  // 2. Điền thông tin (Dùng .fill trực tiếp cho gọn)
  await page.getByRole('textbox', { name: 'Tên*:' }).fill('Hồng Thắm');
  await page.getByRole('textbox', { name: 'Công Ty:' }).fill('Công ty STTECH');
  await page.getByRole('textbox', { name: 'Email*:' }).fill('lththam375@gmail.com');
  await page.getByRole('textbox', { name: 'Số điện thoại' }).fill('0945012543');
  await page.getByRole('textbox', { name: 'Câu Hỏi/Thắc Mắc*:' }).fill('Bảng báo giá');

  // 3. Nhấn Gửi đi
  const submitBtn = page.getByRole('button', { name: 'Gửi đi' });
  await submitBtn.click();

  // 4. Xác nhận thông báo thành công
  const okBtn = page.getByText('OK', { exact: true });
  await expect(okBtn).toBeVisible(); 
  await okBtn.click();
});