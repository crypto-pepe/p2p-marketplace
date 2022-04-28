const wavesKeeperRequestWrapper = async (): Promise<any> => {
  if (!isAvailable()) {
    return Promise.reject();
  }

  return window.WavesKeeper.initialPromise;
};

export const isAvailable = (): boolean => window.WavesKeeper !== undefined;

export const getAddress = async (): Promise<string> =>
  wavesKeeperRequestWrapper()
    .then((keeper) => keeper.publicState())
    .then((state) => state.account.address);

export const getChainId = async (): Promise<string> =>
  wavesKeeperRequestWrapper()
    .then((keeper) => keeper.publicState())
    .then((state) => state.network.code);

export const getBalance = async (asset?: string): Promise<BigInt> =>
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
