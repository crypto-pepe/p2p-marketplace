import type IWalletProvider from "./";
import type { WalletType } from "../stores/wallet";
import { WavesKeeperWalletProvider } from "./waveskeeper";

const WalletByType: { [key in WalletType]: IWalletProvider } = {
  waveskeeper: new WavesKeeperWalletProvider(),
};

export type ChainInfo = {
  chainId: string;
  name: string;
  blockchain: "waves";
};

const ChainsByWalletType: {
  [key in WalletType]: ChainInfo[];
} = {
  waveskeeper: [
    { chainId: "W", name: "WAVES Mainnet", blockchain: "waves" },
    { chainId: "T", name: "WAVES Testnet", blockchain: "waves" },
  ],
};

export function getWalletByType(providerType: WalletType) {
  if (providerType in WalletByType) {
    return WalletByType[providerType];
  }

  throw new Error("provider type is not valid");
}

export function getAvailableChains(walletType: WalletType): ChainInfo[] {
  return ChainsByWalletType[walletType];
}
