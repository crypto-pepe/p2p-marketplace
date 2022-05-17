import type { Asset } from './types';
import { CryptoAsset, FiatAsset } from './types';

export const BALANCE_SERVICE_INTERVAL_IN_MILLIS: number = 30 * 1_000;
export const PRICE_ORACLE_INTERVAL_IN_MILLIS: number = 30 * 1_000;
export const PRICE_ORACLE_ASSETS: Asset[] = [
	CryptoAsset.BTC,
	CryptoAsset.ETH,
	CryptoAsset.WAVES,
	FiatAsset.EUR,
	FiatAsset.RUB
];
