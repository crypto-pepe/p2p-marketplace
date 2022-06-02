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

function calculateUsdPrice(balance: bigint, decimals: number, usdPrice: number): number {
  const result = (usdPrice * 100 * Number(balance)) / 10 ** decimals / 100;
  return Math.floor(result) > 0 ? Math.floor(result * 100) / 100 : 0;
}

function getBalancesForAsset(
  assetBalances: AssetBalances,
  decimals: number | null,
  usdPrice: number | null = null
): Balances {
  return Object.fromEntries(
    Object.entries(assetBalances).map(([balanceType, balance]) => {
      if (balance === undefined || balance === null || decimals === null) {
        return [balanceType, { amount: null, amountUSD: null }];
      } else if (usdPrice === null) {
        if (Number(balance) === 0) {
          return [balanceType, { amount: 0, amountUSD: null }];
        } else {
          return [balanceType, { amount: balance, amountUSD: null }];
        }
      } else {
        if (Number(balance) === 0) {
          return [
            balanceType,
            { amount: 0n, amountUSD: calculateUsdPrice(balance, decimals, usdPrice) }
          ];
        } else {
          return [
            balanceType,
            {
              amount: balance,
              amountUSD: calculateUsdPrice(balance, decimals, usdPrice)
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

export function calculateTotalBalanceInUsd(balances: BalancesForAssets): number {
  let result = Object.values(balances).reduce((acc: number, assetBalances: Balances) => {
    let balance = Object.values(assetBalances).reduce((acc: number, walletType: BalanceWithUSD) => {
      if (walletType.amountUSD) {
        return acc + walletType.amountUSD;
      }
      return acc;
    }, 0);
    return acc + balance;
  }, 0);

  return result;
}
