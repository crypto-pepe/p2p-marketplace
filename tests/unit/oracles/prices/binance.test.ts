import fetchMock from 'jest-fetch-mock';
import { BinancePriceOracle } from 'src/lib/oracles/prices/binance';
import { type Asset, CryptoAsset, FiatAsset } from 'src/lib/types';

const expectedPrices: [Asset, boolean][] = [
	[CryptoAsset.BTC, true],
	[CryptoAsset.ETH, true],
	[CryptoAsset.WAVES, true],
	[FiatAsset.EUR, true],
	[FiatAsset.GPB, false],
	[FiatAsset.RUB, true]
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

	it('should successfully fetch price', async () => {
		const startTime = new Date().getTime();
		fetchMock.mockResponseOnce(JSON.stringify({ lastPrice: '38918.11000000' }));
		const data = await oracle.fetchPrice(CryptoAsset.BTC);

		expect(data.asset).toEqual(CryptoAsset.BTC);
		expect(data.price).toEqual(38918.11);
		expect(data.timestamp.getTime()).toBeGreaterThanOrEqual(startTime);
		expect(data.timestamp.getTime()).toBeLessThanOrEqual(new Date().getTime());
	});

	it('should successufull fetch inverted price', async () => {
		const startTime = new Date().getTime();
		fetchMock.mockResponseOnce(JSON.stringify({ lastPrice: '2' }));
		const data = await oracle.fetchPrice(FiatAsset.RUB);

		expect(data.asset).toEqual(FiatAsset.RUB);
		expect(data.price).toEqual(0.5);
		expect(data.timestamp.getTime()).toBeGreaterThanOrEqual(startTime);
		expect(data.timestamp.getTime()).toBeLessThanOrEqual(new Date().getTime());
	});

	it('should fail while fetching unavailable price', async () => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				code: -1121,
				msg: 'Invalid symbol.'
			}),
			{ status: 400 }
		);
		await expect(oracle.fetchPrice(CryptoAsset.BTC)).rejects.toThrow(
			"binance provider: can't fetch price for BTC with status 400"
		);
	});

	it('should fail fetch incorrect price', async () => {
		fetchMock.mockResponseOnce(JSON.stringify({ lastPrice: 'BADVALUE' }));
		await expect(oracle.fetchPrice(CryptoAsset.BTC)).rejects.toThrow(
			"binance provider: can't decode price BADVALUE"
		);
	});
});
