import { WavesHttpNodeClient } from "src/lib/services/balance/node-client";
import fetchMock from 'jest-fetch-mock';

beforeEach(() => {
  fetchMock.resetMocks();
});

const address: string = 'address';
const assetId: string = 'DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p';

describe('balance sevice', () => {
  const wawesNodeClient = new WavesHttpNodeClient({baseUrl: ''});

  test("should fetch address balance of BigInt type", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ balance: 1700000 }));
    const data = await wawesNodeClient.getAddressBalance(address, assetId);
    expect(data).toBe(BigInt(1700000));
  });
});