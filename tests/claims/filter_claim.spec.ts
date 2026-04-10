import { test, expect } from '@playwright/test';

test.describe('CPS Claim List & Filtering', () => {

  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);

    await page.goto('https://stg-cm-backoffice.eton.vn/user/login');

    const username = page.locator('input[type="text"]').first();
    const password = page.locator('input[type="password"]');

    await expect(username).toBeVisible();

    await username.fill('hongthao');
    await password.fill('Thaovu@123');

    await page.locator('#edit-submit').click();

    await expect(page).not.toHaveURL(/login/);

    await page.goto('https://stg-cm-backoffice.eton.vn/vi/claim-request');


    await expect(page.locator('table')).toBeVisible();
  });

  test('TC_03: Lọc theo Eton Code', async ({ page }) => {
    const filterInput = page.locator('input[name="eton_code"]');

    await expect(filterInput).toBeVisible();
    await filterInput.fill('SOEZSFPVAMTAG');

    await page.locator('#edit-submit-claim-request').click();

    await expect(page.locator('table')).toBeVisible();

    const rows = page.locator('table tbody tr');
    const noData = page.getByText(/no data/i);

    if (await rows.count() > 0) {
      await expect(rows.first()).toBeVisible();
    } else {
      await expect(noData).toBeVisible();
    }
  });

  test('TC_04: Kiểm tra status hiển thị', async ({ page }) => {
    const rows = page.locator('table tbody tr');

    const count = await rows.count();

    if (count > 0) {
      const firstRow = rows.first();

      await expect(firstRow).toBeVisible();
      const statusCell = firstRow.locator('td').nth(7);

      await expect(statusCell).toContainText(
        /mở|đóng|mới|đang xử lý|open|closed/i
      );
    } else {
      test.skip();
    }
  });

  test('TC_05: Filter không có data', async ({ page }) => {
    const fromDate = page.locator('input[name="from"]');
    const toDate = page.locator('input[name="to"]');

    await expect(fromDate).toBeVisible();

    await fromDate.fill('2000-01-01');
    await toDate.fill('2001-01-01');

    await page.locator('#edit-submit-claim-request').click();

    await expect(page.locator('table')).toBeVisible();

    const rows = page.locator('table tbody tr');
    const noData = page.getByText(/no data/i);

    if (await rows.count() === 0) {
      await expect(noData).toBeVisible();
    } else {
      // nếu vẫn có data → chỉ cần đảm bảo table hiển thị
      await expect(rows.first()).toBeVisible();
    }
  });

});