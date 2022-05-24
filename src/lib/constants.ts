import type { Asset } from './types';
import { CryptoAsset, FiatAsset } from './types';
import type { Blockchain } from './wallet/helper';

export enum ChainId {
  T = 'T',
  W = 'W'
}

export type Assets = {
  [key in Blockchain]: {
    [key in ChainId]: AssetIds;
  };
};

export type AssetIds = {
  [key in CryptoAsset]: string;
};

export const WAVES_NODES_BASE_URL: string = 'https://nodes.wavesnodes.com';
export const BALANCE_SERVICE_REFRESHING_INTERVAL_IN_MILLIS: number = 5 * 1_000;
export const PRICE_ORACLE_INTERVAL_IN_MILLIS: number = 30 * 1_000;
export const PRICE_ORACLE_ASSETS: Asset[] = [
  CryptoAsset.BTC,
  CryptoAsset.ETH,
  CryptoAsset.WAVES,
  FiatAsset.EUR,
  FiatAsset.RUB
];
export const ASSETS: Assets = {
  waves: {
    T: {
      WAVES: 'c',
      USDT: 'a',
      BTC: 'b',
      ETH: 'd'
    },
    W: {
      WAVES: 'WAVES',
      USDT: '34N9YcEETLWn93qYQ64EsP1x89tSruJU44RrEMSXXEPJ',
      BTC: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
      ETH: '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu'
    }
  }
};
