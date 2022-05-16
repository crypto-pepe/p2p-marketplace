import type { Price, IPriceOracle } from './';
import type { Asset } from '$lib/types';
import { CryptoAsset, FiatAsset } from '$lib/types';

type BinanceResponse = {
	lastPrice: string;
};

type AssetMeta = {
	isInverted: boolean;
};

const endpoint: string = 'https://api.binance.com';
const usdAsset: Asset = CryptoAsset.USDT;

// BTCUSDT but USDTRUB
const assetsMeta: Partial<Record<Asset, AssetMeta>> = {
	[CryptoAsset.BTC]: { isInverted: false },
	[CryptoAsset.ETH]: { isInverted: false },
	[CryptoAsset.WAVES]: { isInverted: false },
	[FiatAsset.EUR]: { isInverted: false },
	[FiatAsset.RUB]: { isInverted: true }
};

export class BinancePriceOracle implements IPriceOracle {
	isAvailable(asset: Asset): boolean {
		return assetsMeta[asset] !== undefined;
	}

	async fetchPrice(asset: Asset): Promise<Price> {
		if (!this.isAvailable(asset)) {
			throw new Error(`binance provider: asset isn't available ${asset}`);
		}

		const url =
			`${endpoint}/api/v3/ticker/24hr?symbol=` +
			(assetsMeta[asset]?.isInverted ? `${usdAsset}${asset}` : `${asset}${usdAsset}`);

		const response = await fetch(url);
		if (response.status != 200) {
			throw new Error(
				`binance provider: can't fetch price for ${asset} with status ${response.status}`
			);
		}

		const data: BinanceResponse = await response.json();
		const price = parseFloat(data.lastPrice);
		if (isNaN(price)) {
			throw new Error(`binance provider: can't decode price ${data.lastPrice}`);
		}

		return {
			asset,
			price: assetsMeta[asset]?.isInverted ? 1.0 / price : price,
			timestamp: new Date()
		};
	}
}
