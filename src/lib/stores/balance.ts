import type { ReadableStreamDefaultReader, ReadableStreamDefaultReadResult } from 'stream/web';
import { CryptoAsset } from '../types';
import type { INodeClient } from '$lib/services/node-client';
import type { Readable } from 'svelte/store';
import type { AssetIds, ChainId } from '../constants';
import type { Blockchain, ChainInfo } from '../wallet/helper';
import { derived } from 'svelte/store';
import { WavesHttpNodeClient } from '$lib/services/node-client/waves-http-node-client';
import { BalanceService, BalanceType } from '$lib/services/balance';
import { ASSETS, WAVES_NODES_BASE_URL } from '../constants';
import { walletStore } from './wallet';
import { getAvailableChains } from '../wallet/helper';

export type BalancesStore = {
  [key in CryptoAsset]: AssetBalances;
};

export type AssetBalances = {
  walletBalance: bigint | null;
  inOrdersBalance: bigint | null;
  lockInOrdersBalance: bigint | null;
};

export type BalanceReaders = {
  walletReader: ReadableStreamDefaultReader<bigint>;
  inOrdersReader: ReadableStreamDefaultReader<bigint>;
  lockInOrdersReader: ReadableStreamDefaultReader<bigint>;
};

export type BalancesReaders = {
  [key in CryptoAsset]: BalanceReaders;
};

const wawesNodeClient: INodeClient = new WavesHttpNodeClient({
  baseUrl: WAVES_NODES_BASE_URL
});

let state: BalancesStore = Object.fromEntries(
  Object.keys(CryptoAsset).map((assetName) => {
    const result = [
      assetName,
      {
        walletReader: null,
        inOrdersReader: null,
        lockInOrdersReader: null
      }
    ];
    return result as CryptoAsset[];
  })
);

function isFulfuiled(
  data: PromiseSettledResult<ReadableStreamDefaultReadResult<bigint>>
): bigint | null {
  if (data.status === 'fulfilled') {
    return typeof data.value.value === 'bigint' ? data.value.value : null;
  } else {
    return null;
  }
}

function getBalancesReaders(assets: AssetIds, balanceService: BalanceService): BalancesReaders {
  const result = Object.fromEntries(
    Object.entries(assets).map(([assetName, assetId]) => {
      return [
        assetName,
        {
          walletReader: balanceService.subscribe(BalanceType.wallet, assetId),
          inOrdersReader: balanceService.subscribe(BalanceType.inOrders, assetId),
          lockInOrdersReader: balanceService.subscribe(BalanceType.lockedInOrders, assetId)
        }
      ];
    })
  );
  return result as BalancesReaders;
}

function getBalancesStore(balancesReaders: BalancesReaders): Promise<BalancesStore> {
  const assetIds = Object.keys(balancesReaders) as CryptoAsset[];
  const ps = Object.values(balancesReaders).map((balanceReader) => {
    return Promise.allSettled([
      balanceReader.walletReader.read(),
      balanceReader.inOrdersReader.read(),
      balanceReader.lockInOrdersReader.read()
    ]).then((result) => ({
      walletBalance: isFulfuiled(result[0]),
      inOrdersBalance: isFulfuiled(result[1]),
      lockInOrdersBalance: isFulfuiled(result[2])
    }));
  });

  return Promise.all(ps)
    .then((assetBalances) => {
      return assetIds.map((assetId, idx) => [assetId, assetBalances[idx]]);
    })
    .then((balances) => Object.fromEntries(balances));
}

function unsubscribe(balancesReaders: BalancesReaders) {
  Object.values(balancesReaders).forEach((readers) => {
    Object.values(readers).forEach((stream: ReadableStreamDefaultReader<any>) => {
      stream.cancel();
    });
  });
}

export const balancesStore: Readable<BalancesStore> = derived(walletStore, ($walletStore, set) => {
  let balancesReaders: BalancesReaders;
  set(state);

  if ($walletStore.isConnected) {
    const address = $walletStore.address;
    const network = $walletStore.chainId;
    const balanceService = new BalanceService(wawesNodeClient, $walletStore.address);
    const availableChains = getAvailableChains($walletStore.type);
    const availableChain = availableChains.find((chain) => chain.chainId === $walletStore.chainId);
    if (availableChain) {
      const blockchain = availableChain.blockchain;
      const chainId = availableChain.chainId as ChainId;
      const assets = ASSETS[blockchain][chainId];
      balancesReaders = getBalancesReaders(assets, balanceService);
      const loop = async () => {
        let timmerId: NodeJS.Timer;
        state = await getBalancesStore(balancesReaders);
        set(state);
        timmerId = setTimeout(() => {
          if (
            !$walletStore.isConnected ||
            $walletStore.address !== address ||
            $walletStore.chainId !== network
          ) {
            clearTimeout(timmerId);
            unsubscribe(balancesReaders);
            return;
          }
          loop();
        }, 1000);
      };
      loop();
    }
  }

  return () => {
    if (balancesReaders) {
      unsubscribe(balancesReaders);
    }
  };
});
