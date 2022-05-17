import type { IBalanceService } from "src/lib/services/balance/index";
import { WavesHttpNodeClient } from "src/lib/services/balance/node-clients";
import fetchMock from 'jest-fetch-mock';
import { BalanceService, BalanceType } from "src/lib/services/balance/balance-service";
import { AssetService } from "src/lib/services/balance/asset-service";
import { ReadableStream } from 'node:stream/web';
import { BALANCE_SERVICE_INTERVAL_IN_MILLIS } from "src/lib/constants";

beforeEach(() => {
  fetchMock.resetMocks();
});

const address: string = 'address';
const assetId: string = 'DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p';

describe('node client', () => {
  const wawesNodeClient = new WavesHttpNodeClient({ baseUrl: '' });

  test("should fetch address balance of BigInt type", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ balance: 1700000 }));
    const data = await wawesNodeClient.getAddressBalance(address, assetId);
    expect(data).toBe(BigInt(1700000));
  });
});

describe('asset sevice', () => {
  const wawesNodeClient = {
    getAddressBalance: () => Promise.resolve(10n),
    getAssetDetails: () => Promise.resolve({ decimals: 5, assetId: 'id', symbol: 'USD-N' })
  };
  const assetService = new AssetService(wawesNodeClient);

  test("should fetch asset info", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ decimals: 5, assetId: 'id', name: 'USD-N' }));
    const assetInfo = await assetService.getAssetInfo('assetId');
    expect(assetInfo.decimals).toEqual(5);
    expect(assetInfo.assetId).toEqual('id');
    expect(assetInfo.symbol).toEqual('USD-N');
  });
});


describe('balance sevice', () => {
  function streamBuilder(cb: () => Promise<any>) {
    let interval: NodeJS.Timer;
    return new ReadableStream({
      start(controller: ReadableStreamDefaultController) {
        (async () => {
          try {
            const value = await cb()
            controller.enqueue(value);
          }
          catch {
            clearInterval(interval);
            controller.close()
          }
        })()
        interval = setInterval(async () => {
          try {
            const value = await cb()
            controller.enqueue(value);
          }
          catch {
            clearInterval(interval);
            controller.close()
          }
        }, BALANCE_SERVICE_INTERVAL_IN_MILLIS);
      },

      cancel() {
        clearInterval(interval);
      }
    })
  }

  test("should fetch balance", async () => {
    const wawesNodeClient = {
      getAddressBalance: () => Promise.resolve(10n),
      getAssetDetails: () => Promise.resolve({ decimals: 5, assetId: 'id', symbol: 'USD-N' })
    };
    const balanceService: IBalanceService = new BalanceService(wawesNodeClient, address, streamBuilder);
    const reader = balanceService.subscribe(BalanceType.wallet, assetId);
    const { value: result } = await reader.read();
    expect(typeof result).toBe('bigint');
    reader.cancel();
  });

  test("should fetch balance fail", async () => {
    const wawesNodeClient = {
      getAddressBalance: () => Promise.reject(null),
      getAssetDetails: () => Promise.resolve({ decimals: 5, assetId: 'id', symbol: 'USD-N' })
    };
    const balanceService: IBalanceService = new BalanceService(wawesNodeClient, address, streamBuilder);
    const reader = balanceService.subscribe(BalanceType.wallet, assetId);
    const { done } = await reader.read();
    expect(done).toBe(true);
    expect(reader.closed).resolves;
  });
});
