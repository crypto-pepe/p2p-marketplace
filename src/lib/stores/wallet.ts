import { writable } from 'svelte/store';
import type { ChainId } from '../constants';
import type IWallet from '../wallet';
import { Blockchain, getAvailableChains, getWalletByType } from '../wallet/helper';

export type WalletType = 'waveskeeper';

type DisconnectedWalletState = {
  isConnected: false;
};

export type WalletInfoState = {
  address: string;
  chainId: ChainId;
  blockchain: Blockchain;
  type: WalletType;
};

export type ConnectedWalletState = {
  isConnected: true;
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
      const chainId = (await wallet.getChainId()) as ChainId;
      const type = wallet.getType();
      const availableChain = getAvailableChains(type).find((chain) => chain.chainId === chainId);
      const blockchain = availableChain?.blockchain as Blockchain;
      localStorage.setItem(
        'connectedWallet',
        JSON.stringify({ address, type, blockchain, chainId })
      );
      update(() => ({
        isConnected: true,
        address,
        blockchain,
        chainId,
        type
      }));
    } catch {
      update(() => ({
        isConnected: false
      }));
    }
  });

  wallet.onChange(async () => {
    try {
      const address = await wallet.getAddress();
      const chainId = (await wallet.getChainId()) as ChainId;
      const type = wallet.getType();
      const availableChain = getAvailableChains(type).find((chain) => chain.chainId === chainId);
      const blockchain = availableChain?.blockchain as Blockchain;
      localStorage.setItem(
        'connectedWallet',
        JSON.stringify({ address, type, blockchain, chainId })
      );
      update(() => ({
        isConnected: true,
        address,
        blockchain,
        chainId,
        type
      }));
    } catch {
      update(() => ({
        isConnected: false
      }));
    }
  });

  wallet.onDisconnect(() => {
    localStorage.removeItem('connectedWallet');
    update(() => DefaultWalletState);
  });

  const address = await wallet.getAddress();
  const chainId = (await wallet.getChainId()) as ChainId;
  const type = wallet.getType();
  const availableChain = getAvailableChains(type).find((chain) => chain.chainId === chainId);
  const blockchain = availableChain?.blockchain as Blockchain;
  localStorage.setItem(
    'connectedWallet',
    JSON.stringify({
      isConnected: true,
      address,
      blockchain,
      chainId,
      type
    })
  );

  update(() => ({
    isConnected: true,
    address,
    blockchain,
    chainId,
    type
  }));
}

export async function disconnectWallet() {
  localStorage.removeItem('connectedWallet');
  update(() => DefaultWalletState);
}

function isValidWalletState(walletState: any): walletState is WalletInfoState {
  return (
    typeof walletState === 'object' &&
    typeof walletState.address === 'string' &&
    typeof walletState.type === 'string'
  );
}

const loadFromLocalStorage = async () => {
  const initialState: string | null = localStorage.getItem('connectedWallet');
  if (initialState !== null) {
    try {
      const walletState: WalletInfoState = JSON.parse(initialState);
      if (isValidWalletState(walletState)) {
        const wallet = getWalletByType(walletState.type);
        if (await wallet.isAvailable()) {
          return await connectWallet(wallet);
        } else {
          return null;
        }
      } else {
        throw new Error();
      }
    } catch (e) {
      localStorage.removeItem('connectedWallet');
      return null;
    }
  } else {
    console.log('initial state is null');
  }
};

export const walletStore = { subscribe, loadFromLocalStorage };
