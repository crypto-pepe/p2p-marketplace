import type { AssetInfo } from "./asset-service";
import type { BalanceType } from "./balance-service";

export interface INodeClient {
  getAddressBalance(address: string, assetId: string): Promise<BigInt>;
  getAssetDetails(assetId: string): Promise<AssetInfo>
}

export type IBalanceService = {
  nodeClient: INodeClient;
  address: string;
  subscribe(balanceType: BalanceType, assetId: string): ReadableStreamDefaultReader<bigint>;
};

export type IAssetService = {
  getAssetInfo(assetId: string): Promise<AssetInfo>
}
