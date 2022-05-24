<script lang="ts" context="module">
  import { browser, dev } from '$app/env';
  import { goto } from '$app/navigation';
  import { walletStore } from '$lib/stores/wallet';
  import { balancesStore } from '$lib/stores/balance';
  import { pricesStore } from '$lib/stores/prices';
  import { getAvailableChains } from '$lib/wallet/helper';
  import { onMount } from 'svelte';

  // we don't need any JS on this page, though we'll load
  // it in dev so that we get hot module replacement...
  export const hydrate = dev;

  export const router = browser;
</script>

<script lang="ts">
  onMount(() => {
    if (!$walletStore.isConnected) {
      goto('/');
    }
  });

  $: availableChain = getAvailableChains($walletStore?.type)?.find(
    (chain) => chain.chainId === $walletStore.chainId
  );

  $: balances = $balancesStore;
  $: assetNames = $balancesStore && Object.keys($balancesStore);
</script>

<svelte:head>
  <title>P2P - Account</title>
  <!-- <meta name="description" content="About this app" /> -->
</svelte:head>

<section>
  Account
  {#if $walletStore.isConnected}
    <hr />
    Address: {$walletStore.address}
    <br />
    Blockchain: {availableChain?.blockchain?.toUpperCase()}
    <br />
    Network: {availableChain?.name}
    <br />
    Wallet type: {$walletStore.type}
    <br />
    Total balance:
    <br />
    <ul>
      {#if assetNames}
        {#each assetNames as assetName}
          <li>
            <span>{assetName}: </span>&nbsp&nbsp
            <span>{balances[assetName].walletBalance}</span>&nbsp&nbsp
            <span>{balances[assetName].inOrdersBalance}</span>&nbsp&nbsp
            <span>{balances[assetName].lockInOrdersBalance}</span>&nbsp&nbsp
          </li>
        {/each}
      {/if}
    </ul>
  {/if}
  <hr />
</section>

<style>
</style>
