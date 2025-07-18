import { expect, test } from '@playwright/test';

test.describe('I18n', () => {
  test.describe('Language Switching', () => {
    test('should switch language from Vietnamese to English using dropdown and verify text on the homepage', async ({ page }) => {
      await page.goto('/');

      await expect(
        page.getByRole('heading', { name: 'HuLib | Trang chủ' }),
      ).toBeVisible();

      await page.getByLabel('lang-switcher').selectOption('en');

      await expect(
        page.getByRole('heading', { name: 'HuLib | Landing Page' }),
      ).toBeVisible();
    });
  });
});
