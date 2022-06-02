import type { AssetBalances } from 'src/lib/stores/token-balances';
import type { BalancesForAssets } from 'src/lib/utils/balances';
import { calculateTotalBalanceInUsd } from 'src/lib/utils/balances';
import { _private } from 'src/lib/utils/balances';

describe('Balances util calculateUsdPrice function', () => {
  test('should return balance with 0 decimals and $1 price', () => {
    expect(_private.calculateUsdPrice(1n, 0, 1)).toEqual(1);
  });
  test('should return balance with 6 decimals and $1 price', () => {
    expect(_private.calculateUsdPrice(1000000n, 6, 1)).toEqual(1);
  });
  test('should return balance with 6 decimals and $10 price', () => {
    expect(_private.calculateUsdPrice(1000000n, 6, 10)).toEqual(10);
  });
  test('should return 0 when balance > 0.00', () => {
    expect(_private.calculateUsdPrice(100000n, 6, 1)).toEqual(0);
  });
});

const balanceTest1: AssetBalances = {
  walletBalance: 1000000n,
  inOrdersBalance: 1000n,
  lockInOrdersBalance: 1n
};
const balanceTest2: AssetBalances = {
  walletBalance: null,
  inOrdersBalance: null,
  lockInOrdersBalance: null
};
const balanceTest3: AssetBalances = {
  walletBalance: 1000000n,
  inOrdersBalance: 1000n,
  lockInOrdersBalance: null
};

const resultWithValues = {
  walletBalance: {
    amount: 1000000n,
    amountUSD: 1000000
  },
  inOrdersBalance: {
    amount: 1000n,
    amountUSD: 1000
  },
  lockInOrdersBalance: {
    amount: 1n,
    amountUSD: 1
  }
};

const resultWithNull = {
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

const resultWithMix = {
  walletBalance: {
    amount: 1000000n,
    amountUSD: 6
  },
  inOrdersBalance: {
    amount: 1000n,
    amountUSD: 0
  },
  lockInOrdersBalance: {
    amount: null,
    amountUSD: null
  }
};

describe('Balances util getBalancesForAsset function', () => {
  test('should return 3 type of balances with number & bigint values', () => {
    expect(_private.getBalancesForAsset(balanceTest1, 0, 1)).toEqual(resultWithValues);
  });
  test('should return 3 type of balances with null values', () => {
    expect(_private.getBalancesForAsset(balanceTest2, 0, 6)).toEqual(resultWithNull);
  });

  test('should return 3 type of balances with mixed values', () => {
    expect(_private.getBalancesForAsset(balanceTest3, 6, 6)).toEqual(resultWithMix);
  });
});

const totalBalanceTestValue: BalancesForAssets = {
  USDT: {
    walletBalance: {
      amount: 1000000n,
      amountUSD: 10
    },
    inOrdersBalance: {
      amount: 1n,
      amountUSD: 1
    },
    lockInOrdersBalance: {
      amount: null,
      amountUSD: null
    }
  },
  WAVES: {
    walletBalance: {
      amount: 1000000n,
      amountUSD: 10
    },
    inOrdersBalance: {
      amount: 1n,
      amountUSD: 1
    },
    lockInOrdersBalance: {
      amount: null,
      amountUSD: null
    }
  },
  BTC: {
    walletBalance: {
      amount: 1000000n,
      amountUSD: 10
    },
    inOrdersBalance: {
      amount: 1n,
      amountUSD: 1
    },
    lockInOrdersBalance: {
      amount: null,
      amountUSD: null
    }
  },
  ETH: {
    walletBalance: {
      amount: 1000000n,
      amountUSD: 10
    },
    inOrdersBalance: {
      amount: 1n,
      amountUSD: 1
    },
    lockInOrdersBalance: {
      amount: null,
      amountUSD: null
    }
  }
};

describe('Balances util calculateTotalBalance function', () => {
  test('should return total balance', () => {
    expect(calculateTotalBalanceInUsd(totalBalanceTestValue)).toBe(44);
  });
});
