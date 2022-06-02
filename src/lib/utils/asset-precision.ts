import { CryptoAsset } from '$lib/types';

export function getAssetPrecision(assetName: CryptoAsset): number {
  switch (assetName) {
    case CryptoAsset.WAVES:
      return 6;
    case CryptoAsset.USDT:
      return 2;
    case CryptoAsset.BTC:
      return 4;
    case CryptoAsset.ETH:
      return 5;
    default:
      throw new Error('This asset is undefined');
  }
}
