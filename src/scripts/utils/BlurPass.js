import { gsap } from 'gsap';
import { HalfFloatType, MeshBasicMaterial, NearestFilter, ShaderMaterial, Texture, UniformsUtils, Vector2, WebGLRenderTarget } from 'three';
import { FullScreenQuad, Pass } from 'three/examples/jsm/postprocessing/Pass.js';
import { app } from '@scripts/App.js';

class BlurPass extends Pass {
	constructor() {
		super();

		this.radius = 2;

		this.shader = BlurShader;

		this.uniforms = UniformsUtils.clone(this.shader.uniforms);

		this.uniforms['uResolution'].value = new Vector2(app.tools.viewport.width, app.tools.viewport.height);

		this.fboA = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
			magFilter: NearestFilter,
			type: HalfFloatType,
		});

		this.fboB = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
			magFilter: NearestFilter,
			type: HalfFloatType,
		});

		this.compFsMaterial = new ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: this.shader.vertexShader,
			fragmentShader: this.shader.fragmentShader,
		});

		this.compFsQuad = new FullScreenQuad(this.compFsMaterial);

		this.copyFsMaterial = new MeshBasicMaterial();
		this.copyFsQuad = new FullScreenQuad(this.copyFsMaterial);
	}

	enable() {
		gsap.to(this, {
			radius: 2,
			duration: 1,
		});
	}

	disable() {
		gsap.to(this, {
			radius: 0,
			duration: 1,
		});
	}

	render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive*/) {
		this.uniforms['tTex'].value = readBuffer.texture;
		this.uniforms['uDirection'].value = new Vector2(this.radius, 0);
		renderer.setRenderTarget(this.fboA);
		this.compFsQuad.render(renderer);

		this.uniforms['tTex'].value = this.fboA.texture;
		this.uniforms['uDirection'].value = new Vector2(0, this.radius);
		renderer.setRenderTarget(this.fboB);
		this.compFsQuad.render(renderer);

		this.copyFsQuad.material.map = this.fboB.texture;

		if (this.renderToScreen) {
			renderer.setRenderTarget(null);
			this.copyFsQuad.render(renderer);
		} else {
			renderer.setRenderTarget(writeBuffer);

			if (this.clear) renderer.clear();

			this.copyFsQuad.render(renderer);
		}
	}

	setSize(width, height) {
		this.fboA.setSize(width, height);
		this.fboB.setSize(width, height);
	}

	dispose() {
		this.fboA.dispose();
		this.fboB.dispose();

		this.compFsMaterial.dispose();
		this.copyFsMaterial.dispose();

		this.compFsQuad.dispose();
		this.copyFsQuad.dispose();
	}
}

const BlurShader = {
	uniforms: {
		uResolution: { value: new Vector2() },
		uDirection: { value: new Vector2() },
		tTex: { value: new Texture() },
	},

	vertexShader: /* glsl */ `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */ `

        uniform vec2 uResolution;
        uniform vec2 uDirection;
		uniform sampler2D tTex;

		varying vec2 vUv;

        vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
			vec4 color = vec4(0.0);
			vec2 off1 = vec2(1.411764705882353) * direction;
			vec2 off2 = vec2(3.2941176470588234) * direction;
			vec2 off3 = vec2(5.176470588235294) * direction;
			color += texture2D(image, uv) * 0.1964825501511404;
			color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
			color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
			color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
			color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
			color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
			color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
			return color;
        }

		void main() {

			gl_FragColor = blur(tTex, vUv, uResolution, uDirection);

		}`,
};

export { BlurPass };
