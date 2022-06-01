import type { AssetBalances } from 'src/lib/stores/token-balances';
import { _private } from 'src/lib/utils/balances';

describe('Balances util calculateUsdPrice function', () => {
  test('should return balance with 0 decimals and $1 price', () => {
    expect(_private.calculateUsdPrice(1n, 0, 1)).toEqual('1.00');
  });
  test('should return balance with 6 decimals and $1 price', () => {
    expect(_private.calculateUsdPrice(1000000n, 6, 1)).toEqual('1.00');
  });
  test('should return balance with 6 decimals and $10 price', () => {
    expect(_private.calculateUsdPrice(1000000n, 6, 10)).toEqual('10.00');
  });
  test('should return 0 when balance > 0.00', () => {
    expect(_private.calculateUsdPrice(100000n, 6, 1)).toEqual('0');
  });
});

const assetBalances: AssetBalances = {
  walletBalance: 1000000n,
  inOrdersBalance: 1n,
  lockInOrdersBalance: null
};

const positiveResult = {
  walletBalance: {
    amount: '1000000',
    amountUSD: '1000000.00'
  },
  inOrdersBalance: {
    amount: '1',
    amountUSD: '1.00'
  },
  lockInOrdersBalance: {
    amount: null,
    amountUSD: null
  }
};

const nullableResult = {
  walletBalance: {
    amount: null,
    amountUSD: null
  },
  inOrdersBalance: {
    amount: null,
    amountUSD: null
  },
  lockInOrdersBalance: {
    amount: null,
    amountUSD: null
  }
};

describe('Balances util getBalancesForAsset function', () => {
  test('should return positive result', () => {
    expect(_private.getBalancesForAsset(assetBalances, 0, 1)).toEqual(positiveResult);
  });
  test('should return nullable result', () => {
    expect(_private.getBalancesForAsset(assetBalances, null, null)).toEqual(nullableResult);
  });
});


// describe('Balances util calculateTotalBalance function', () => {
//   test('should return positive result', () => {
//     expect(calculateTotalBalance()).toEqual();
//   });
//   test('should return nullable result', () => {
//     expect(calculateTotalBalance()).toEqual();
//   });
// });
