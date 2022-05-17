import type { INodeClient } from 'src/lib/services/balance';
import { readable } from 'svelte/store';
import { WavesHttpNodeClient } from '$lib/services/balance/node-clients';
import { BalanceService, BalanceType } from '$lib/services/balance/balance-service';

const address: string = 'address';

enum AssetIds {
  USDN = "DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p"
}

let state = {
  usdn: {
    walletBalance: BigInt(0)
  }
}

const wawesNodeClient: INodeClient = new WavesHttpNodeClient({
  baseUrl: 'https://nodes.wavesnodes.com'
});
const balanceService = new BalanceService(wawesNodeClient, address);

export const balance = readable(state, (set) => {
  const updateBalances = async () => {
    const reader = balanceService.subscribe(BalanceType.wallet, AssetIds.USDN);
    while (true) {
      const { done, value } = await reader.read();
      console.log(value);
      set({
        usdn: {
          walletBalance: value ? value : BigInt(0)
        }
      })
      if (done) {
        set({
          usdn: {
            walletBalance: BigInt(0)
          }
        })
        return
      }
    }
  };

  updateBalances();
  return () => { };
})