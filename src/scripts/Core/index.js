import { Ticker } from './Ticker.js';

function createCoreModules() {
	const ticker = new Ticker();

	return {
		ticker,
	};
}

export { createCoreModules };
