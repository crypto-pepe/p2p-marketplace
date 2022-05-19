import type { AssetInfo } from '../assets';

export interface INodeClient {
  getAddressBalance(address: string, assetId: string): Promise<BigInt>;
  getAssetDetails(assetId: string): Promise<AssetInfo>;
}

export { WavesHttpNodeClient } from './waves-http-node-client';
