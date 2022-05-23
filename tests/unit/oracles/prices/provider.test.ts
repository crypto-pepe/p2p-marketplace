import type { Price } from 'src/lib/oracles/prices';
import { fetchPrice } from 'src/lib/oracles/prices';
import { CryptoAsset } from 'src/lib/types';

const stubPrice: Price = { asset: CryptoAsset.BTC, timestamp: new Date(1000000), price: 1223.54 };

describe('price oracle', () => {
  test('should check available asset for all oracles', async () => {
    const firstOracle = {
      isAvailable: jest.fn(() => false),
      fetchPrice: jest.fn(async (): Promise<Price> => stubPrice)
    };
    const secondOracle = {
      isAvailable: jest.fn(() => false),
      fetchPrice: jest.fn(async (): Promise<Price> => stubPrice)
    };

    await expect(fetchPrice(CryptoAsset.BTC, [firstOracle, secondOracle])).rejects.toThrow(
      'empty price'
    );
    expect(firstOracle.isAvailable).toHaveBeenCalled();
    expect(firstOracle.fetchPrice).not.toHaveBeenCalled();
    expect(secondOracle.isAvailable).toHaveBeenCalled();
    expect(secondOracle.fetchPrice).not.toHaveBeenCalled();
  });

  test('should fetch only first available price', async () => {
    const firstOracle = {
      isAvailable: jest.fn(() => true),
      fetchPrice: jest.fn(async (): Promise<Price> => stubPrice)
    };
    const secondOracle = {
      isAvailable: jest.fn(() => false),
      fetchPrice: jest.fn(async (): Promise<Price> => stubPrice)
    };

    expect(await fetchPrice(CryptoAsset.BTC, [firstOracle, secondOracle])).toEqual(stubPrice);
    expect(firstOracle.isAvailable).toHaveBeenCalled();
    expect(firstOracle.fetchPrice).toHaveBeenCalled();
    expect(secondOracle.isAvailable).not.toHaveBeenCalled();
    expect(secondOracle.fetchPrice).not.toHaveBeenCalled();
  });

  test('should fetch second oracle if first fetch is fail', async () => {
    const firstOracle = {
      isAvailable: jest.fn(() => true),
      fetchPrice: jest.fn(async (): Promise<Price> => {
        throw new Error('empty price');
      })
    };
    const secondOracle = {
      isAvailable: jest.fn(() => true),
      fetchPrice: jest.fn(async (): Promise<Price> => stubPrice)
    };

    expect(await fetchPrice(CryptoAsset.BTC, [firstOracle, secondOracle])).toEqual(stubPrice);
    expect(firstOracle.isAvailable).toHaveBeenCalled();
    expect(firstOracle.fetchPrice).toHaveBeenCalled();
    expect(secondOracle.isAvailable).toHaveBeenCalled();
    expect(secondOracle.fetchPrice).toHaveBeenCalled();
  });

  test('should fetch only second oracle if first oracle asset is not available', async () => {
    const firstOracle = {
      isAvailable: jest.fn(() => false),
      fetchPrice: jest.fn(async (): Promise<Price> => stubPrice)
    };
    const secondOracle = {
      isAvailable: jest.fn(() => true),
      fetchPrice: jest.fn(async (): Promise<Price> => stubPrice)
    };

    expect(await fetchPrice(CryptoAsset.BTC, [firstOracle, secondOracle])).toEqual(stubPrice);
    expect(firstOracle.isAvailable).toHaveBeenCalled();
    expect(firstOracle.fetchPrice).not.toHaveBeenCalled();
    expect(secondOracle.isAvailable).toHaveBeenCalled();
    expect(secondOracle.fetchPrice).toHaveBeenCalled();
  });
});
