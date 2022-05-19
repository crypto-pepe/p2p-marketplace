import type { INodeClient } from '$lib/services/node-client';
import type { BalanceType } from './balance-service';

export type IBalanceService = {
  nodeClient: INodeClient;
  address: string;
  subscribe(balanceType: BalanceType, assetId: string): ReadableStreamDefaultReader<bigint>;
};
