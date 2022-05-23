import type { SvelteComponent } from 'svelte';

export enum CryptoAsset {
	BTC = 'BTC',
	ETH = 'ETH',
	USDT = 'USDT',
	WAVES = 'WAVES'
}
export enum FiatAsset {
	USD = 'USD',
	EUR = 'EUR',
	GPB = 'GPB',
	RUB = 'RUB'
}
export type Asset = CryptoAsset | FiatAsset;

export type Price = {
	price: number;
	timestamp: Date;
};
export type PricesMap = Partial<Record<Asset, Price>>;


export type Link = {
	content: string | SvelteComponent;
	title?: string;
	href: string;
	referrerpolicy?: string;
	target?: '_blank' | '_self' | '_parent' | '_top';
};
