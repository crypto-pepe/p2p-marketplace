import type { WalletType } from '../stores/wallet';

export type AssetInfo = {
  decimals: number;
  symbol: string;
};

export default interface IWallet<C> {
  getType(): WalletType;
  connect(config: C): Promise<[string, string]>;
  sign(bytes: Uint8Array): Promise<Uint8Array>;
  onConnect(callback: () => void): void;
  onChange(callback: () => void): void;
  onDisconnect(callback?: () => void): void;
  isAvailable(): Promise<boolean>;
  getAddress(): Promise<string>;
  getPublicKey(): Promise<string>;
  getChainId(): Promise<string>;
}
