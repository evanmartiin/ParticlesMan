import { Vector2 } from 'three';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { ClearPass } from 'three/examples/jsm/postprocessing/ClearPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

class PostProcessing {
	enabled = true;

	constructor(renderer, scene, camera) {
		state.register(this);

		this.effectComposer = new EffectComposer(renderer);
		this.effectComposer.setSize(app.tools.viewport.width, app.tools.viewport.height);

		this.effectComposer.addPass(new ClearPass());
		this.effectComposer.addPass(new RenderPass(scene, camera));
		this.bloomPass = this.addBloomPass();
		this.afterImagePass = this.addAfterImagePass();
		this.addOutputPass();

		this.disabledPPComposer = new EffectComposer(renderer);
		this.disabledPPComposer.setSize(app.tools.viewport.width, app.tools.viewport.height);
		this.disabledPPComposer.addPass(new ClearPass());
		this.disabledPPComposer.addPass(new RenderPass(scene, camera));
	}

	onAttach() {
		app.debug?.mapping.add(this, 'PostProcessing');
	}

	addBloomPass() {
		const unrealBloomPass = new UnrealBloomPass(new Vector2(), 0.8, 0.5, 0.0);
		this.effectComposer.addPass(unrealBloomPass);

		return unrealBloomPass;
	}

	addAfterImagePass() {
		const afterImagePass = new AfterimagePass();
		afterImagePass.uniforms['damp'].value = 0.85;
		this.effectComposer.addPass(afterImagePass);

		return afterImagePass;
	}

	addOutputPass() {
		const outputPass = new ShaderPass(CopyShader);
		outputPass.renderToScreen = true;
		this.effectComposer.addPass(outputPass);
	}

	onRender() {
		this.enabled ? this.effectComposer.render() : this.disabledPPComposer.render();
	}
}

export { PostProcessing };
