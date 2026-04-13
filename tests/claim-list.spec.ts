import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { openClaim } from '../utils/claim';

test.describe('Claim List Feature', () => {

  test('TC07 - Open Claim List', async ({ page }) => {
    await login(page);
    await page.waitForLoadState('networkidle');

    await openClaim(page);

    await expect(page).toHaveURL(/claim/);
  });

  test('TC08 - Display claim list', async ({ page }) => {
    await login(page);
    await page.waitForLoadState('networkidle');

    await openClaim(page);

    await expect(page.getByRole('table')).toBeVisible();
  });

  test('TC10 - Reload page vẫn giữ data', async ({ page }) => {
    await login(page);
    await page.waitForLoadState('networkidle');

    await openClaim(page);

    await page.reload();

    await expect(page.getByRole('table')).toBeVisible();
  });

 test('TC11 - Search claim', async ({ page }) => {
  await login(page);
  await page.waitForLoadState('networkidle');

  await openClaim(page);

  const searchBox = page.locator('input[name="field_client_target_id"]');

  await expect(searchBox).toBeVisible();

  await searchBox.fill('CR2604100346');
  await page.keyboard.press('Enter');

  await expect(page.getByText('CR2604100346')).toBeVisible();
});

});