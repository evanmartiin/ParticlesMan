import { BufferGeometry, DoubleSide, Group, InstancedBufferAttribute, InstancedMesh, MeshStandardMaterial, OctahedronGeometry, Texture } from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import vertexShader from '@Webgl/Materials/Particles/visual/vertex.vs';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { GPUSimulation } from './GPUSimulation.js';

export class Particles extends Group {
	constructor(size, coords, acceleration) {
		super();
		state.register(this);
		this.size = size;
		this.coords = coords;
		this.acceleration = acceleration;
		this.visible = false;
	}

	onAttach() {
		this.sim = new GPUSimulation(app.webgl.renderer, this.size);
		const baseGeometry = new OctahedronGeometry(1, 0).scale(4, 2, 2);
		this.geometry = this.createGeometry(baseGeometry);
		this.material = this.createMaterial();
		this.mesh = this.createMesh();
		this.show();

		app.debug?.mapping.add(this, 'Particles');
	}

	show() {
		this.active = true;
		this.visible = true;
		this.material.uniforms.uScale.value = 1;
	}

	hide() {
		this.active = false;
		this.visible = false;
		this.material.uniforms.uScale.value = 0;
	}

	createGeometry(baseGeometry) {
		const geometry = new BufferGeometry();

		Object.keys(baseGeometry.attributes).forEach((attributeName) => {
			geometry.attributes[attributeName] = baseGeometry.attributes[attributeName];
		});
		geometry.index = baseGeometry.index;

		const particleAmout = this.size * this.size;
		const randomAttribute = new InstancedBufferAttribute(new Float32Array(particleAmout), 1, 1);

		for (let i = 0; i < particleAmout; i++) {
			randomAttribute.setX(i, Math.random() + 0.1);
		}

		geometry.setAttribute('aRandom', randomAttribute);

		return geometry;
	}

	createMaterial() {
		const material = new CustomShaderMaterial({
			baseMaterial: MeshStandardMaterial,
			vertexShader: vertexShader,
			uniforms: {
				...globalUniforms,
				posMap: { value: new Texture() },
				velMap: { value: new Texture() },
				uSize: { value: this.size },
				uScale: { value: 0 },
			},
			side: DoubleSide,
			metalness: 0.6,
			roughness: 0.4,
		});

		return material;
	}

	createMesh() {
		const mesh = new InstancedMesh(this.geometry, this.material, this.size * this.size);
		mesh.scale.set(0.032, 0.032, 0.032);

		this.add(mesh);
		mesh.position.set(-1.1, -0.1, 2.8);
		mesh.frustumCulled = false;

		return mesh;
	}

	changeGeometry(newBaseGeometry) {
		this.geometry.dispose();
		this.material.dispose();
		while (this.children.length) {
			this.remove(this.children[0]);
		}
		this.geometry = this.createGeometry(newBaseGeometry);
		this.material = this.createMaterial();
		this.mesh = this.createMesh();
		this.show();
	}

	changeQuantity(quantity) {
		this.size = quantity;
		this.sim.dispose();
		this.sim = new GPUSimulation(app.webgl.renderer, this.size);
	}

	onRender() {
		if (!this.material) return;

		this.material.uniforms.posMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture;
		this.material.uniforms.velMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture;

		this.sim.gpuCompute.compute();
	}
}
