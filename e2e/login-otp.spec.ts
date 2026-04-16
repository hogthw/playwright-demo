import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { getOTP } from "../utils/otpHelper";
import "dotenv/config";

test("RPA Login OTP flow", async ({ page }) => {

  const loginPage = new LoginPage(page);

  // 1. mở trang
  await loginPage.goto(process.env.BASE_URL!);

  // 2. gửi OTP
  await loginPage.sendOTP(process.env.EMAIL!);

  // 3. lấy OTP (mock)
  const otp = await getOTP();

  // 4. login
  await loginPage.login(otp);

  // 5. verify vào hệ thống
  await expect(page).toHaveURL(/dashboard|home/);

  // 6. verify slide 3–5
  await expect(page.locator(".slide-3")).toBeVisible();
  await expect(page.locator(".slide-4")).toBeVisible();
  await expect(page.locator(".slide-5")).toBeVisible();
});