import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.googlezzzzz.com/');
  const btn = await page.$('input[name="asdfasdf"]');
  if (!btn) throw new Error("I'm Feeling Lucky button not found");
  await btn.click();
});
