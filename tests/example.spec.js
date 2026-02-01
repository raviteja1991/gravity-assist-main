const { test, expect } = require('@playwright/test');

test('Settings modal and sound toggle', async ({ page }) => {
  await page.goto('/');
  await page.click('#settings-btn');
  await expect(page.locator('.settings-content')).toBeVisible();
  const sound = page.locator('#sound-toggle');
  await sound.click();
  // check localStorage persisted
  const val = await page.evaluate(() => localStorage.getItem('gravity-sounds-enabled'));
  expect(val).toBe('true');
  await page.keyboard.press('Escape');
  await expect(page.locator('.settings-content')).toBeHidden();
});

test('Help/onboarding modal opens and closes', async ({ page }) => {
  await page.goto('/');
  await page.click('#help-btn');
  await expect(page.locator('#help-modal .modal-content')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#help-modal .modal-content')).toBeHidden();
});