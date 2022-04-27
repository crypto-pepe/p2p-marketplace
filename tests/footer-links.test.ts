import { expect, test } from '@playwright/test';
import childProcess from 'child_process';

const __GIT_COMMITHASH__ = childProcess.execSync('git rev-parse HEAD').toString().trim()

const requiredLinks = [
	`https://github.com/crypto-pepe/p2p-marketplace/tree/${__GIT_COMMITHASH__}`,
	'https://pepe.team',
	'https://crypto-pepe-team.medium.com',
	'https://twitter.com/cryptopepeteam',
	'https://t.me/pepe_team',
	'https://github.com/crypto-pepe',
];

test('Footer should contain required links', async ({ page }) => {
	await page.goto('/');
	const linkElements = await page.locator('footer a');
	const links = await linkElements.evaluateAll(list => list.map(link => link.getAttribute('href')));
	expect(links).toEqual(expect.arrayContaining(requiredLinks));
});
