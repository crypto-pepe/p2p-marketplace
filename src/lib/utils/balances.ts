import type { CryptoAsset, PricesMap } from '../types';
import type { BalancesStore } from 'src/lib/stores/token-balances';
import type { AssetInfo } from '../wallet';
import { bigIntToFloatString } from './strings';

type AllBalances = {
  [key in CryptoAsset]: {
    walletBalance: string | null;
    walletBalanceUSD: string | null;
    inOrdersBalance: string | null;
    inOrdersBalanceUSD: string | null;
    lockInOrdersBalance: string | null;
    lockInOrdersBalanceUSD: string | null;
  };
};

function calculateUsdBalance(
  assetBalance: bigint | null,
  price: number,
  decimals: number
): string | null {
  if (assetBalance) {
    const satoshiBalance = BigInt(Number(assetBalance) * price);
    bigIntToFloatString(satoshiBalance, decimals);
  }
  return null;
}

function trasformBalanceValue(
  assetBalance: bigint | null | undefined,
  decimals: number | null,
  price: number | null = null,
  fiat: 'USD' | null = null
) {
  if (assetBalance === undefined || assetBalance === null || decimals === null) {
    return null;
  }
  if (fiat) {
    if (price === null) {
      return null;
    }
    if (Number(assetBalance) === 0) {
      return '0';
    } else {
      const result = (price * 100 * Number(assetBalance)) / 10 ** decimals;
      return Math.floor(result / 100) > 0 ? result.toFixed(2) : '0';
    }
  } else {
    if (Number(assetBalance) === 0) {
      return '0';
    } else {
      return bigIntToFloatString(assetBalance, decimals);
    }
  }
}

export function balancesFrom(
  balances: BalancesStore,
  prices: PricesMap,
  assetInfoMap: { [key in CryptoAsset]: AssetInfo }
): AllBalances {
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

      return [
        assetName,
        {
          walletBalance: trasformBalanceValue(assetBalances.walletBalance, decimals),
          walletBalanceUSD: trasformBalanceValue(
            assetBalances.walletBalance,
            decimals,
            price,
            'USD'
          ),
          inOrdersBalance: trasformBalanceValue(assetBalances.inOrdersBalance, decimals),
          inOrdersBalanceUSD: trasformBalanceValue(
            assetBalances.inOrdersBalance,
            decimals,
            price,
            'USD'
          ),
          lockInOrdersBalance: trasformBalanceValue(assetBalances.lockInOrdersBalance, decimals),
          lockInOrdersBalanceUSD: trasformBalanceValue(
            assetBalances.lockInOrdersBalance,
            decimals,
            price,
            'USD'
          )
        }
      ];
    })
  );

  return result as AllBalances;
}
