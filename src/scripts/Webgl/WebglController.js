import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { MainCamera } from './MainCamera.js';
import { MainScene } from './MainScene.js';
import { PostProcessing } from './PostProcessing.js';
import { Renderer } from './Renderer.js';

class WebglController {
	constructor() {
		state.register(this);

		this.renderer = new Renderer();
		this.scene = new MainScene();
		this.camera = new MainCamera();
		this.postProcessing = new PostProcessing(this.renderer, this.scene, this.camera);
	}

	onAttach() {
		app.$wrapper.prepend(this.renderer.domElement);
	}

	onTick({ et }) {
		globalUniforms.uTime.value = et;
	}
}

export { WebglController };
