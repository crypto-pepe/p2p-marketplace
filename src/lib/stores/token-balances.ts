import type { ReadableStreamDefaultReader, ReadableStreamDefaultReadResult } from 'stream/web';
import type { INodeClient } from '$lib/services/node-client';
import type { WalletType } from './wallet';
import type { AssetIds, ChainId } from '$lib/constants';
import { writable } from 'svelte/store';
import { CryptoAsset } from '$lib/types';
import { WavesHttpNodeClient } from '$lib/services/node-client/waves-http-node-client';
import { ASSETS, WAVES_NODES_BASE_URL, LOOP_TIMEOUT_IN_MILLIS } from '$lib/constants';
import { BalanceService, BalanceType } from '$lib/services/balance';
import { Blockchain, getAvailableChains } from '$lib/wallet/helper';

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


const initialState: BalancesStore = Object.fromEntries(
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

function getBalanceValue(
  data: PromiseSettledResult<ReadableStreamDefaultReadResult<bigint>>
): bigint | null {
  if (data.status === 'fulfilled') {
    return typeof data.value.value === 'bigint' ? data.value.value : null;
  } else {
    return null;
  }
}

export function getBalancesReaders(
  assets: AssetIds,
  balanceService: BalanceService
): BalancesReaders {
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

export function getBalancesStore(balancesReaders: BalancesReaders): Promise<BalancesStore> {
  const assetIds = Object.keys(balancesReaders) as CryptoAsset[];
  const ps = Object.values(balancesReaders).map((balanceReader) => {
    return Promise.allSettled([
      balanceReader.walletReader.read(),
      balanceReader.inOrdersReader.read(),
      balanceReader.lockInOrdersReader.read()
    ]).then((result) => ({
      walletBalance: getBalanceValue(result[0]),
      inOrdersBalance: getBalanceValue(result[1]),
      lockInOrdersBalance: getBalanceValue(result[2])
    }));
  });

  return Promise.all(ps)
    .then((assetBalances) => {
      return assetIds.map((assetId, idx) => [assetId, assetBalances[idx]]);
    })
    .then((balances) => Object.fromEntries(balances));
}

function unsubscribeSteamReaders(balancesReaders: BalancesReaders) {
  Object.values(balancesReaders).forEach((readers) => {
    Object.values(readers).forEach((stream: ReadableStreamDefaultReader<any>) => {
      stream.cancel();
    });
  });
}

export function createBalancesStore(
  address: string,
  network: ChainId,
  blockchain: Blockchain,
  walletType: WalletType,
  nodeClient: INodeClient
) {
  let balancesState: BalancesStore;
  let balancesReaders: BalancesReaders;
  let timerId: NodeJS.Timer | undefined;
  let isSubscribed: boolean = false;

  const { subscribe, set, update } = writable<BalancesStore>(initialState);
  const balanceService = new BalanceService(nodeClient, address);
  const availableChains = getAvailableChains(walletType);
  const availableChain = availableChains.find((chain) => chain.chainId === network);
  if (availableChain) {
    const assets = ASSETS[blockchain][network];
    balancesReaders = getBalancesReaders(assets, balanceService);
    isSubscribed = true;
    const loop = async () => {
      balancesState = await getBalancesStore(balancesReaders);
      update((state) => (state = balancesState));
      timerId = setTimeout(() => {
        if (isSubscribed) {
          loop();
        }
      }, LOOP_TIMEOUT_IN_MILLIS);
    };
    loop();
  }

  function unsubscribe() {
    isSubscribed = false;
    if (timerId) {
      clearTimeout(timerId);
      timerId = undefined;
    }

    unsubscribeSteamReaders(balancesReaders);
    set(initialState);
  }

  return {
    subscribe,
    unsubscribe
  };
}
