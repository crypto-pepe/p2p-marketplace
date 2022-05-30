<script lang="ts" context="module">
  import type { AssetInfo } from '$lib/wallet';
  import type { CryptoAsset } from '$lib/types';
  import { goto } from '$app/navigation';
  import { walletStore, type WalletState } from '$lib/stores/wallet';
  import { createBalancesStore, type BalancesStore } from '$lib/stores/token-balances';
  import { pricesStore } from '$lib/stores/prices';
  import { getAvailableChains } from '$lib/wallet/helper';
  import { onDestroy, onMount } from 'svelte';
  import { balancesFrom } from '$lib/utils/balances';
  import { AssetService } from '$lib/services/assets';
  import { WavesHttpNodeClient } from '$lib/services/node-client';
  import { ASSETS, WAVES_NODES_BASE_URL } from '$lib/constants';
  import type { Unsubscriber } from 'svelte/store';

  type AssetInfosMap = {
    [key in CryptoAsset]: AssetInfo;
  };
</script>

<script lang="ts">
  const wawesNodeClient = new WavesHttpNodeClient({ baseUrl: WAVES_NODES_BASE_URL });
  const assetsService = new AssetService(wawesNodeClient);
  let assetInfosMap: AssetInfosMap;
  let balancesState: BalancesStore;
  let balancesStore;
  let walletState: WalletState;
  let balanceUnsubscriber: Unsubscriber;
  let walletUnsubscriber: Unsubscriber;

  onMount(async () => {
    await walletStore.loadFromLocalStorage();
    walletUnsubscriber = walletStore.subscribe(async (state) => {
      walletState = state;

      if (walletState.isConnected) {
        if (balanceUnsubscriber !== undefined) {
          balanceUnsubscriber();
        }

        balancesStore = createBalancesStore(
          walletState.address,
          walletState.chainId,
          walletState.blockchain,
          walletState.type
        );

        balanceUnsubscriber = balancesStore.unsubscribe;
        balancesStore.subscribe((state) => {
          balancesState = state;
        });
        const blockchain = walletState.blockchain;
        const chainId = walletState.chainId;
        const assetSymbols = Object.keys(balancesState) as CryptoAsset[];
        const assetIds = ASSETS[blockchain][chainId];
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
          balanceUnsubscriber();
        }
      }
    });
  });

  onDestroy(() => {
    if (balanceUnsubscriber) {
      balanceUnsubscriber();
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
    Total balance:
    <br />
    <ul>
      {#if balances}
        {#each Object.entries(balances) as [assetName, assetBalances]}
          <li>
            <span>{assetName}: </span>&nbsp&nbsp
            <span>{assetBalances.walletBalance}</span>&nbsp&nbsp
            <span>${assetBalances.walletBalanceUSD}</span>&nbsp&nbsp
            <span>{assetBalances.inOrdersBalance}</span>&nbsp&nbsp
            <span>${assetBalances.inOrdersBalanceUSD}</span>&nbsp&nbsp
            <span>{assetBalances.lockInOrdersBalance}</span>&nbsp&nbsp
            <span>${assetBalances.lockInOrdersBalanceUSD}</span>&nbsp&nbsp
          </li>
        {/each}
      {/if}
    </ul>

    <hr />
  {/if}
</section>

<style>
</style>
