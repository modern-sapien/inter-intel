import path from 'path';
import fs from 'fs';
import { test } from '@playwright/test';

/*
Sometimes, you do want to explicitly save a file to disk. This is what you need to know.
Checkly creates a sandboxed directory for each check run. 
During the run you can use this directory to save or upload artifacts. 
This directory is destroyed after a check is finished.
*/

test('Save file in directory', async ({ page }) => {
  const image = await page.goto('https://picsum.photos/200/300');
  const imagePath = path.join('example.jpg');
  const buffer = await image.body();
  fs.writeFileSync(imagePath, buffer);
  const readFileFromDisk = fs.readFileSync(imagePath);
});
