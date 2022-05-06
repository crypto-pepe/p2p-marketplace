import { CryptoAsset, FiatAsset, type Asset } from './types';

export const PRICE_ORACLE_INTERVAL_IN_MILLIS: number = 30 * 1_000;
export const PRICE_ORACLE_ASSETS: Asset[] = [
	CryptoAsset.BTC,
	CryptoAsset.ETH,
	CryptoAsset.WAVES,
	FiatAsset.EUR,
	FiatAsset.RUB
];
