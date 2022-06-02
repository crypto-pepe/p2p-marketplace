<script context="module" lang="ts">
  import { onMount } from 'svelte';
  import { loadFromLocalStorage } from '$lib/stores/wallet';
</script>

<script lang="ts">
  onMount(async () => {
    await loadFromLocalStorage();
  });
</script>

<svelte:head>
  <title>P2P - Marketplace</title>
  <!-- <meta name="description" content="Svelte demo app" /> -->
</svelte:head>

<section>Marketpalce</section>

<style>
</style>
