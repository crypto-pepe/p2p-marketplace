import type { INodeClient } from '$lib/services/node-client';
import { BLOCKCHAINS, BlockchainId } from '$lib/constants';
import { WavesHttpNodeClient } from '$lib/services/node-client';

export function initNodeClient(blockchainId: BlockchainId, chainId: string): INodeClient {
  const blockchain = BLOCKCHAINS[blockchainId];

  if (!blockchain) {
    throw new Error(`unknown blockchain ${blockchainId}`);
  }

  const chain = blockchain.chains[chainId];

  if (!chain) {
    throw new Error(`unknown chainId ${chainId}`);
  }

  switch (blockchainId) {
    case BlockchainId.Waves:
      return new WavesHttpNodeClient({
        baseUrl: chain.baseUrl
      });

    default:
      throw new Error(`unimplemented for blockchain - ${blockchain}`);
  }
}
