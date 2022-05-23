export type IAssetInfoService = {
  getAssetInfo(assetId: string): Promise<AssetInfo>;
};

export type AssetInfo = {
  decimals: number;
  assetId: string;
  symbol: string;
};

export { AssetService } from './assets-service';
