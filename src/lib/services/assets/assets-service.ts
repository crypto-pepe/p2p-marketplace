import type { AssetInfo, IAssetInfoService } from '.';
import type { INodeClient } from '$lib/services/node-client';

export class AssetService implements IAssetInfoService {
  nodeClient: INodeClient;

  constructor(nodeClient: INodeClient) {
    this.nodeClient = nodeClient;
  }

  getAssetInfo(assetId: string): Promise<AssetInfo> {
    return this.nodeClient.getAssetDetails(assetId);
  }
}
