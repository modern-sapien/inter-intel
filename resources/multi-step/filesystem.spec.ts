import path from 'path';
import fs from 'fs';
import { test } from '@playwright/test';

test('Save file in directory', async ({ page }) => {
  const image = await page.goto('https://picsum.photos/200/300');
  const imagePath = path.join('example.jpg');
  const buffer = await image.body();
  fs.writeFileSync(imagePath, buffer);
  const readFileFromDisk = fs.readFileSync(imagePath);
});
