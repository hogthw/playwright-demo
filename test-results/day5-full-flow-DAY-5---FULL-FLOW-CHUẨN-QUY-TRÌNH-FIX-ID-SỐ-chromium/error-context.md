# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: day5-full-flow.spec.ts >> DAY 5 - FULL FLOW: CHUẨN QUY TRÌNH & FIX ID SỐ
- Location: tests\day5-full-flow.spec.ts:32:5

# Error details

```
Error: page.waitForLoadState: Target page, context or browser has been closed
```

# Test source

```ts
  1   | import { test, expect, Page, BrowserContext } from '@playwright/test';
  2   | import 'dotenv/config';
  3   | 
  4   | /**
  5   |  * FILE: tests/day5-full-flow.spec.ts
  6   |  * FIX: Tách ID thuần số để tránh lỗi 404 tuyệt đối
  7   |  */
  8   | 
  9   | const BACKOFFICE_URL = 'https://stg-cm-backoffice.eton.vn/user/login';
  10  | const CLIENT_URL = 'https://stg-cm-backoffice.eton.vn/client/otp-login?destination=%2Fvi%2Fclient%2Fclaim-request';
  11  | 
  12  | const CLIENT_EMAIL = 'tester@vota.vn'; 
  13  | const MAIL_PASS = '123@TestingMail';
  14  | 
  15  | // Hàm hỗ trợ truy cập link có kiểm tra 404 và Retry
  16  | async function gotoWithRetry(page: Page, url: string, maxRetries = 3) {
  17  |   for (let i = 0; i < maxRetries; i++) {
  18  |     await page.goto(url);
> 19  |     await page.waitForLoadState('networkidle');
      |                ^ Error: page.waitForLoadState: Target page, context or browser has been closed
  20  |     const is404 = await page.getByText(/Không tìm thấy trang/i).first().isVisible();
  21  |     
  22  |     if (!is404) {
  23  |       console.log(`✅ Truy cập thành công: ${url}`);
  24  |       return;
  25  |     }
  26  |     console.log(`🔄 [Lần ${i + 1}] Trang chưa sẵn sàng, đợi 3s rồi tải lại...`);
  27  |     await page.waitForTimeout(3000);
  28  |   }
  29  |   throw new Error(`❌ Không thể truy cập link sau ${maxRetries} lần thử: ${url}`);
  30  | }
  31  | 
  32  | test('DAY 5 - FULL FLOW: CHUẨN QUY TRÌNH & FIX ID SỐ', async ({ browser }) => {
  33  |   const context: BrowserContext = await browser.newContext();
  34  |   const page: Page = await context.newPage();
  35  | 
  36  |   // ==========================================
  37  |   // 1. CLIENT: LOGIN & TẠO CLAIM (Slide 3-10)
  38  |   // ==========================================
  39  |   await page.goto(CLIENT_URL);
  40  |   await page.getByRole('textbox', { name: /Thư điện tử/i }).fill(CLIENT_EMAIL);
  41  |   console.log('⚠️ GIẢI CAPTCHA LOGIN...');
  42  |   await page.pause();
  43  |   await page.getByRole('button', { name: /Gửi mã OTP/i }).click();
  44  | 
  45  |   // Lấy OTP tự động
  46  |   const mailPage = await context.newPage();
  47  |   await mailPage.goto('https://mail.vota.vn/');
  48  |   await mailPage.getByRole('textbox', { name: 'Username' }).fill(CLIENT_EMAIL);
  49  |   await mailPage.getByRole('textbox', { name: 'Password' }).fill(MAIL_PASS);
  50  |   await mailPage.getByRole('button', { name: 'Login' }).click();
  51  |   const mailItem = mailPage.getByText(/Mã xác thực/i).first();
  52  |   await expect(mailItem).toBeVisible({ timeout: 30000 });
  53  |   await mailItem.click();
  54  |   const otpMatch = (await mailPage.frameLocator('iframe[name="messagecontframe"]').locator('body').innerText()).match(/\d{6}/);
  55  |   const otp = otpMatch ? otpMatch[0] : '';
  56  |   await mailPage.close();
  57  | 
  58  |   await page.bringToFront();
  59  |   await page.getByRole('textbox', { name: /Mã xác thực/i }).fill(otp);
  60  |   await page.pause(); 
  61  |   await page.getByRole('button', { name: /Xác thực/i }).click();
  62  | 
  63  |   await page.getByText('Menu').click(); 
  64  |   await page.getByRole('link', { name: 'Tạo yêu cầu' }).click();
  65  |   
  66  |   await page.locator('input[name="title[0][value]"]').fill(`[DAY5_FINAL] ${Date.now()}`);
  67  |   await page.getByRole('textbox', { name: /Mã SO/i }).fill(`SO${Date.now()}`); 
  68  |   
  69  |   await page.pause(); // Thắm chọn KH/Kho...
  70  |   await page.getByRole('button', { name: /Lưu/i }).click(); 
  71  |   
  72  |   await page.waitForURL(/\/vi\/.*[a-z0-9]{5,}/, { timeout: 60000 });
  73  |   
  74  |   // CHIẾN THUẬT MỚI: Tách lấy ID thuần số từ URL
  75  |   const currentUrl = page.url();
  76  |   const idMatch = currentUrl.match(/\d+/g);
  77  |   const numericId = idMatch ? idMatch[idMatch.length - 1] : '';
  78  |   console.log('✅ Mã số ID hệ thống thu được: ' + numericId);
  79  | 
  80  |   // ==========================================
  81  |   // 2. CPS: TIẾP NHẬN & ĐIỀU PHỐI (Slide 11-17)
  82  |   // ==========================================
  83  |   await page.waitForTimeout(5000); 
  84  |   await page.context().clearCookies(); 
  85  |   
  86  |   await page.goto(BACKOFFICE_URL);
  87  |   await page.getByRole('textbox', { name: /Tên người dùng/i }).fill('hongthao'); 
  88  |   await page.getByRole('textbox', { name: /Mật khẩu/i }).fill('Thaovu@123'); 
  89  |   await page.getByRole('button', { name: 'Đăng nhập' }).click();
  90  | 
  91  |   // Truy cập bằng link gốc số (numericId) để đảm bảo không bị 404
  92  |   await gotoWithRetry(page, `https://stg-cm-backoffice.eton.vn/vi/claim-request/${numericId}`);
  93  | 
  94  |   const btnTiepNhan = page.getByRole('button', { name: /TIẾP NHẬN/i });
  95  |   if (await btnTiepNhan.isVisible()) {
  96  |       await btnTiepNhan.click();
  97  |       await page.waitForTimeout(2000);
  98  |   }
  99  | 
  100 |   // CPS Phản hồi
  101 |   await page.locator('.btn-group > .btn').first().click(); 
  102 |   await page.locator('#email_submission').check(); 
  103 |   await page.getByLabel('Phòng ban xử lý').selectOption({ label: 'OPS Q7' });
  104 |   await page.locator('.cke_editable').fill('CPS phối hợp OPS Q7 kiểm tra camera đơn hàng.');
  105 |   await page.getByRole('button', { name: 'Gửi' }).click();
  106 | 
  107 |   // ==========================================
  108 |   // 3. KHO (OPS): PHẢN HỒI (Slide 18-22)
  109 |   // ==========================================
  110 |   await page.context().clearCookies();
  111 |   await page.goto(BACKOFFICE_URL);
  112 |   await page.getByRole('textbox', { name: /Tên người dùng/i }).fill('ha.ops'); 
  113 |   await page.getByRole('textbox', { name: /Mật khẩu/i }).fill('Havo@123'); 
  114 |   await page.getByRole('button', { name: 'Đăng nhập' }).click();
  115 | 
  116 |   await gotoWithRetry(page, `https://stg-cm-backoffice.eton.vn/vi/claim-request/${numericId}`);
  117 |   await page.getByLabel('Phòng ban xử lý').selectOption({ label: 'CPS' }); 
  118 |   await page.locator('.cke_editable').fill('Kho đã check camera đơn hàng: Hàng đóng đủ.');
  119 |   await page.getByRole('button', { name: 'Gửi' }).click();
```