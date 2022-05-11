import { writable } from "svelte/store";
import { getWalletByType } from "src/wallet/helper";
import { bigIntToFloatString } from "src/utils/strings";

export type WalletType = "waveskeeper";

export type Wallet = {
  isConnected: boolean;
  type?: WalletType;
  address?: string;
  network?: string;
  balance?: number;
};

export type ConnectionError = {
  code: number;
  message: string;
};

const DefaultWalletState: Wallet = { isConnected: false };
const { subscribe, update } = writable<Wallet>({ ...DefaultWalletState });

export async function connectWallet(walletType: WalletType) {
  const wallet = getWalletByType(walletType);
  const [address, network, balance, asset] = await Promise.all([
    wallet.getAddress(),
    wallet.getNetwork(),
    wallet.getAccountBalance(),
    wallet.getAssetInfo(),
  ]);

  update(() => ({
    isConnected: true,
    address,
    type: walletType,
    network,
    balance: parseFloat(
      asset ? bigIntToFloatString(balance, asset.decimals) : balance.toString()
    ),
  }));

  wallet.onChanged(() => connectWallet(walletType));
}

export async function disconnectWallet(walletType: WalletType) {
  const wallet = getWalletByType(walletType);
  wallet && wallet.onDisconnect();
  update(() => DefaultWalletState);
}

export const wallet = { subscribe };
