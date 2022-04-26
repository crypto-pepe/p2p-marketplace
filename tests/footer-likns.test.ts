import { expect, test } from '@playwright/test';
import childProcess from 'child_process';

const __GIT_COMMITHASH__ = childProcess.execSync('git rev-parse HEAD').toString().trim()

const requiredLinks = [
	"https://pepe.team",
	"https://t.me/pepe_team",
	"https://github.com/crypto-pepe",
	"https://twitter.com/cryptopepeteam",
	"https://crypto-pepe-team.medium.com",
	"#",
	`https://github.com/crypto-pepe/p2p-marketplace/tree/${__GIT_COMMITHASH__}`,
]


test.describe("validate footer links", async () => {
	async function getLinksArray(page) {
		await page.goto('/');
		const links = []
		const footerLinks = await page.locator('footer a');
		const count = await footerLinks.count();
		for (let i = 0; i < count; ++i) {
			links.push(await footerLinks.nth(i).getAttribute('href'));
		}

		return links
	}

	test("numbers of links", async ({ page }) => {
		const links = await getLinksArray(page)
		expect(requiredLinks.length === links.length).toBe(true)
	})

	test("links is equal", async ({ page }) => {
		const links = await getLinksArray(page)

		requiredLinks.forEach((requiredLink) => {
			expect(links.includes(requiredLink)).toBe(true)
		});
	})
})