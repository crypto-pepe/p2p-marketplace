import type INodeClient from '.';

type WavesHttpNodeClientCofig = {
  baseUrl: string
}

export class WavesHttpNodeClient implements INodeClient {
  constructor(private readonly config: WavesHttpNodeClientCofig) {
  }

  getAddressBalance(address: string, assetId: string): Promise<BigInt> {
    return fetch(`${this.config.baseUrl}/assets/balance/${address}/${assetId}`)
      .then((response) => response.json())
      .then((data) => BigInt(data.balance))
  }
}