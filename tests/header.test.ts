import { expect, test } from '@playwright/test';

test('Test header component functionality', async ({ page }) => {
  await page.goto('/');
  const links = await page.locator('header nav a').evaluateAll(list => list.map(link => link.getAttribute('href')));
  console.log(links)
})