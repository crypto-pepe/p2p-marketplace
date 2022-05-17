<script lang="ts" context="module">
	import Footer from '$lib/footer/Footer.svelte';
	import Header from '$lib/header/Header.svelte';
	import { balance } from '../stores/balance';
	import '../app.css';
</script>

<Header />

<main>
	<slot />

	<hr />
	{$balance.usdn.walletBalance}
	<hr />
</main>

<Footer />

<style>
</style>
