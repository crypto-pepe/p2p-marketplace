import { expect, test } from '@playwright/test';

test('Test header component functionality', async ({ page }) => {
  await page.goto('/');
  const links = await page.locator('header nav a').evaluateAll(list => list.map(link => link.getAttribute('href')));

  const title = await page.locator('head title').textContent();
  console.log(title);
  console.log(links);
})