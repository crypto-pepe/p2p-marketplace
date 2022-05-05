<script lang="ts" context="module">
	import type { WalletType, ConnectionError } from '../../../stores/wallet';
	import { wallet, connectWallet, disconnectWallet } from '../../../stores/wallet';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getWalletByType } from '../../../wallet/helper';
	import Modal from '../Modal.svelte';

	enum Step {
		account = 'Account',
		connect = 'Connect',
		connecting = 'Connecting...',
		wavesKeeperInstall = 'Install WavesKeeper'
	}

	const InstallByWallet: { [walletType in WalletType]: { href: string } } = {
		waveskeeper: {
			href: 'https://docs.waves.tech/en/ecosystem/waves-keeper/#download-waves-keeper'
		}
	};
</script>

<script lang="ts">
	let modal: Modal;
	let step: Step = $wallet.isConnected ? Step.account : Step.connect;
	let connectionError: ConnectionError | undefined;

	export function show() {
		connectionError = undefined;
		if ($wallet.isConnected) {
			step = Step.account;
		} else {
			step = Step.connect;
		}
		modal && modal.openModal();
	}

	async function connect(walletType: WalletType) {
		if (await getWalletByType(walletType).isAvailable()) {
			step = Step.connecting;
			connectionError = undefined;
			await connectWallet(walletType)
				.then(modal.closeModal)
				.catch((err) => {
					step = Step.connect;
					connectionError = { code: err.code, message: err.message };
				});
		} else {
			step = Step.wavesKeeperInstall;
		}
	}

	async function disconnect(walletType: WalletType) {
		step = Step.connect;
		await disconnectWallet(walletType).finally(modal.closeModal);
		if ($page.url.pathname === '/account' || $page.url.pathname === '/exchanges') {
			goto('/');
		}
	}
</script>

<Modal bind:this={modal}>
	<div class="title" slot="title">
		{#if step === Step.account}
			<div>
				{$wallet.address}
			</div>
			<div>
				{$wallet.type}
			</div>
		{:else}
			<h6>{step}</h6>
		{/if}
	</div>
	<div class="content" slot="content">
		{#if step === Step.connect}
			<button on:click={() => connect('waveskeeper')}>Connect wallet</button>
		{:else if step === Step.account}
			<button on:click={() => disconnect('waveskeeper')}>Disconnect</button>
		{:else if step === Step.connecting}
			some text about waiting loader
		{:else if step === Step.wavesKeeperInstall}
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
