import type { INodeClient } from '$lib/services/node-client';
import { readable } from 'svelte/store';
import { WavesHttpNodeClient } from 'src/lib/services/node-client/node-clients';
import { BalanceService, BalanceType } from '$lib/services/balance/balance-service';
import { AssetIds, WAVES_NODES_BASE_URL } from '../constants';

const address: string = 'address';

let state = {
  usdn: {
    walletBalance: BigInt(0)
  }
};

const wawesNodeClient: INodeClient = new WavesHttpNodeClient({
  baseUrl: WAVES_NODES_BASE_URL
});
const balanceService = new BalanceService(wawesNodeClient, address);

export const balance = readable(state, (set) => {
  const updateBalances = async () => {
    const reader = balanceService.subscribe(BalanceType.wallet, AssetIds.USDN);
    while (true) {
      const { done, value } = await reader.read();
      set({
        usdn: {
          walletBalance: value ? value : BigInt(0)
        }
      });
      if (done) {
        set({
          usdn: {
            walletBalance: BigInt(0)
          }
        });
        return;
      }
    }
  };

  updateBalances();
  return () => {};
});
