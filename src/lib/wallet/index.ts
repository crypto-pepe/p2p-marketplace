export type AssetInfo =
  {
    decimals: number;
    symbol: string;
  }

export default interface IWallet {
  onChanged(callback: () => void): void;
  onDisconnect(callback?: () => void): void;
  isAvailable(): Promise<boolean>;
  getAddress(): Promise<string>;
  getNetwork(): Promise<string>;
  getAccountBalance(asset?: string): Promise<BigInt>;
  getAssetInfo(asset?: string): Promise<AssetInfo | undefined>;
  setChain(chainId: string): Promise<unknown>;
}
