<script context="module" lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { wallet } from '$lib/stores/wallet';
</script>

<script lang="ts">
	onMount(() => {
		if (!$wallet.isConnected) {
			goto('/');
		}
	});
</script>

<svelte:head>
	<title>P2P - Exchanges</title>
	<!-- <meta name="description" content="Svelte demo app" /> -->
</svelte:head>

<section>Exchanges</section>

<style>
</style>
