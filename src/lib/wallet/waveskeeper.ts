import type IWalletProvider from ".";
import type { AssetInfo } from ".";

const isAvailable = (): boolean => window.WavesKeeper !== undefined;

const wavesKeeperRequestWrapper = (): Promise<any> => {
  if (!isAvailable()) {
    return Promise.reject();
  }

  return window.WavesKeeper.initialPromise;
};

export class WavesKeeperWalletProvider implements IWalletProvider {
  constructor() {
    window.WavesKeeper?.initialPromise.then((keeper) =>
      keeper.on("update", this.onWavesChanged)
    );
  }

  changedCallback: (() => void) | undefined;

  onWavesChanged() {
    this.changedCallback && this.changedCallback();
  }

  onChanged(callback: () => void) {
    this.changedCallback = callback;
  }

  onDisconnect(callback: () => void) {
    this.changedCallback = undefined;
  }

  isAvailable(): Promise<boolean> {
    return Promise.resolve(isAvailable());
  }

  getAddress(): Promise<string> {
    return wavesKeeperRequestWrapper()
      .then((keeper) => keeper.publicState())
      .then((state) => state.account.address);;
  }

  getNetwork(): Promise<string> {
    return wavesKeeperRequestWrapper()
      .then((keeper) => keeper.publicState())
      .then((state) => state.network.code);
  }

  getAccountBalance(asset?: string): Promise<BigInt> {
    return wavesKeeperRequestWrapper()
      .then((keeper) => keeper.publicState())
      .then((state) => {
        if (asset) {
          if (state.account.balance.assets[asset]) {
            return Promise.resolve(state.account.balance.assets[asset].balance);
          } else {
            return Promise.resolve(BigInt(0));
          }
        } else {
          return BigInt(state.account.balance.available);
        }
      });
  }

  getAssetInfo(asset?: string): Promise<AssetInfo | undefined> {
    return Promise.resolve(asset ? undefined : { decimals: 8, symbol: "WAVES" });
  }

  setChain(chainId: string): Promise<unknown> {
    return Promise.reject(new Error("WavesKeeper set chainId manually only"));
  }
}
