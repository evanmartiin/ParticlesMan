import { Texture } from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import positionShader from '@Webgl/Materials/Particles/simulation/positionShader.fs';
import velocityShader from '@Webgl/Materials/Particles/simulation/velocityShader.fs';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { globalUniforms } from '../../../utils/globalUniforms.js';

export class GPUSimulation {
	constructor(renderer, size) {
		state.register(this);

		this.renderer = renderer;
		this.size = size;

		this.init();
	}

	init() {
		this.gpuCompute = new GPUComputationRenderer(this.size, this.size, this.renderer);

		this.dataPos = this.gpuCompute.createTexture();
		this.dataVel = this.gpuCompute.createTexture();

		const posArray = this.dataPos.image.data;
		const velArray = this.dataVel.image.data;

		for (let i = 0, il = posArray.length; i < il; i += 4) {
			const x = (Math.random() * 2 - 1) * 100;
			const y = (Math.random() * 2 - 1) * 100;
			const z = (Math.random() * 2 - 1) * 20;

			posArray[i + 0] = x;
			posArray[i + 1] = y;
			posArray[i + 2] = z;
			posArray[i + 3] = Math.random();
			velArray[i + 0] = 0;
			velArray[i + 1] = 0;
			velArray[i + 2] = 0;
			velArray[i + 3] = 0;
		}

		this.pos = this.gpuCompute.addVariable('posTex', positionShader, this.dataPos);
		this.vel = this.gpuCompute.addVariable('velTex', velocityShader, this.dataVel);

		this.gpuCompute.setVariableDependencies(this.pos, [this.pos, this.vel]);
		this.gpuCompute.setVariableDependencies(this.vel, [this.pos, this.vel]);

		this.posUniforms = this.pos.material.uniforms;

		this.posUniforms.uTime = { value: globalUniforms.uTime.value };
		this.posUniforms.uDelta = { value: 0.0 };
		this.posUniforms.uDieSpeed = { value: 0.02 };
		this.posUniforms.uRigPositionTexture = { value: new Texture() };

		this.velUniforms = this.vel.material.uniforms;

		this.velUniforms.uTime = { value: globalUniforms.uTime.value };
		this.velUniforms.uDelta = { value: 0.0 };
		this.velUniforms.uSpeed = { value: 1 };
		this.velUniforms.uCurlSize = { value: 0.04 };
		this.velUniforms.uTimeScale = { value: 0.5 };
		this.velUniforms.uRigPositionTexture = { value: new Texture() };

		const error = this.gpuCompute.init();
		if (error !== null) {
			console.error(error);
		}
	}

	onRender({ dt }) {
		let deltaRatio = 60 * dt;
		deltaRatio = Math.min(deltaRatio, 0.6);

		this.posUniforms.uDelta.value = deltaRatio;

		if (app.webgl.scene.avatar.vertexStore.positionMap) {
			this.posUniforms.uRigPositionTexture.value = app.webgl.scene.avatar.vertexStore.positionMap;
			this.velUniforms.uRigPositionTexture.value = app.webgl.scene.avatar.vertexStore.positionMap;
		}
	}
}
