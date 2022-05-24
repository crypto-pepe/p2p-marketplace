import type { IPriceOracle, Price } from '$lib/oracles/prices';
import { readable } from 'svelte/store';
import type { PricesMap } from '$lib/types';
import { PRICE_ORACLE_ASSETS, PRICE_ORACLE_INTERVAL_IN_MILLIS } from '$lib/constants';
import { fetchPrice } from '$lib/oracles/prices';
import { BinancePriceOracle } from '$lib/oracles/prices/binance';

const oracles: IPriceOracle[] = [new BinancePriceOracle()];
let state: PricesMap = {};

export const pricesStore = readable<PricesMap>(state, (set) => {
	const updatePrices = async () => {
		state = (
			await Promise.allSettled(PRICE_ORACLE_ASSETS.map((asset) => fetchPrice(asset, oracles)))
		).reduce<PricesMap>(
			(acc: PricesMap, p: PromiseSettledResult<Price>) => ({
				...acc,
				...(p.status === 'fulfilled'
					? { [p.value.asset]: { price: p.value.price, timestamp: p.value.timestamp } }
					: {})
			}),
			state
		);

		set(state);
	};

	updatePrices();
	const intervalId = setInterval(updatePrices, PRICE_ORACLE_INTERVAL_IN_MILLIS);
	return () => clearInterval(intervalId);
});
