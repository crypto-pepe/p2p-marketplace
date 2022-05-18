import type { IAssetService } from ".";
import type { INodeClient } from "$lib/services/node-client";

export type AssetInfo = {
  decimals: number;
  assetId: string;
  symbol: string;
}

export class AssetService implements IAssetService {
  nodeClient: INodeClient

  constructor(nodeClient: INodeClient) {
    this.nodeClient = nodeClient
  }

  getAssetInfo(assetId: string): Promise<AssetInfo> {
    return this.nodeClient.getAssetDetails(assetId)
  }
}