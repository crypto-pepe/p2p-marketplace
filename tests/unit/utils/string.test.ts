import { bigIntToFloatString } from "src/utils/strings";

const testValue: {
  value: BigInt;
  decimals: number;
  separator: string;
} = {
  value: 734513321000n,
  decimals: 6,
  separator: '.'
};

const result: string = '734513.321000';

test('BigInt value should be correct convert to float string', () => {
  expect(bigIntToFloatString(testValue.value, testValue.decimals, testValue.separator)).toEqual(result);
});
