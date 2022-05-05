export type CryptoAsset = 'BTC' | 'ETH' | 'USDT' | 'WAVES';
export type FiatAsset = 'USD' | 'EUR' | 'GBP' | 'RUB';
export type Asset = CryptoAsset | FiatAsset;

export type Price = {
	price: number;
	date: Date;
};
export type PricesMap = Partial<Record<Asset, Price>>;
