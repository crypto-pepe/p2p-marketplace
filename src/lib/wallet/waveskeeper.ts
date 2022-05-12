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
      keeper.on("update", (state: WavesKeeper.IPublicStateResponse) => {
        if (state.account === null) {
          this.disconnectCallback && this.disconnectCallback()
          console.log("Disconnect");
        }
        this.changeCallback && this.changeCallback();

      })
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


// february gas hover siege original number margin filter ceiling collect loyal license suffer then lawn