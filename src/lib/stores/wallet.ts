import { writable } from "svelte/store";
import type IWallet from "../wallet";

export type WalletType = "waveskeeper";

type DisconnectedWalletState = {
  isConnected: false;
};

export type WalletInfoState = {
  type: WalletType;
  address: string;
}

export type ConnectedWalletState = {
  isConnected: true,
} & WalletInfoState;

export type WalletState = DisconnectedWalletState | ConnectedWalletState;

export type ConnectionError = {
  code: number;
  message: string;
};

const DefaultWalletState: WalletState = { isConnected: false };
const { subscribe, update } = writable<WalletState>({ ...DefaultWalletState });

export async function connectWallet(wallet: IWallet<unknown>) {
  wallet.onConnect(async () => {
    try {
      const address = await wallet.getAddress();
      const type = wallet.getType();
      localStorage.setItem('connectedWallet', JSON.stringify({ address, type }));
      update(() => ({
        isConnected: true,
        address,
        type
      }));
    }
    catch {
      update(() => ({
        isConnected: false,
      }));
    }
  });

  wallet.onChange(async () => {
    try {
      const address = await wallet.getAddress();
      const type = wallet.getType();
      localStorage.setItem('connectedWallet', JSON.stringify({ address, type }));
      update(() => ({
        isConnected: true,
        address,
        type
      }));
    }
    catch {
      update(() => ({
        isConnected: false,
      }));
    }
  })

  wallet.onDisconnect(() => {
    localStorage.removeItem('connectedWallet');
    update(() => DefaultWalletState);
  });

  const address = await wallet.getAddress();
  const type = wallet.getType();
  localStorage.setItem('connectedWallet', JSON.stringify({ address, type }));

  update(() => ({
    isConnected: true,
    address,
    type
  }));
}

export async function disconnectWallet() {
  localStorage.removeItem('connectedWallet');
  update(() => DefaultWalletState);
}

export const walletStore = { subscribe };
