import { bigIntToFloatString } from 'src/lib/utils/strings';

const testValue: BigInt = 734513321000n;

describe('BigInt to float string', () => {
  test('BigInt value with 0 decimals should be correct convert to float string', () => {
    expect(bigIntToFloatString(testValue, 0, 4)).toEqual('734513321000');
  });
  test('BigInt value with 6 decimals should be correct convert to float string', () => {
    expect(bigIntToFloatString(testValue, 6, 4)).toEqual('734513.3210');
  });
  test('BigInt value with 18 decimals should be correct convert to float string', () => {
    expect(bigIntToFloatString(testValue, 18, 4)).toEqual('0');
  });
  test('BigInt value with 18 decimals should be correct convert to float string', () => {
    expect(bigIntToFloatString(testValue, 18, 7)).toEqual('0.0000007');
  });
});
