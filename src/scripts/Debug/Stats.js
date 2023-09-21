import { state } from '@scripts/State.js';

class Stats {
	#stats;
	constructor() {
		state.register(this);
	}

	async load() {
		const Stats = (await import('stats-js')).default;
		this.#stats = new Stats();
		this.#stats.showPanel(0);
		document.body.appendChild(this.#stats.dom);
	}

	onTick() {
		this.#stats.update();
	}

	onKeyDown(key) {
		if (key === 'h') this.#stats.dom.classList.toggle('cypher-debug-hidden');
	}
}

export { Stats };
