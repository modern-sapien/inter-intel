import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.googlez.com/');
  await page.getByRole('button', { name: 'I\'m Feeling Lucky' }).click();
});