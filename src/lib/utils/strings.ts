import { CryptoAsset } from '../types';

const ZERO = '0';

export function bigIntToFloatString(
  value: BigInt,
  decimals: number,
  precision: number = 0,
  separator: string = '.'
): string {
  const valueStr = value.toString();

  if (decimals) {
    const len = valueStr.length;

    if (len > decimals) {
      if (precision > 0) {
        if (valueStr.substring(len - decimals).length >= precision) {
          return (
            valueStr.substring(0, len - decimals) +
            separator +
            valueStr.substr(len - decimals, precision)
          );
        }
        return (
          valueStr.substring(0, len - decimals) + separator + valueStr.substring(len - decimals)
        );
      }
      return valueStr.substring(0, len - decimals);
    }

    if (precision > 0) {
      if (precision > decimals - len) {
        return (
          ZERO +
          separator +
          ZERO.repeat(decimals - len) +
          valueStr.substr(0, precision - (decimals - len))
        );
      }
    }

    return ZERO;
  }

  return valueStr;
}
