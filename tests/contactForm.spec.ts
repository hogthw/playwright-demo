import { test, expect } from '@playwright/test';


test.describe('Kiểm thử Form Liên hệ Eton - Mở rộng Day 1', () => {

 
  test.beforeEach(async ({ page }) => {
    await page.goto('https://eton.vn/vi/Contact');
  });

  // CASE 1: Luồng thành công 
  test('TC01: Gửi form thành công với dữ liệu hợp lệ', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Tên*:' }).fill('Hồng Thắm');
    await page.getByRole('textbox', { name: 'Công Ty:' }).fill('Công ty STTECH');
    await page.getByRole('textbox', { name: 'Email*:' }).fill('lththam375@gmail.com');
    await page.getByRole('textbox', { name: 'Số điện thoại' }).fill('0945012543');
    await page.getByRole('textbox', { name: 'Câu Hỏi/Thắc Mắc*:' }).fill('Bảng báo giá');

    await page.getByRole('button', { name: 'Gửi đi' }).click();
    
    const okBtn = page.getByText('OK', { exact: true });
    await expect(okBtn).toBeVisible(); 
    await okBtn.click();
  });

  // CASE 2: Kiểm tra bỏ trống trường bắt buộc (Validation)
  test('TC02: Kiểm tra lỗi khi để trống Tên', async ({ page }) => {
    await page.getByRole('button', { name: 'Gửi đi' }).click();
    // Kỹ thuật Expect: Kiểm tra thông báo lỗi hiển thị đúng nội dung
    await expect(page.getByText('Vui lòng nhập tên')).toBeVisible();
  });

  // CASE 3: Kiểm tra sai định dạng Email (Kỹ thuật Keyboard)
  test('TC03: Kiểm tra lỗi khi nhập sai định dạng Email', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email*:' }).fill('tham_nttu_sai_format');
    await page.keyboard.press('Enter'); // Dùng Enter thay vì Click để demo kỹ thuật mới
    await expect(page.getByText('Email không hợp lệ')).toBeVisible();
  });

  // CASE 4: Kiểm tra Số điện thoại (Kỹ thuật Clear dữ liệu)
  test('TC04: Kiểm tra lỗi khi nhập số điện thoại không hợp lệ', async ({ page }) => {
    const phoneInput = page.getByRole('textbox', { name: 'Số điện thoại' });
    await phoneInput.clear(); // Xóa trắng dữ liệu mặc định nếu có
    await phoneInput.fill('abc123456');
    await page.getByRole('button', { name: 'Gửi đi' }).click();
    await expect(page.getByText('Số điện thoại không hợp lệ')).toBeVisible();
  });

  // CASE 5: Kiểm tra bỏ trống nội dung thắc mắc
  test('TC05: Kiểm tra lỗi khi không nhập câu hỏi', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Tên*:' }).fill('Hồng Thắm');
    await page.getByRole('textbox', { name: 'Email*:' }).fill('lththam375@gmail.com');
    await page.getByRole('button', { name: 'Gửi đi' }).click();
    await expect(page.getByText('Vui lòng nhập nội dung')).toBeVisible();
  });

  // CASE 6: Kiểm tra bảo mật Captcha
  test('TC06: Chặn gửi form khi chưa xác thực Captcha', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Tên*:' }).fill('Hồng Thắm');
    await page.getByRole('textbox', { name: 'Email*:' }).fill('lththam375@gmail.com');
    await page.getByRole('textbox', { name: 'Câu Hỏi/Thắc Mắc*:' }).fill('Test captcha');
    
    await page.getByRole('button', { name: 'Gửi đi' }).click();

    await expect(page.getByText('Vui lòng xác thực Captcha')).toBeVisible();
  });
});