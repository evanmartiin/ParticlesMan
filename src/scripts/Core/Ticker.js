import { EVENTS } from '@utils/constants.js';
import { state } from '@scripts/State.js';

class Ticker {
	#playing = false;
	constructor() {
		state.register(this);

		this.current = Date.now();
		this.elapsed = 0;
		this.delta = 16;

		this.params = { et: 0, dt: 0 };
	}

	onAttach() {
		this.play();
	}

	play = () => {
		this.#playing = true;
		this.#tick();
	};

	pause = () => {
		this.#playing = false;
	};

	#tick = () => {
		if (!this.#playing) return;
		window.requestAnimationFrame(this.#tick);

		const current = Date.now();

		this.delta = current - this.current;

		this.elapsed += this.delta;
		this.current = current;

		if (this.delta > 60) this.delta = 60;

		this.params.et = this.elapsed;
		this.params.dt = this.delta * 0.001;

		state.emit(EVENTS.TICK, this.params);
		state.emit(EVENTS.RENDER, this.params);
	};
}

export { Ticker };
