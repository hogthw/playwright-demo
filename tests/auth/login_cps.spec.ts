import { test, expect } from '@playwright/test';

test.describe('CPS Login Functionality', () => {

    test.beforeEach(async ({ page }) => {
        // Truy cập link đăng nhập nội bộ [cite: 176]
        await page.goto('https://stg-cm-backoffice.eton.vn/user/login');
    });

    test('TC_01: Login CPS thành công với tài khoản định danh', async ({ page }) => {
        // Điền Username và Password [cite: 177, 189]
        await page.locator('input[name="name"]').fill('hongthao'); 
        await page.locator('input[name="pass"]').fill('Thaovu@123');
        
        // Nhấn nút Đăng nhập [cite: 178, 192]
        await page.click('input#edit-submit');

        // KIỂM TRA (Assertion): URL chuyển hướng và tên user hiển thị [cite: 200, 204]
        await expect(page).toHaveURL(/.*claim-request/, { timeout: 10000 });
        await expect(page.locator('body')).toContainText('hongthao');

        await page.screenshot({ path: 'outputs/login_success.png' });
    });

    test('TC_02: Login CPS thất bại khi nhập sai mật khẩu', async ({ page }) => {
        await page.locator('input[name="name"]').fill('hongthao');
        await page.locator('input[name="pass"]').fill('WrongPass123');
        await page.click('input#edit-submit');

        // Kiểm tra xuất hiện thông báo lỗi của hệ thống
        const errorAlert = page.locator('.alert-danger');
        await expect(errorAlert).toBeVisible();
        
        await page.screenshot({ path: 'outputs/login_fail.png' });
    });
});