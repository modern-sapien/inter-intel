import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.correcturl.com'); // Update to correct URL
  
  const title = await page.title();
  expect(title).toBe('Expected Page Title'); // Validate page title

  const element = await page.$('correct-selector'); // Update selector
  if (!element) throw new Error('Element missing');
  
  expect(await element.textContent()).toBe('Expected text'); // Validate element text
});
