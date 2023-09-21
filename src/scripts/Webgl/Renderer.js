import { WebGLRenderer } from 'three';
import { DEBUG } from '@utils/config.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

class Renderer extends WebGLRenderer {
	constructor() {
		super({ powerPreference: 'high-performance' });
		state.register(this);

		this.antialias = false;
		this.stencil = false;
		this.depth = false;
		this.autoClear = false;
		this.shadowMap.enabled = false;
		this.debug.checkShaderErrors = DEBUG;
	}

	onAttach() {
		app.debug?.mapping.add(this, 'Stats');
	}

	onResize({ width, height, dpr }) {
		this.setSize(width, height);
		this.setPixelRatio(dpr);
	}
}

export { Renderer };
