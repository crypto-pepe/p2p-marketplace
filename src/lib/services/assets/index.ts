import type { AssetInfo } from './assets-service';

export type IAssetInfoService = {
  getAssetInfo(assetId: string): Promise<AssetInfo>;
};
