<script lang="ts" context="module">
  import type { WalletType, ConnectionError } from '$lib/stores/wallet';
  import { walletStore, connectWallet, disconnectWallet } from '$lib/stores/wallet';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { getWalletByType } from '$lib/wallet/helper';
  import Modal from '../Modal.svelte';

  enum Step {
    account = 'Account',
    connect = 'Connect',
    connecting = 'Connecting...',
    error = 'Error',
    wavesKeeperInstall = 'Install WavesKeeper'
  }

  const InstallByWallet: { [walletType in WalletType]: { href: string } } = {
    waveskeeper: {
      href: 'https://docs.waves.tech/en/ecosystem/waves-keeper/#download-waves-keeper'
    }
  };
</script>

<script lang="ts">
  $: step = $walletStore.isConnected ? Step.account : Step.connect;
  let modal: Modal;
  let connectionError: ConnectionError | undefined;
  let walletTypeInstall: WalletType = 'waveskeeper';
	let prevConnetionState: boolean = $walletStore.isConnected;

	walletStore.subscribe(({ isConnected }) => {
    if (prevConnetionState !== isConnected) {
      modal.closeModal();
    }
  });

  export function show() {
    connectionError = undefined;
    step = $walletStore.isConnected ? Step.account : Step.connect;
    modal && modal.openModal();
  }

  async function connect(walletType: WalletType) {
    const wallet = getWalletByType(walletType);
    if (await wallet.isAvailable()) {
      step = Step.connecting;
      connectionError = undefined;
      await connectWallet(wallet)
        .then(modal.closeModal)
        .catch((err) => {
          step = Step.error;
          connectionError = { code: err.code, message: err.message };
        });
    } else {
      walletTypeInstall = walletType;
      step = Step.wavesKeeperInstall;
    }
  }

  function disconnect() {
    step = Step.connect;
    disconnectWallet().finally(modal.closeModal);
    if ($page.url.pathname === '/account' || $page.url.pathname === '/exchanges') {
      goto('/');
    }
  }
</script>

<Modal bind:this={modal}>
  <div class="title" slot="title">
    {#if step === Step.account}
      <div>
        {$walletStore.isConnected && $walletStore.address}
      </div>
    {:else}
      <h6>{step}</h6>
    {/if}
  </div>
  <div class="content" slot="content">
    {#if step === Step.connect}
      <button on:click={() => connect('waveskeeper')}>Connect wallet</button>
    {:else if step === Step.account}
      <button on:click={() => disconnect()}>Disconnect</button>
    {:else if step === Step.connecting}
      some text about waiting loader
    {:else if step === Step.wavesKeeperInstall}
      <a
        href={InstallByWallet[walletTypeInstall].href}
        referrerpolicy="noopener noreferrer"
        target="_blank"
      >
        Install
      </a>
    {:else if step === Step.error}
      <h3>{connectionError?.message}</h3>
    {/if}
  </div>
</Modal>

<style>
</style>
