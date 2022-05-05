import type IWalletProvider from "./";
import type { AssetInfo } from "./";

const wavesKeeperRequestWrapper = (): Promise<any> => {
  if (!isAvailable()) {
    return Promise.reject();
  }

  return window.WavesKeeper.initialPromise;
};

const isAvailable = (): boolean => window.WavesKeeper !== undefined;

const getAddress = (): Promise<string> =>
  wavesKeeperRequestWrapper()
    .then((keeper) => keeper.publicState())
    .then((state) => state.account.address);

const getChainId = (): Promise<string> =>
  wavesKeeperRequestWrapper()
    .then((keeper) => keeper.publicState())
    .then((state) => state.network.code);

const getBalance = (asset?: string): Promise<BigInt> =>
  wavesKeeperRequestWrapper()
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

let changedCallback: Function | undefined;

export class WavesKeeperWalletProvider implements IWalletProvider {
  constructor() {
    window.WavesKeeper.initialPromise.then((keeper) =>
      keeper.on("update", this.onWavesChanged)
    );
  }

  onWavesChanged() {
    changedCallback && changedCallback();
  }

  onChanged(callback: Function) {
    changedCallback = callback;
  }

  onDisconnect(callback: Function) {
    changedCallback = undefined;
  }

  isAvailable(): Promise<boolean> {
    return Promise.resolve(isAvailable());
  }

  getAddress(): Promise<string> {
    return getAddress();
  }

  getNetwork(): Promise<string> {
    return getChainId();
  }

  getAccountBalance(asset?: string): Promise<BigInt> {
    return getBalance(asset);
  }

  getAssetInfo(asset?: string): Promise<AssetInfo> {
    if (asset) {
      return Promise.resolve(undefined);
    } else {
      return Promise.resolve({ decimals: 8, symbol: "WAVES" });
    }
  }

  setChain(chainId: string): Promise<unknown> {
    return Promise.reject(new Error("WavesKeeper set chainId manually only"));
  }
}
