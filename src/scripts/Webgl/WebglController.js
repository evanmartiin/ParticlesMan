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
		this.postProcessing = new PostProcessing(this.renderer.capabilities.isWebGL2, this.renderer, this.scene, this.camera);
	}

	onAttach() {
		app.$wrapper.prepend(this.renderer.domElement);
	}

	onResize() {}

	onTick({ et }) {
		globalUniforms.uTime.value = et;
	}

	onRender() {
		// this.renderer.clear();
		// this.renderer.setRenderTarget(this.postProcessing.renderTarget);
		// this.renderer.clear();
		// this.renderer.render(this.scene, this.camera);
		// this.renderer.setRenderTarget(null);
		// this.composer.render();
		// this.renderer.render(this.postProcessing.quad, this.postProcessing.camera);
		// this.effectComposer.render();
	}
}

export { WebglController };
