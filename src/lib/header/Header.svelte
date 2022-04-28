<script lang="ts" context="module">
	import type { Wallet } from '../../stores/wallet';
	import { wallet } from '../../stores/wallet';
	import NavBar from './navbar/NavBar.svelte';
	import ConnectWalletModal from '$lib/modal/connect-wallet-modal/ConnectWalletModal.svelte';

	const navLinks: {
		content: string;
		href: string;
	}[] = [
		{
			content: 'Marketplace',
			href: '/'
		},
		{
			content: 'Account',
			href: '/account'
		},
		{
			content: 'Exchanges',
			href: '/exchanges'
		},
		{
			content: 'Stats',
			href: '/stats'
		},
		{
			content: 'FAQ',
			href: 'https://pepe-team.tawk.help/'
		}
	];

	function buttonDecorator(wallet: Wallet): {
		title: string;
		primary?: boolean;
		secondary?: boolean;
	} {
		return wallet.isConnected
			? { title: wallet.address, secondary: true }
			: { title: 'Connect', primary: true };
	}
</script>

<script lang="ts">
	let connectWalletModal: ConnectWalletModal;

	$: buttonArgs = buttonDecorator($wallet);
	$: isConnected = $wallet.isConnected;
</script>

<header class="header">
	<div class="header__logo">Logo</div>
	<NavBar {isConnected} {navLinks} />
	<div class="header__button">
		<button on:click={connectWalletModal.show}>{buttonArgs.title}</button>
	</div>
</header>
<ConnectWalletModal bind:this={connectWalletModal} />

<style>
</style>
