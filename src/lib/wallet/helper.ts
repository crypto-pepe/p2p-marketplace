import type IWalletProvider from '.';
import type { WalletType } from '$lib/stores/wallet';
import { WavesKeeperWalletProvider } from './waveskeeper';
import { memoize } from '$lib/utils/memoize';

export enum BlockchainId {
  Waves = 'waves'
}

export type ChainInfo = {
  chainId: string;
  name: string;
  blockchain: BlockchainId;
};

const ChainsByWalletType: {
  [key in WalletType]: ChainInfo[];
} = {
  waveskeeper: [
    { chainId: 'W', name: 'WAVES Mainnet', blockchain: BlockchainId.Waves },
    { chainId: 'T', name: 'WAVES Testnet', blockchain: BlockchainId.Waves }
  ]
};

function _getWalletByType(providerType: WalletType): IWalletProvider<unknown> {
  const WalletByType: { [key in WalletType]: IWalletProvider<unknown> } = {
    waveskeeper: new WavesKeeperWalletProvider()
  };
  if (providerType in WalletByType) {
    return WalletByType[providerType];
  }

  throw new Error('provider type is not valid');
}

export const getWalletByType = memoize(_getWalletByType);

export function getAvailableChains(walletType: WalletType): ChainInfo[] {
  return ChainsByWalletType[walletType];
}
