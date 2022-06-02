import type { PricesMap } from '../types';
import type { AssetBalances, BalancesStore } from 'src/lib/stores/token-balances';
import type { AssetInfo } from '../wallet';
import { CryptoAsset } from '../types';

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
  amount: bigint | null;
  amountUSD: number | null;
};

export const _private = {
  calculateUsdPrice,
  getBalancesForAsset
};

function calculateUsdPrice(balance: bigint, decimals: number, price: number): number {
  const result = (price * 100 * Number(balance)) / 10 ** decimals / 100;
  return Math.floor(result) > 0 ? Math.floor(result * 100) / 100 : 0;
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
          return [balanceName, { amount: 0, amountUSD: null }];
        } else {
          return [balanceName, { amount: balance, amountUSD: null }];
        }
      } else {
        if (Number(balance) === 0) {
          return [
            balanceName,
            { amount: 0n, amountUSD: calculateUsdPrice(balance, decimals, price) }
          ];
        } else {
          return [
            balanceName,
            {
              amount: balance,
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

      if (assetName === CryptoAsset.USDT) {
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

export function calculateTotalBalance(balances: BalancesForAssets): number {
  if (balances) {
    let result = Object.values(balances).reduce((acc: number, assetBalances: Balances) => {
      let balance = Object.values(assetBalances).reduce(
        (acc: number, walletType: BalanceWithUSD) => {
          if (walletType.amountUSD) {
            return acc + walletType.amountUSD;
          }
          return acc;
        },
        0
      );
      return acc + balance;
    }, 0);

    return result;
  }
  return 0;
}
