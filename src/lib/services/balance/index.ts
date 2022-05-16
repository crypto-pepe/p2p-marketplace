export default interface INodeClient {
  getAddressBalance(address: string, assetId: string): Promise<BigInt>;
}