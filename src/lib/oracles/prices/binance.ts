import type { Asset } from '../../types';
import type { Price, IPriceOracle } from './';

const endpoint: string = 'https://api.binance.com';
const usdAsset: Asset = 'USDT';

// BTCUSDT but USDTRUB
const assetsInverted: Partial<Record<Asset, boolean>> = {
	BTC: false,
	ETH: false,
	WAVES: false,
	EUR: false,
	GBP: false,
	RUB: true
};

type BinanceResponse = {
	lastPrice: string;
};

export class BinancePriceOracle implements IPriceOracle {
	isAvailable(asset: Asset): boolean {
		return assetsInverted[asset] !== undefined;
	}

	async fetchPrice(asset: Asset): Promise<Price> {
		if (!this.isAvailable(asset)) {
			throw new Error(`binance provider: asset isn't available ${asset}`);
		}

		const fetchRequest =
			`${endpoint}/api/v3/ticker/24hr?symbol=` +
			(assetsInverted[asset] ? `${usdAsset}${asset}` : `${asset}${usdAsset}`);

		const response = await fetch(fetchRequest);
		if (response.status != 200) {
			throw new Error(`binance provider: can't fetch price for ${asset}`);
		}

		const data: BinanceResponse = await response.json();
		const price = parseFloat(data.lastPrice);
		if (isNaN(price)) {
			throw new Error(`binance provider: can't decode price ${data.lastPrice}`);
		}

		return { asset, price, date: new Date() };
	}
}
