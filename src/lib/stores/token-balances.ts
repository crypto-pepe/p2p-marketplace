import type { ReadableStreamDefaultReader, ReadableStreamDefaultReadResult } from 'stream/web';
import type { WalletType } from './wallet';
import type { AssetIds, ChainId, BlockchainId } from '$lib/constants';
import type { BalanceService } from '$lib/services/balance';
import { writable } from 'svelte/store';
import { CryptoAsset } from '$lib/types';
import { BLOCKCHAINS, LOOP_TIMEOUT_IN_MILLIS } from '$lib/constants';
import { BalanceType } from '$lib/services/balance';
import { getAvailableChains } from '$lib/wallet/helper';

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
    return result;
  })
);

function getNullableBalance(
  data: PromiseSettledResult<ReadableStreamDefaultReadResult<bigint>>
): bigint | null {
  if (data.status === 'fulfilled' && typeof data.value.value === 'bigint') {
    return data.value.value;
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

function getBalancesState(balancesReaders: BalancesReaders): Promise<BalancesStore> {
  const assetIds = Object.keys(balancesReaders) as CryptoAsset[];
  const ps = Object.values(balancesReaders).map((balanceReader) => {
    return Promise.allSettled([
      balanceReader.walletReader.read(),
      balanceReader.inOrdersReader.read(),
      balanceReader.lockInOrdersReader.read()
    ]).then((result) => ({
      walletBalance: getNullableBalance(result[0]),
      inOrdersBalance: getNullableBalance(result[1]),
      lockInOrdersBalance: getNullableBalance(result[2])
    }));
  });

  return Promise.all(ps)
    .then((assetBalances) => {
      return assetIds.map((assetId, idx) => [assetId, assetBalances[idx]]);
    })
    .then((balances) => Object.fromEntries(balances));
}

async function unsubscribeSteamReaders(
  balancesReaders: BalancesReaders
): Promise<PromiseSettledResult<void>[]> {
  const promicesCancelReaders = Object.values(balancesReaders).reduce(
    (acc: Promise<void>[], readers) => [
      ...acc,
      ...Object.values(readers).map((stream: ReadableStreamDefaultReader<any>) => stream.cancel())
    ],
    []
  );
  return await Promise.allSettled(promicesCancelReaders);
}

export function createBalancesStore(
  network: ChainId<BlockchainId>,
  blockchain: BlockchainId,
  walletType: WalletType,
  balanceService: BalanceService
) {
  let balancesState: BalancesStore;
  let balancesReaders: BalancesReaders;
  let timerId: NodeJS.Timer | undefined;
  let isSubscribed: boolean = false;

  const { subscribe, set, update } = writable<BalancesStore>(initialState);
  const availableChains = getAvailableChains(walletType);
  const availableChain = availableChains.find((chain) => chain.chainId === network);
  if (availableChain) {
    const assets = BLOCKCHAINS[blockchain].chains[network].assets;
    balancesReaders = getBalancesReaders(assets, balanceService);
    isSubscribed = true;
    const loop = async () => {
      balancesState = await getBalancesState(balancesReaders);
      update((state) => (state = balancesState));
      timerId = setTimeout(() => {
        if (isSubscribed) {
          loop();
        }
      }, LOOP_TIMEOUT_IN_MILLIS);
    };
    loop();
  }

  async function unsubscribe() {
    isSubscribed = false;
    if (timerId) {
      clearTimeout(timerId);
      timerId = undefined;
    }

    await unsubscribeSteamReaders(balancesReaders);
    set(initialState);
  }

  return {
    subscribe,
    unsubscribe
  };
}
