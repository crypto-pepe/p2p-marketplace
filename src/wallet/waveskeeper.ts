import type IWalletProvider from "./";
import {
  getAddress,
  getChainId,
  getBalance,
  isAvailable,
} from "../utils/waveskeeper";
import type { AssetInfo } from "./";

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
