import type { INodeClient } from '$lib/services/node-client';

export type IBalanceService = {
  nodeClient: INodeClient;
  address: string;
  subscribe(balanceType: BalanceType, assetId: string): ReadableStreamDefaultReader<bigint>;
};

export enum BalanceType {
  wallet = 'wallet',
  inOrders = 'inOrders',
  lockedInOrders = 'lockedInOrders'
}

export { BalanceService } from './balance-service';
