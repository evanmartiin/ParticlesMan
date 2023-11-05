import { EVENTS } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

class Mouse {
	constructor() {
		state.register(this);
		this.isDown = false;
		this.hasClicked = false;
	}

	onAttach() {
		app.$app.addEventListener('pointerdown', this.#pointerDown);

		app.$app.addEventListener('mouseup', this.#pointerUp);
		app.$app.addEventListener('pointerleave', this.#pointerUp);
	}

	#pointerUp = () => {
		if (!this.isDown) return;
		this.isDown = false;
	};

	#pointerDown = () => {
		if (this.isDown) return;
		this.isDown = true;
		state.emit(EVENTS.POINTER_DOWN);

		if (!this.hasClicked) {
			this.hasClicked = true;
			state.emit(EVENTS.FIRST_CLICK);
		}
	};
}

export { Mouse };
