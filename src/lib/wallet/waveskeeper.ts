import type IWalletProvider from ".";
import type { WalletType } from "../stores/wallet";

const isAvailable = (): boolean => window.WavesKeeper !== undefined;

const wavesKeeperRequestWrapper = (): Promise<any> => {
  if (!isAvailable()) {
    return Promise.reject();
  }
  return window.WavesKeeper.initialPromise;
};

type ConnectionConfig = {
}

export class WavesKeeperWalletProvider implements IWalletProvider<ConnectionConfig> {
  constructor() {
    window.WavesKeeper?.initialPromise.then((keeper) => {
      keeper.on("update", (state: WavesKeeper.IPublicStateResponse) => { console.log(state) })
    }
    );
  }

  changeCallback: (() => void) | undefined;
  connectCallback: (() => void) | undefined;
  disconnectCallback: (() => void) | undefined;

  onWavesChanged() {
    this.changeCallback && this.changeCallback();
  }
  
  connect(): Promise<any> {
    return Promise.resolve()
  }
  
  //Need Promise type change
  sign(bytes: Uint8Array): Promise<any> {
    return Promise.resolve(() => { throw new Error("Sign error") })
  }
  
  getType(): WalletType {
    return 'waveskeeper';
  }

  onConnect(callback: () => void) {
    this.connectCallback = callback;
  }

  onChange(callback: () => void) {
    this.changeCallback = callback;
  }

  onDisconnect(callback: () => void) {
    this.disconnectCallback = callback;
  }

  isAvailable(): Promise<boolean> {
    return Promise.resolve(isAvailable());
  }

  getAddress(): Promise<any> {
    return wavesKeeperRequestWrapper()
      .then((keeper) => keeper.publicState())
      .then((state) => state.account.address)
  }

  //Need Promise type change
  getPublicKey(): Promise<any> {
    return Promise.resolve(() => { throw new Error("Public key error") })
  }

  //Need Promise type change
  getChainId(): Promise<any> {
    return Promise.resolve(() => { throw new Error("Chain id error") })
  }
}