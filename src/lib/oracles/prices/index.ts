import type { Asset } from '$lib/types';

export type PriceOracleType = 'binance';
export type Price = {
  asset: Asset;
  price: number;
  timestamp: Date;
};

export interface IPriceOracle {
  isAvailable(asset: Asset): boolean;
  fetchPrice(asset: Asset): Promise<Price>;
}

export const fetchPrice = async (asset: Asset, oracles: IPriceOracle[]): Promise<Price> =>
  oracles.reduce(
    (acc, oracle) =>
      acc.catch(() =>
        oracle.isAvailable(asset)
          ? oracle.fetchPrice(asset)
          : Promise.reject(new Error('empty price'))
      ),
    Promise.reject<Price>(new Error('empty price'))
  );
