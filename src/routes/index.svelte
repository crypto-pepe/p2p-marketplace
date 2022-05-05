<script context="module" lang="ts">
	export const prerender = true;

	// @todo remove this
	import { prices } from '../stores/prices';
</script>

<svelte:head>
	<title>P2P - Marketplace</title>
	<!-- <meta name="description" content="Svelte demo app" /> -->
</svelte:head>


<section>
	{JSON.stringify($prices)}
	<hr />
	Marketpalce
</section>

<style>
</style>
