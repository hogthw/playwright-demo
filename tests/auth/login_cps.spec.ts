import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { testData } from '../../utils/test-data';

test.describe('Login CPS - TDD', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Login success', async ({ page }) => {
    await loginPage.login(
      testData.valid.email,
      testData.valid.password
    );

    await expect(page).not.toHaveURL(/login/);
  });

  test('Invalid password', async () => {
    await loginPage.login(
      testData.invalid.email,
      testData.invalid.password
    );

    await expect(loginPage.errorMessage()).toBeVisible();
  });
});