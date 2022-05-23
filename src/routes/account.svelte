<script lang="ts" context="module">
	import { browser, dev } from '$app/env';
	import { goto } from '$app/navigation';
	import { walletStore } from '$lib/stores/wallet';
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
</script>

<svelte:head>
	<title>P2P - Account</title>
	<!-- <meta name="description" content="About this app" /> -->
</svelte:head>

<section>Account</section>

<style>
</style>
