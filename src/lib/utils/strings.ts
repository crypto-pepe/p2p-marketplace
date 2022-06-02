import { CryptoAsset } from '../types';

const ZERO = '0';

export function bigIntToFloatString(
  value: BigInt,
  decimals: number,
  floatSymbols: number = 0,
  separator: string = '.'
): string {
  const valueStr = value.toString();

  if (decimals) {
    const len = valueStr.length;

    if (len > decimals) {
      if (floatSymbols > 0) {
        if (valueStr.substring(len - decimals).length >= floatSymbols) {
          return (
            valueStr.substring(0, len - decimals) +
            separator +
            valueStr.substr(len - decimals, floatSymbols)
          );
        }
        return (
          valueStr.substring(0, len - decimals) + separator + valueStr.substring(len - decimals)
        );
      }
      return valueStr.substring(0, len - decimals);
    }

    if (floatSymbols > 0) {
      if (floatSymbols > decimals - len) {
        return (
          ZERO +
          separator +
          ZERO.repeat(decimals - len) +
          valueStr.substr(0, floatSymbols - (decimals - len))
        );
      }
    }

    return ZERO;
  }

  return valueStr;
}

export function calculateFloatSimbols(assetName: keyof typeof CryptoAsset): number {
  switch (CryptoAsset[assetName]) {
    case 'WAVES':
      return 6;
    case 'USDT':
      return 2;
    case 'BTC':
      return 4;
    case 'ETH':
      return 5;
    default:
      return 6;
  }
}
