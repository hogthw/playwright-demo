import { test, expect, Page, BrowserContext } from '@playwright/test';
import 'dotenv/config';

/**
 * FILE: tests/day5-full-flow.spec.ts
 * FIX: Tách ID thuần số để tránh lỗi 404 tuyệt đối
 */

const BACKOFFICE_URL = 'https://stg-cm-backoffice.eton.vn/user/login';
const CLIENT_URL = 'https://stg-cm-backoffice.eton.vn/client/otp-login?destination=%2Fvi%2Fclient%2Fclaim-request';

const CLIENT_EMAIL = 'tester@vota.vn'; 
const MAIL_PASS = '123@TestingMail';

// Hàm hỗ trợ truy cập link có kiểm tra 404 và Retry
async function gotoWithRetry(page: Page, url: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    const is404 = await page.getByText(/Không tìm thấy trang/i).first().isVisible();
    
    if (!is404) {
      console.log(`✅ Truy cập thành công: ${url}`);
      return;
    }
    console.log(`🔄 [Lần ${i + 1}] Trang chưa sẵn sàng, đợi 3s rồi tải lại...`);
    await page.waitForTimeout(3000);
  }
  throw new Error(`❌ Không thể truy cập link sau ${maxRetries} lần thử: ${url}`);
}

test('DAY 5 - FULL FLOW: CHUẨN QUY TRÌNH & FIX ID SỐ', async ({ browser }) => {
  const context: BrowserContext = await browser.newContext();
  const page: Page = await context.newPage();

  // ==========================================
  // 1. CLIENT: LOGIN & TẠO CLAIM (Slide 3-10)
  // ==========================================
  await page.goto(CLIENT_URL);
  await page.getByRole('textbox', { name: /Thư điện tử/i }).fill(CLIENT_EMAIL);
  console.log('⚠️ GIẢI CAPTCHA LOGIN...');
  await page.pause();
  await page.getByRole('button', { name: /Gửi mã OTP/i }).click();

  // Lấy OTP tự động
  const mailPage = await context.newPage();
  await mailPage.goto('https://mail.vota.vn/');
  await mailPage.getByRole('textbox', { name: 'Username' }).fill(CLIENT_EMAIL);
  await mailPage.getByRole('textbox', { name: 'Password' }).fill(MAIL_PASS);
  await mailPage.getByRole('button', { name: 'Login' }).click();
  const mailItem = mailPage.getByText(/Mã xác thực/i).first();
  await expect(mailItem).toBeVisible({ timeout: 30000 });
  await mailItem.click();
  const otpMatch = (await mailPage.frameLocator('iframe[name="messagecontframe"]').locator('body').innerText()).match(/\d{6}/);
  const otp = otpMatch ? otpMatch[0] : '';
  await mailPage.close();

  await page.bringToFront();
  await page.getByRole('textbox', { name: /Mã xác thực/i }).fill(otp);
  await page.pause(); 
  await page.getByRole('button', { name: /Xác thực/i }).click();

  await page.getByText('Menu').click(); 
  await page.getByRole('link', { name: 'Tạo yêu cầu' }).click();
  
  await page.locator('input[name="title[0][value]"]').fill(`[DAY5_FINAL] ${Date.now()}`);
  await page.getByRole('textbox', { name: /Mã SO/i }).fill(`SO${Date.now()}`); 
  
  await page.pause(); // Thắm chọn KH/Kho...
  await page.getByRole('button', { name: /Lưu/i }).click(); 
  
  await page.waitForURL(/\/vi\/.*[a-z0-9]{5,}/, { timeout: 60000 });
  
  // CHIẾN THUẬT MỚI: Tách lấy ID thuần số từ URL
  const currentUrl = page.url();
  const idMatch = currentUrl.match(/\d+/g);
  const numericId = idMatch ? idMatch[idMatch.length - 1] : '';
  console.log('✅ Mã số ID hệ thống thu được: ' + numericId);

  // ==========================================
  // 2. CPS: TIẾP NHẬN & ĐIỀU PHỐI (Slide 11-17)
  // ==========================================
  await page.waitForTimeout(5000); 
  await page.context().clearCookies(); 
  
  await page.goto(BACKOFFICE_URL);
  await page.getByRole('textbox', { name: /Tên người dùng/i }).fill('hongthao'); 
  await page.getByRole('textbox', { name: /Mật khẩu/i }).fill('Thaovu@123'); 
  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  // Truy cập bằng link gốc số (numericId) để đảm bảo không bị 404
  await gotoWithRetry(page, `https://stg-cm-backoffice.eton.vn/vi/claim-request/${numericId}`);

  const btnTiepNhan = page.getByRole('button', { name: /TIẾP NHẬN/i });
  if (await btnTiepNhan.isVisible()) {
      await btnTiepNhan.click();
      await page.waitForTimeout(2000);
  }

  // CPS Phản hồi
  await page.locator('.btn-group > .btn').first().click(); 
  await page.locator('#email_submission').check(); 
  await page.getByLabel('Phòng ban xử lý').selectOption({ label: 'OPS Q7' });
  await page.locator('.cke_editable').fill('CPS phối hợp OPS Q7 kiểm tra camera đơn hàng.');
  await page.getByRole('button', { name: 'Gửi' }).click();

  // ==========================================
  // 3. KHO (OPS): PHẢN HỒI (Slide 18-22)
  // ==========================================
  await page.context().clearCookies();
  await page.goto(BACKOFFICE_URL);
  await page.getByRole('textbox', { name: /Tên người dùng/i }).fill('ha.ops'); 
  await page.getByRole('textbox', { name: /Mật khẩu/i }).fill('Havo@123'); 
  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  await gotoWithRetry(page, `https://stg-cm-backoffice.eton.vn/vi/claim-request/${numericId}`);
  await page.getByLabel('Phòng ban xử lý').selectOption({ label: 'CPS' }); 
  await page.locator('.cke_editable').fill('Kho đã check camera đơn hàng: Hàng đóng đủ.');
  await page.getByRole('button', { name: 'Gửi' }).click();

  console.log('🚀 HOÀN TẤT LUỒNG PHỐI HỢP ĐẾN KHO!');
});