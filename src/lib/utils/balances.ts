import type { CryptoAsset, PricesMap } from '../types';
import type { AssetBalances, BalancesStore } from 'src/lib/stores/token-balances';
import type { AssetInfo } from '../wallet';
import { bigIntToFloatString } from './strings';

export type BalancesForAssets = {
  [key in CryptoAsset]: Balances;
};

export type Balances = {
  [key in BalancesType]: BalanceWithUSD;
};

enum BalancesType {
  walletBalance = 'walletBalance',
  inOrdersBalance = 'inOrdersBalance',
  lockInOrdersBalance = 'lockInOrdersBalance'
}

export type BalanceWithUSD = {
  amount: string | null;
  amountUSD: string | null;
};

function calculateUsdPrice(balance: bigint, decimals: number, price: number): string {
  const result = (price * 100 * Number(balance)) / 10 ** decimals;
  return Math.floor(result / 100) > 0 ? result.toFixed(2) : '0';
}

function getBalancesForAsset(
  assetBalances: AssetBalances,
  decimals: number | null,
  price: number | null = null
): Balances {
  return Object.fromEntries(
    Object.entries(assetBalances).map(([balanceName, balance]) => {
      if (balance === undefined || balance === null || decimals === null) {
        return [balanceName, { amount: null, amountUSD: null }];
      } else if (price === null) {
        if (Number(balance) === 0) {
          return [balanceName, { amount: '0', amountUSD: null }];
        } else {
          return [balanceName, { amount: bigIntToFloatString(balance, decimals), amountUSD: null }];
        }
      } else {
        if (Number(balance) === 0) {
          return [
            balanceName,
            { amount: '0', amountUSD: calculateUsdPrice(balance, decimals, price) }
          ];
        } else {
          return [
            balanceName,
            {
              amount: bigIntToFloatString(balance, decimals),
              amountUSD: calculateUsdPrice(balance, decimals, price)
            }
          ];
        }
      }
    })
  );
}

export function balancesFrom(
  balances: BalancesStore,
  prices: PricesMap,
  assetInfoMap: { [key in CryptoAsset]: AssetInfo }
): BalancesForAssets {
  const result = Object.fromEntries(
    Object.entries(balances).map(([assetName, assetBalances]) => {
      let price = null;
      let decimals = null;

      if (assetName === 'USDT') {
        price = 1;
      } else if (prices[assetName as CryptoAsset]) {
        price = prices[assetName as CryptoAsset] ? prices[assetName as CryptoAsset]?.price : null;
      }

      if (assetInfoMap[assetName as CryptoAsset]) {
        decimals = assetInfoMap[assetName as CryptoAsset].decimals;
      }

      return [assetName, getBalancesForAsset(assetBalances, decimals, price)];
    })
  );

  return result as BalancesForAssets;
}
