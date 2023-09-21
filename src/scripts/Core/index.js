import { AssetsManager } from './AssetsManager.js';
import { Ticker } from './Ticker.js';

function createCoreModules() {
	const assetsManager = new AssetsManager();
	const ticker = new Ticker();

	return {
		assetsManager,
		ticker,
	};
}

export { createCoreModules };
