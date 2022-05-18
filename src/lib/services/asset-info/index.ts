import type { AssetInfo } from "./asset-service";

export type IAssetService = {
  getAssetInfo(assetId: string): Promise<AssetInfo>
}