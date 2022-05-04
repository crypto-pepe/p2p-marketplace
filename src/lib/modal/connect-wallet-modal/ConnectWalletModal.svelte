<script lang="ts" context="module">
	import type { WalletType, ConnectionError } from '../../../stores/wallet';
	import { wallet, connectWallet, disconnectWallet } from '../../../stores/wallet';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getWalletByType } from '../../../wallet/helper';
	import Modal from '../Modal.svelte';

	type Step = 'account' | 'connect' | 'connecting' | 'wavesKeeperInstall';

	const TitleByStepMap: { [step in Step]: string } = {
		account: 'Account',
		connect: 'Connect Wallet',
		connecting: 'Connecting...',
		wavesKeeperInstall: 'Install WavesKeeper'
	};

	const InstallByWallet: { [walletType in WalletType]: { href: string } } = {
		waveskeeper: {
			href: 'https://docs.waves.tech/en/ecosystem/waves-keeper/#download-waves-keeper'
		}
	};
</script>

<script lang="ts">
	let modal: Modal;
	let step: Step = $wallet.isConnected ? 'account' : 'connect';
	let connectionError: ConnectionError | undefined;

	export function show() {
		connectionError = undefined;
		if ($wallet.isConnected) {
			step = 'account';
		} else {
			step = 'connect';
		}
		modal && modal.openModal();
	}

	async function connect(walletType: WalletType) {
		if (await getWalletByType(walletType).isAvailable()) {
			step = 'connecting';
			connectionError = undefined;
			await connectWallet(walletType)
				.then(modal.closeModal)
				.catch((err) => {
					step = 'connect';
					connectionError = { code: err.code, message: err.message };
				});
		} else {
			step = 'wavesKeeperInstall';
		}
	}

	async function disconnect(walletType: WalletType) {
		step = 'connect';
		await disconnectWallet(walletType).finally(modal.closeModal);
		if ($page.url.pathname === '/account' || $page.url.pathname === '/exchanges') {
			goto('/');
		}
	}
</script>

<Modal bind:this={modal}>
	<div class="title" slot="title">
		{#if step === 'account'}
			<div>
				{$wallet.address}
			</div>
			<div>
				{$wallet.type}
			</div>
		{:else}
			<h6>{TitleByStepMap[step]}</h6>
		{/if}
	</div>
	<div class="content" slot="content">
		{#if step === 'connect'}
			<button on:click={() => connect('waveskeeper')}>Connect wallet</button>
		{:else if step === 'account'}
			<button on:click={() => disconnect('waveskeeper')}>Disconnect</button>
		{:else if step === 'connecting'}
			some text about waiting loader
		{:else if step === 'wavesKeeperInstall'}
			<a
				href={InstallByWallet['waveskeeper'] && InstallByWallet['waveskeeper'].href}
				referrerpolicy="noopener noreferrer"
				target="_blank"
			>
				Install
			</a>
		{/if}
	</div>
</Modal>

<style>
</style>
