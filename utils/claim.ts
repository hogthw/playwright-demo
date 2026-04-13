import { expect, Page } from '@playwright/test';

export async function openClaim(page: Page) {
  await page.waitForLoadState('networkidle');

  const menuBtn = page.locator('button:has-text("Menu"), button:has-text("Trình")');

  if (await menuBtn.isVisible().catch(() => false)) {
    await menuBtn.click();
  }

  const claimMenu = page.locator('a:has-text("Claim request")');

  await expect(claimMenu).toBeVisible({ timeout: 15000 });

  await claimMenu.scrollIntoViewIfNeeded();
  await claimMenu.click();
}