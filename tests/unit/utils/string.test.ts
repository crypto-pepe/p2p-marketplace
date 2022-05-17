import { bigIntToFloatString } from "src/lib/utils/strings";

const testValue:BigInt = 734513321000n;

const result: string = '734513.321000';

describe('BigInt to float string', () => {
  test('BigInt value with 0 decimals should be correct convert to float string', () => {
    expect(bigIntToFloatString(testValue, 0, '.')).toEqual('734513321000');
  });
  test('BigInt value with 6 decimals should be correct convert to float string', () => {
    expect(bigIntToFloatString(testValue, 6, '.')).toEqual('734513.321000');
  });
  test('BigInt value with 18 decimals should be correct convert to float string', () => {
    expect(bigIntToFloatString(testValue, 18, '.')).toEqual('0.000000734513321000');
  });

})

