import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.google.com/');
  const btn = await page.$('input[name="btnI"]');
  if (!btn) throw new Error("I'm Feeling Lucky button not found");
  await btn.click();
});
