import { expect, test } from '@playwright/test';

const pages = ["pepe 2 pepe", "Account", "Exchanges", "Stats"]
const requiredLinks = ["/", "/account", "/exchangex", "/stats", "https://pepe-team.tawk.help/"]

test('Test header component functionality', async ({ page }) => {
  await page.goto('/');
  const links = await page.locator('header nav a').evaluateAll(list => list.map(link => link.getAttribute('href')));

  await page.goto('/account');

  console.log(await page.url());

  const titleElement = await page.locator('head title');
  const title = await titleElement.textContent();

  console.log(title);

  // console.log(links);
})