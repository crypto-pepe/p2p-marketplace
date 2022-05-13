import type IWalletProvider from ".";
import type { WalletType } from "../stores/wallet";

const isAvailable = (): boolean => window.WavesKeeper !== undefined;

const wavesKeeperRequestWrapper = (): Promise<any> => {
  if (!isAvailable()) {
    return Promise.reject();
  }
  return window.WavesKeeper.initialPromise;
};

export class WavesKeeperWalletProvider implements IWalletProvider<unknown> {
  constructor() {
    window.WavesKeeper?.initialPromise.then((keeper) => {
      this.previousPublicState = keeper.publicState();
      keeper.on("update", (state: WavesKeeper.IPublicStateResponse) => {
        if (this.previousPublicState) {
          if (this.previousPublicState?.account !== null && state.account === null) {
            this.disconnectCallback && this.disconnectCallback();
          } else if (this.previousPublicState?.account === null && state.account !== null) {
            this.connectCallback && this.connectCallback();
          } else {
            this.changeCallback && this.changeCallback();
          }
        } else if (!this.previousPublicState && state.account !== null) {
          this.connectCallback && this.connectCallback();
        } else {
          this.changeCallback && this.changeCallback();
        }
        this.previousPublicState = state;
      })
    });
  }

  previousPublicState: WavesKeeper.IPublicStateResponse | undefined = undefined;

  changeCallback: (() => void) | undefined;
  connectCallback: (() => void) | undefined;
  disconnectCallback: (() => void) | undefined;

  connect(): Promise<any> {
    return Promise.resolve();
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

  getAddress(): Promise<string> {
    return wavesKeeperRequestWrapper()
      .then((keeper) => keeper.publicState())
      .then((state) => state.account.address)
  }

  getPublicKey(): Promise<string> {
    return wavesKeeperRequestWrapper()
      .then((keeper) => keeper.publicState())
      .then((state) => state.account.publicKey)
  }

  getChainId(): Promise<string> {
    return wavesKeeperRequestWrapper()
      .then((keeper) => keeper.publicState())
      .then((state) => state.network.code)
  }
}