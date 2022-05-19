import type { AssetInfo } from '../assets/assets-service';

export interface INodeClient {
  getAddressBalance(address: string, assetId: string): Promise<BigInt>;
  getAssetDetails(assetId: string): Promise<AssetInfo>;
}
