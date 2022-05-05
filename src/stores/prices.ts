import { readable } from 'svelte/store';
import type { PricesMap } from '$lib/types';
import { PRICE_ORACLE_ASSETS, PRICE_ORACLE_INTERVAL } from '../lib/constants';
import { fetchPrice, type IPriceOracle, type Price } from '../lib/oracles/prices';
import { BinancePriceOracle } from '../lib/oracles/prices/binance';

const oracles: IPriceOracle[] = [new BinancePriceOracle()];
let state: PricesMap = {};

export const prices = readable<PricesMap>(state, (set) => {
	const updatePrices = async () => {
		state = (
			await Promise.allSettled(PRICE_ORACLE_ASSETS.map((asset) => fetchPrice(asset, oracles)))
		).reduce<PricesMap>(
			(acc: PricesMap, p: PromiseSettledResult<Price>) => ({
				...acc,
				...(p.status === 'fulfilled'
					? { [p.value.asset]: { price: p.value.price, date: p.value.date } }
					: {})
			}),
			state
		);

		set(state);
	};

	updatePrices();
	const intervalId = setInterval(updatePrices, PRICE_ORACLE_INTERVAL);
	return () => clearInterval(intervalId);
});
