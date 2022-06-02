<script lang="ts" context="module">
  import type { AssetInfo } from '$lib/wallet';
  import type { CryptoAsset } from '$lib/types';
  import type { Unsubscriber } from 'svelte/store';
  import type { WalletState } from '$lib/stores/wallet';
  import type { BalancesStore } from '$lib/stores/token-balances';
  import { onDestroy, onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { walletStore, loadFromLocalStorage } from '$lib/stores/wallet';
  import { createBalancesStore } from '$lib/stores/token-balances';
  import { pricesStore } from '$lib/stores/prices';
  import { getAvailableChains } from '$lib/wallet/helper';
  import { balancesFrom, calculateTotalBalanceInUsd } from '$lib/utils/balances';
  import { AssetService } from '$lib/services/assets';
  import { BLOCKCHAINS } from '$lib/constants';
  import { initNodeClient } from '$lib/services/node-client/factory';
  import { bigIntToFloatString } from '$lib/utils/strings';
  import { getAssetPrecision } from '$lib/utils/asset-precision';
  import { BalanceService } from '$lib/services/balance';

  type AssetInfosMap = {
    [key in CryptoAsset]: AssetInfo;
  };

  type AsyncUnsubscriber = () => Promise<void>
</script>

<script lang="ts">
  let assetInfosMap: AssetInfosMap;
  let balancesState: BalancesStore;
  let balancesStore;
  let walletState: WalletState;
  let balanceUnsubscriber: AsyncUnsubscriber;
  let walletUnsubscriber: Unsubscriber;

  onMount(async () => {
    await loadFromLocalStorage();
    walletUnsubscriber = walletStore.subscribe(async (state) => {
      walletState = state;
      if (walletState.isConnected) {
        let nodeClient = initNodeClient(walletState.blockchain, walletState.chainId as string);
        const balanceService = new BalanceService(nodeClient, walletState.address);
        let assetsService = new AssetService(nodeClient);

        if (balanceUnsubscriber !== undefined) {
          await balanceUnsubscriber();
        }

        balancesStore = createBalancesStore(
          walletState.chainId,
          walletState.blockchain,
          walletState.type,
          balanceService
        );

        balanceUnsubscriber = balancesStore.unsubscribe;
        balancesStore.subscribe((state) => {
          balancesState = state;
        });
        const blockchain = walletState.blockchain;
        const chainId = walletState.chainId;
        const assetSymbols = Object.keys(balancesState) as CryptoAsset[];
        const assetIds = BLOCKCHAINS[blockchain].chains[chainId].assets;
        const ps = assetSymbols.map((symbol) => {
          return assetsService.getAssetInfo(assetIds[symbol]);
        });
        const assetInfos = await Promise.all(ps);
        assetInfosMap = assetInfos.reduce((acc, cur, idx) => {
          acc[assetSymbols[idx] as CryptoAsset] = cur;
          return acc;
        }, {} as AssetInfosMap) as AssetInfosMap;
      } else {
        goto('/');
        if (balanceUnsubscriber) {
          await balanceUnsubscriber();
        }
      }
    });
  });

  onDestroy(async () => {
    if (balanceUnsubscriber) {
      await balanceUnsubscriber();
    }
    if (walletUnsubscriber) {
      walletUnsubscriber();
    }
  });

  $: availableChain = getAvailableChains($walletStore?.type)?.find(
    (chain) => chain.chainId === $walletStore.chainId
  );
  $: balances =
    $pricesStore && assetInfosMap && balancesFrom(balancesState, $pricesStore, assetInfosMap);
</script>

<svelte:head>
  <title>P2P - Account</title>
</svelte:head>

<section>
  Account
  {#if $walletStore.isConnected}
    <hr />
    Address: {$walletStore.address}
    <br />
    Blockchain: {$walletStore.blockchain}
    <br />
    Network: {availableChain?.name}
    <br />
    Wallet type: {$walletStore.type}
    <br />
    Total balance: $ {balances ? calculateTotalBalanceInUsd(balances).toFixed(2) : null}
    <br />
    <ul>
      {#if balances}
        {#each Object.entries(balances) as [assetName, assetBalances]}
          <li>
            <span>{assetName}: </span>&nbsp&nbsp
            {#each Object.values(assetBalances) as balanceAmounts}
              <span
                >{balanceAmounts.amount !== null
                  ? bigIntToFloatString(
                      balanceAmounts.amount,
                      assetInfosMap[assetName].decimals,
                      getAssetPrecision(assetName)
                    )
                  : balanceAmounts.amount}</span
              >&nbsp&nbsp
              <span>$ {balanceAmounts.amountUSD}</span>&nbsp&nbsp
            {/each}
          </li>
        {/each}
      {/if}
    </ul>

    <hr />
  {/if}
</section>

<style>
</style>
