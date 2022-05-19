const ZERO = '0';

export function bigIntToFloatString(
  value: BigInt,
  decimals: number,
  separator: string = '.'
): string {
  const valueStr = value.toString();

  if (decimals) {
    const len = valueStr.length;

    if (len > decimals) {
      return valueStr.substring(0, len - decimals) + separator + valueStr.substring(len - decimals);
    }

    return ZERO + separator + ZERO.repeat(decimals - len) + valueStr;
  }

  return valueStr;
}
