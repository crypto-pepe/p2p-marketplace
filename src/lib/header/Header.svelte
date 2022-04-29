<script lang="ts" context="module">
	import type { Wallet } from '../../stores/wallet';
	import type { Link } from 'src/types/types';
	import { wallet } from '../../stores/wallet';
	import NavBar from './navbar/NavBar.svelte';
	import ConnectWalletModal from '$lib/modal/connect-wallet-modal/ConnectWalletModal.svelte';

	const navLinks: Link[] = [
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
			href: 'https://pepe-team.tawk.help/',
			target: '_blank',
			referrerpolicy: 'noopener noreferrer'
		}
	];

	function buttonDecorator(wallet: Wallet): {
		title: string;
	} {
		return wallet.isConnected ? { title: wallet.address } : { title: 'Connect' };
	}
</script>

<script lang="ts">
	let connectWalletModal: ConnectWalletModal;

	$: buttonArgs = buttonDecorator($wallet);
	$: isConnected = $wallet.isConnected;

	$: getVisibleLinks = (): Link[] => {
		return navLinks.filter((link) => {
			return isConnected ? link : link.href !== '/account' && link.href !== '/exchanges';
		});
	};
</script>

<header class="header">
	<div class="header__logo">Logo</div>
	<NavBar navLinks={getVisibleLinks()} />
	<div class="header__button">
		<button on:click={connectWalletModal.show}>{buttonArgs.title}</button>
	</div>
</header>
<ConnectWalletModal bind:this={connectWalletModal} />

<style>
</style>
