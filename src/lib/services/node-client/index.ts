import type { AssetInfo } from "../asset-info/asset-service";

export interface INodeClient {
  getAddressBalance(address: string, assetId: string): Promise<BigInt>;
  getAssetDetails(assetId: string): Promise<AssetInfo>
}