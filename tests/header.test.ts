import { expect, test } from '@playwright/test';

const requiredLinks = ["/", "/account", "/exchanges", "/stats", "https://pepe-team.tawk.help/"]

test('Header should contain required links', async ({ page }) => {
  await page.goto('/');
  const linkElements = await page.locator('header nav a');
  const links = await linkElements.evaluateAll(list => list.map(link => link.getAttribute('href')));
  expect(links).toEqual(expect.arrayContaining(requiredLinks));
});

test('Nav should route to main page', async ({ page }) => {
  await page.goto('/');
  expect(await page.title()).toEqual('pepe 2 pepe');
})

test('Nav should route to account page', async ({ page }) => {
  await page.goto('/account');
  expect(await page.title()).toEqual('Account');
})

test('Nav should route to exchanges page', async ({ page }) => {
  await page.goto('/exchanges');
  expect(await page.title()).toEqual('Exchanges');
})

test('Nav should route to stats page', async ({ page }) => {
  await page.goto('/stats');
  expect(await page.title()).toEqual('Stats');
})

test('Nav should route to FAQ page', async ({ page }) => {
  await page.goto('/');
  await page.goto('https://pepe-team.tawk.help/');
  expect(await page.title()).toEqual('PepeTeam Help Center');
})