<script lang="ts" context="module">
  import type { WalletInfoState, WalletType } from 'src/lib/stores/wallet';
  import { onMount } from 'svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import Header from '$lib/components/header/Header.svelte';
  import { connectWallet } from '../lib/stores/wallet';
  import { getWalletByType } from '$lib/wallet/helper';
  import '../app.css';
</script>

<script lang="ts">
  async function preConnectWallet(walletType: WalletType) {
    const wallet = getWalletByType(walletType);
    if (await wallet.isAvailable()) {
      await connectWallet(wallet).catch((err) => {
        console.log(err.code, err.message);
      });
    }
  }

  function isWalletInfoState(connectedBy: any): connectedBy is WalletInfoState {
    return (
      typeof connectedBy === 'object' &&
      typeof connectedBy.address === 'string' &&
      typeof connectedBy.type === 'string'
    );
  }

  onMount(() => {
    const nullableState: string | null = localStorage.getItem('connectedWallet');
    if (nullableState !== null) {
      try {
        const connectedBy = JSON.parse(nullableState);
        if (isWalletInfoState(connectedBy)) {
          preConnectWallet(connectedBy.type);
        }
      } catch {
        localStorage.removeItem('connectedWallet');
      }
    }
  });
</script>

<Header />
<main>
  <slot />
</main>

<Footer />

<style>
</style>
