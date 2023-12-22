
test('test', async ({ page }) => {
  await page.goto('https://www.google.com/'); // Changed URL to correct Google page
  const btn = await page.$('input[name="btnI"]'); // Updated the button selector to match "I'm Feeling Lucky" button
  if (!btn) throw new Error("I'm Feeling Lucky button not found");
  await btn.click();
});
