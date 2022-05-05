import fetchMock from 'jest-fetch-mock';
import { BinancePriceOracle } from '../../../../src/lib/oracles/prices/binance';
import type { Asset } from '../../../../src/lib/types';

const expectedPrices: [Asset, boolean][] = [
	['BTC', true],
	['ETH', true],
	['WAVES', true],
	['EUR', true],
	['GBP', true],
	['RUB', true]
];

beforeEach(() => {
	fetchMock.resetMocks();
});

describe('binance price oracle', () => {
	const oracle = new BinancePriceOracle();

	test('should validate available prices', () => {
		expectedPrices.map(([asset, expectedAvailable]) => {
			const available = oracle.isAvailable(asset);
			expect([asset, available]).toEqual([asset, expectedAvailable]);
		});
	});

	it('should successufull fetch price', async () => {
		const startTime = new Date().getTime();
		fetchMock.mockResponseOnce(JSON.stringify({ lastPrice: '38918.11000000' }));
		const data = await oracle.fetchPrice('BTC');

		expect(data.asset).toEqual('BTC');
		expect(data.price).toEqual(38918.11);
		expect(data.date.getTime()).toBeGreaterThanOrEqual(startTime);
		expect(data.date.getTime()).toBeLessThanOrEqual(new Date().getTime());
	});

	it('should fail fetch unavailable price', async () => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				code: -1121,
				msg: 'Invalid symbol.'
			}),
			{ status: 400 }
		);
		await expect(oracle.fetchPrice('BTC')).rejects.toThrow(
			"binance provider: can't fetch price for BTC"
		);
	});

	it('should fail fetch incorrect price', async () => {
		fetchMock.mockResponseOnce(JSON.stringify({ lastPrice: 'BADVALUE' }));
		await expect(oracle.fetchPrice('BTC')).rejects.toThrow(
			"binance provider: can't decode price BADVALUE"
		);
	});
});
