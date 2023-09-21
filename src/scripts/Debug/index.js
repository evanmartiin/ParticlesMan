import { app } from '@scripts/App.js';

async function createDebugModules() {
	await import('@styles/debug/debug.scss');

	const Mapping = (await import('./Mapping.js')).Mapping;
	const mapping = new Mapping();
	await mapping.load();

	const Stats = (await import('./Stats.js')).Stats;
	const stats = new Stats();
	await stats.load();

	window['APP'] = app;

	return {
		mapping,
		stats,
	};
}

export { createDebugModules };
