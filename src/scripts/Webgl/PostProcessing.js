import { DepthTexture, MathUtils, NearestFilter, UnsignedShortType, Vector2, WebGLRenderTarget } from 'three';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { ClearPass } from 'three/examples/jsm/postprocessing/ClearPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { BlurPass } from '@utils/BlurPass.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

class PostProcessing {
	constructor(_isWebGL2 = true, renderer, scene, camera) {
		state.register(this);

		this._rt = this._setupRenderTarget;

		this._effectComposer = new EffectComposer(renderer);
		this._effectComposer.setSize(app.tools.viewport.width, app.tools.viewport.height);

		this._clearPass = this._addClearPass();
		this._addRenderPass(scene, camera);

		this._bloomPass = this._addBloomPass();
		// this.blurPass = new BlurPass();
		// this._effectComposer.addPass(this.blurPass);

		// this._fishEyesPass = this._addFishEyesPass(camera);
		this._afterImagePass = this._addAfterImagePass();
		// this._SMAAPass = this._addSMAAPass();

		// this._addRenderPass(this.sceneWithoutPP, camera);

		this._customPass = this._addCustomPass();
		this._outputPass = this._addOutputPass();

		// const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
		// this._effectComposer.addPass(gammaCorrectionPass);
	}

	onAttach() {
		app.debug?.mapping.add(this, 'PostProcessing');
	}

	_setupRenderTarget() {
		const rt = new WebGLRenderTarget(window.innerWidth, window.innerHeight);
		rt.texture.minFilter = NearestFilter;
		rt.texture.magFilter = NearestFilter;
		rt.stencilBuffer = false;
		rt.depthTexture = new DepthTexture(window.innerWidth, window.innerHeight, UnsignedShortType);

		return rt;
	}

	_createEffectComposer(renderer) {
		const effectComposer = new EffectComposer(renderer);
		effectComposer.setSize(app.tools.viewport.width, app.tools.viewport.height);
		effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		return effectComposer;
	}

	_addRenderPass(scene, camera) {
		const renderPass = new RenderPass(scene, camera);
		renderPass.clear = false;
		this._effectComposer.addPass(renderPass);

		return renderPass;
	}

	_addClearPass() {
		const clearPass = new ClearPass();

		this._effectComposer.addPass(clearPass);

		return clearPass;
	}

	_addBloomPass() {
		const unrealBloomPass = new UnrealBloomPass(new Vector2(), 0.6, 1, 0.0);
		this._effectComposer.addPass(unrealBloomPass);

		return unrealBloomPass;
	}

	_addFishEyesPass(camera) {
		const fisheyes = new ShaderPass(this.getDistortionShaderDefinition());
		this._effectComposer.addPass(fisheyes);

		// Setup distortion effect
		const horizontalFOV = 140;
		const strength = 0.35;
		const cylindricalRatio = 2;
		const height = Math.tan(MathUtils.degToRad(horizontalFOV) / 2) / camera.aspect;

		camera.fov = (Math.atan(height) * 2 * 180) / 3.1415926535;
		camera.updateProjectionMatrix();

		fisheyes.uniforms['strength'].value = strength;
		fisheyes.uniforms['height'].value = height;
		fisheyes.uniforms['aspectRatio'].value = camera.aspect;
		fisheyes.uniforms['cylindricalRatio'].value = cylindricalRatio;

		return fisheyes;
	}

	getDistortionShaderDefinition() {
		return {
			uniforms: {
				tDiffuse: { type: 't', value: null },
				strength: { type: 'f', value: 0 },
				height: { type: 'f', value: 1 },
				aspectRatio: { type: 'f', value: 1 },
				cylindricalRatio: { type: 'f', value: 1 },
			},

			vertexShader: [
				'uniform float strength;', // s: 0 = perspective, 1 = stereographic
				'uniform float height;', // h: tan(verticalFOVInRadians / 2)
				'uniform float aspectRatio;', // a: screenWidth / screenHeight
				'uniform float cylindricalRatio;', // c: cylindrical distortion ratio. 1 = spherical

				'varying vec3 vUV;', // output to interpolate over screen
				'varying vec2 vUVDot;', // output to interpolate over screen

				'void main() {',
				'gl_Position = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));',

				'float scaledHeight = strength * height;',
				'float cylAspectRatio = aspectRatio * cylindricalRatio;',
				'float aspectDiagSq = aspectRatio * aspectRatio + 1.0;',
				'float diagSq = scaledHeight * scaledHeight * aspectDiagSq;',
				'vec2 signedUV = (2.0 * uv + vec2(-1.0, -1.0));',

				'float z = 0.5 * sqrt(diagSq + 1.0) + 0.5;',
				'float ny = (z - 1.0) / (cylAspectRatio * cylAspectRatio + 1.0);',

				'vUVDot = sqrt(ny) * vec2(cylAspectRatio, 1.0) * signedUV;',
				'vUV = vec3(0.5, 0.5, 1.0) * z + vec3(-0.5, -0.5, 0.0);',
				'vUV.xy += uv;',
				'}',
			].join('\n'),

			fragmentShader: [
				'uniform sampler2D tDiffuse;', // sampler of rendered scene?s render target
				'varying vec3 vUV;', // interpolated vertex output data
				'varying vec2 vUVDot;', // interpolated vertex output data

				'void main() {',
				'vec3 uv = dot(vUVDot, vUVDot) * vec3(-0.5, -0.5, -1.0) + vUV;',
				'gl_FragColor = texture2DProj(tDiffuse, uv);',
				'}',
			].join('\n'),
		};
	}

	_addAfterImagePass() {
		const afterImagePass = new AfterimagePass();
		afterImagePass.uniforms['damp'].value = 0.85;
		this._effectComposer.addPass(afterImagePass);

		return afterImagePass;
	}

	_addBokehPass(scene, camera) {
		const bokehPass = new BokehPass(scene, camera, {
			focus: 3,
			aperture: 0.25,
			maxblur: 3,
		});

		// bokehPass.uniforms['focus'].value = 10;
		// bokehPass.uniforms['aperture'].value = 1;
		// bokehPass.uniforms['maxblur'].value = 2;

		return bokehPass;
	}

	_addCustomPass() {
		const customShader = {
			uniforms: {
				tDiffuse: { value: null },
			},
			vertexShader: `
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
			fragmentShader: `
        uniform sampler2D tDiffuse;

        varying vec2 vUv;

        void main()
        {
            vec4 color = texture2D(tDiffuse, vUv);

            gl_FragColor = vec4(0.2);
            gl_FragColor = color;
        }
    `,
		};

		const customPass = new ShaderPass(customShader);
		this._effectComposer.addPass(customPass);
	}

	_addSMAAPass() {
		const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
		this._effectComposer.addPass(smaaPass);

		return smaaPass;
	}

	_addOutputPass() {
		const outputPass = new ShaderPass(CopyShader);
		outputPass.renderToScreen = true;

		this._effectComposer.addPass(outputPass);

		return outputPass;
	}

	onResize() {}

	onRender() {
		this._effectComposer.render();

		// this._bloomPass.strength = 0.6 + app.core.audio.frequencies[3] / 500;
	}
}

export { PostProcessing };
