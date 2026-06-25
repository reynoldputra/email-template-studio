import { expect, test } from '@playwright/test';

test('studio shell loads heading and example template', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Email Template Studio')).toBeVisible();
  await expect(page.getByText('Welcome')).toBeVisible();
  await page.getByRole('button', { name: 'Phone' }).click();
  await expect(page.getByTitle('Template preview')).toHaveClass(/preview-phone/);
});
