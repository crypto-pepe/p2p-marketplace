import type { Asset } from './types';
import { CryptoAsset, FiatAsset } from './types';

export enum AssetIds {
  USDN = 'DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p'
}

export const BALANCE_SERVICE_REFRESHING_INTERVAL_IN_MILLIS: number = 30 * 1_000;
export const PRICE_ORACLE_INTERVAL_IN_MILLIS: number = 30 * 1_000;
export const PRICE_ORACLE_ASSETS: Asset[] = [
  CryptoAsset.BTC,
  CryptoAsset.ETH,
  CryptoAsset.WAVES,
  FiatAsset.EUR,
  FiatAsset.RUB
];
export const WAVES_NODES_BASE_URL: string = 'https://nodes.wavesnodes.com';
