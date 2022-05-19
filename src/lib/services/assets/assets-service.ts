import type { IAssetInfoService } from '.';
import type { INodeClient } from '$lib/services/node-client';

export type AssetInfo = {
  decimals: number;
  assetId: string;
  symbol: string;
};

export class AssetService implements IAssetInfoService {
  nodeClient: INodeClient;

  constructor(nodeClient: INodeClient) {
    this.nodeClient = nodeClient;
  }

  getAssetInfo(assetId: string): Promise<AssetInfo> {
    return this.nodeClient.getAssetDetails(assetId);
  }
}
