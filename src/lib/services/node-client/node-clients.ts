import type { INodeClient } from "$lib/services/node-client";
import type { AssetInfo } from '$lib/services/asset-info/asset-service';

type WavesHttpNodeClientCofig = {
  baseUrl: string
}

export class WavesHttpNodeClient implements INodeClient {
  constructor(private readonly config: WavesHttpNodeClientCofig) { }

  getAddressBalance(address: string, assetId: string): Promise<bigint> {
    return fetch(`${this.config.baseUrl}/assets/balance/${address}/${assetId}`)
      .then((response) => response.json())
      .then((data) => BigInt(data.balance));
  }

  getAssetDetails(assetId: string): Promise<AssetInfo> {
    return fetch(`${this.config.baseUrl}/assets/details/${assetId}`)
      .then((response) => response.json())
      .then((data) => ({ decimals: data.decimals, assetId: data.assetId, symbol: data.name }));
  }
}