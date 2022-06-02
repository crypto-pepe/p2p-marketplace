import type { Asset } from './types';
import { CryptoAsset, FiatAsset } from './types';

export enum BlockchainId {
  Waves = 'waves'
}

export type Blockchains = {
  [key in BlockchainId]: Blockchain;
};

type Blockchain = {
  name: string;
  chains: { [key: string]: Chain };
};

export type Chain = {
  chainId: string;
  chainName: string;
  assets: AssetIds;
  baseUrl: string;
};

export type ChainId<BlockchainId extends keyof Blockchains> =
  keyof Blockchains[BlockchainId]['chains'];

export type Assets<
  BlockchainId extends keyof Blockchains,
  ChainId extends keyof Blockchains[BlockchainId]['chains']
> = Blockchains[BlockchainId]['chains'][ChainId]['assets'];

export type AssetIds = {
  [key in CryptoAsset]: string;
};

export const BALANCE_SERVICE_REFRESHING_INTERVAL_IN_MILLIS: number = 10 * 1_000;
export const PRICE_ORACLE_INTERVAL_IN_MILLIS: number = 30 * 1_000;
export const LOOP_TIMEOUT_IN_MILLIS: number = 1 * 1_000;
export const PRICE_ORACLE_ASSETS: Asset[] = [
  CryptoAsset.BTC,
  CryptoAsset.ETH,
  CryptoAsset.WAVES,
  FiatAsset.EUR,
  FiatAsset.RUB
];

export const BLOCKCHAINS: Blockchains = {
  waves: {
    name: 'Waves',
    chains: {
      T: {
        chainId: 'T',
        chainName: 'Waves testnet',
        assets: {
          WAVES: 'WAVES',
          USDT: '5Sh9KghfkZyhjwuodovDhB6PghDUGBHiAPZ4MkrPgKtX',
          BTC: 'DWgwcZTMhSvnyYCoWLRUXXSH1RSkzThXLJhww9gwkqdn',
          ETH: 'BrmjyAWT5jjr3Wpsiyivyvg5vDuzoX2s93WgiexXetB3'
        },
        baseUrl: 'https://nodes-testnet.wavesnodes.com'
      },
      W: {
        chainId: 'W',
        chainName: 'Waves mainnet',
        assets: {
          WAVES: 'WAVES',
          USDT: '34N9YcEETLWn93qYQ64EsP1x89tSruJU44RrEMSXXEPJ',
          BTC: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
          ETH: '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu'
        },
        baseUrl: 'https://nodes.wavesnodes.com'
      }
    }
  }
};
