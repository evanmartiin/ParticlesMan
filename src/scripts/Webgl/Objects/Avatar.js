import {
	ClampToEdgeWrapping,
	CylinderGeometry,
	DynamicDrawUsage,
	Float32BufferAttribute,
	FloatType,
	Group,
	InstancedBufferAttribute,
	InstancedMesh,
	MathUtils,
	Mesh,
	NearestFilter,
	Object3D,
	PlaneGeometry,
	RGBAFormat,
	Scene,
	ShaderMaterial,
	SphereGeometry,
	Vector2,
	WebGLRenderTarget,
} from 'three';
import { assertIsInCamera } from '@utils/assertions.js';
import { POSE, POSE_CONNECTIONS } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { VIDEO_SIZE } from '@scripts/Tensorflow/TensorflowCamera.js';
import meshFragmentShader from '../Materials/ParticulesMan/fragment.glsl';
import meshVertexShader from '../Materials/ParticulesMan/vertex.glsl';

const DUMMY = new Object3D();
const TORSO_CYLINDER_NB = 10;

class Avatar extends Group {
	constructor() {
		super();
		state.register(this);
	}

	onAttach() {
		// this.scene = new Scene();
		// this.camera = new PerspectiveCamera();
		// this.camera.position.set(0.5, 0.5, 1);
		// this.camera.lookAt(0.5, 0.5, 0);
		// this.fbo = new WebGLRenderTarget(512, 512, { magFilter: NearestFilter, type: HalfFloatType });

		this.wPosMaterial = new ShaderMaterial({
			vertexShader: `
				varying vec4 vPosition;
				void main() {
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
					vPosition = gl_Position;
				}
				`,
			fragmentShader: `
				varying vec4 vPosition;
				void main() {
					gl_FragColor = vPosition;
				}
				`,
		});
		this.wPosMaterialInstanced = new ShaderMaterial({
			vertexShader: `
				varying vec4 vPosition;
				void main() {
					gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
					vPosition = gl_Position;
				}
				`,
			fragmentShader: `
				varying vec4 vPosition;
				void main() {
					gl_FragColor = vPosition;
				}
				`,
		});

		this.head = new Mesh(new SphereGeometry(0.04, 64, 64), this.wPosMaterial);
		this.head.scale.y = 1.25;

		this.tubes = new InstancedMesh(new CylinderGeometry(0.01, 0.01, 1, 25, 25), this.wPosMaterialInstanced, POSE_CONNECTIONS.length);
		this.tubes.instanceMatrix.setUsage(DynamicDrawUsage);

		this.torso = new InstancedMesh(new CylinderGeometry(0.01, 0.01, 1, 25, 25), this.wPosMaterialInstanced, TORSO_CYLINDER_NB);
		this.torso.instanceMatrix.setUsage(DynamicDrawUsage);

		// this.scene.add(this.head, this.tubes, this.torso);

		this.addParticles();

		this.quad = new Mesh(
			new PlaneGeometry(VIDEO_SIZE.width * 0.0005, VIDEO_SIZE.height * 0.0005),
			new ShaderMaterial({
				vertexShader: `
				varying vec2 vUv;
		void main() {
			gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.0);
			vUv = uv;
		}
		`,
				fragmentShader: `
		uniform sampler2D tTex;
		varying vec2 vUv;

		void main() {
			gl_FragColor = texture2D(tTex, vUv);
		}
		`,
				uniforms: {
					// tTex: { value: this.fbo.texture },
					tTex: { value: this.vertexStore.positionMap },
				},
			}),
		);
		this.quad.position.y = -0.2;
		this.quad.position.x = 0.35;
		this.quad.position.z = -1;
		// app.webgl.scene.add(this.quad);
	}

	onPlayerMoved(rig) {
		if (!this.tubes || !this.head || !this.torso) return;

		POSE_CONNECTIONS.forEach((connection, i) => {
			const src = rig.keypoints[connection[0]];
			const dst = rig.keypoints[connection[1]];
			if (src && dst) {
				if (assertIsInCamera(src) || assertIsInCamera(dst)) {
					const srcV2 = new Vector2(1 - src.x / VIDEO_SIZE.width, 1 - src.y / VIDEO_SIZE.height);
					const dstV2 = new Vector2(1 - dst.x / VIDEO_SIZE.width, 1 - dst.y / VIDEO_SIZE.height);
					const armPos = srcV2.clone().add(dstV2).divideScalar(2);
					DUMMY.position.set(armPos.x, armPos.y, 0);
					DUMMY.scale.y = srcV2.distanceTo(dstV2) * 1.1;
					DUMMY.lookAt(dstV2.x, dstV2.y, 0);
					DUMMY.rotateX(Math.PI / 2);
					DUMMY.updateMatrix();
					this.tubes.geometry.getAttribute('aBoneVisible').setX(i, 1);
				} else {
					DUMMY.scale.y = 0;
					this.tubes.geometry.getAttribute('aBoneVisible').setX(i, 0);
				}
				this.tubes.setMatrixAt(i, DUMMY.matrix);
				this.tubes.geometry.getAttribute('aBoneVisible').needsUpdate = true;
			}
		});

		this.tubes.instanceMatrix.needsUpdate = true;

		this.head.position.set(1 - rig.keypoints[POSE.NOSE].x / VIDEO_SIZE.width, 1 - rig.keypoints[POSE.NOSE].y / VIDEO_SIZE.height, 0.0);
		const leftHearV2 = new Vector2(1 - rig.keypoints[POSE.LEFT_EAR].x / VIDEO_SIZE.width, 1 - rig.keypoints[POSE.LEFT_EAR].y / VIDEO_SIZE.height);
		const rightHearV2 = new Vector2(1 - rig.keypoints[POSE.RIGHT_EAR].x / VIDEO_SIZE.width, 1 - rig.keypoints[POSE.RIGHT_EAR].y / VIDEO_SIZE.height);
		const hearsDist = leftHearV2.distanceTo(rightHearV2) * 10 + 1;
		this.head.scale.setScalar(hearsDist);

		const topLeftTorso = new Vector2(1 - rig.keypoints[POSE.LEFT_SHOULDER].x / VIDEO_SIZE.width, 1 - rig.keypoints[POSE.LEFT_SHOULDER].y / VIDEO_SIZE.height);
		const topRightTorso = new Vector2(1 - rig.keypoints[POSE.RIGHT_SHOULDER].x / VIDEO_SIZE.width, 1 - rig.keypoints[POSE.RIGHT_SHOULDER].y / VIDEO_SIZE.height);
		const bottomLeftTorso = new Vector2(1 - rig.keypoints[POSE.LEFT_HIP].x / VIDEO_SIZE.width, 1 - rig.keypoints[POSE.LEFT_HIP].y / VIDEO_SIZE.height);
		const bottomRightTorso = new Vector2(1 - rig.keypoints[POSE.RIGHT_HIP].x / VIDEO_SIZE.width, 1 - rig.keypoints[POSE.RIGHT_HIP].y / VIDEO_SIZE.height);

		for (let i = 0; i < TORSO_CYLINDER_NB; i++) {
			const src = new Vector2().lerpVectors(topLeftTorso, topRightTorso, (1 / (TORSO_CYLINDER_NB + 1)) * (i + 1));
			const dst = new Vector2().lerpVectors(bottomLeftTorso, bottomRightTorso, (1 / (TORSO_CYLINDER_NB + 1)) * (i + 1));
			if (assertIsInCamera(src) || assertIsInCamera(dst)) {
				const armPos = src.clone().add(dst).divideScalar(2);
				DUMMY.position.set(armPos.x, armPos.y, 0);
				DUMMY.scale.y = src.distanceTo(dst) * 1.1;
				DUMMY.lookAt(dst.x, dst.y, 0);
				DUMMY.rotateX(Math.PI / 2);
				DUMMY.updateMatrix();
				this.torso.geometry.getAttribute('aBoneVisible').setX(i, 1);
			} else {
				DUMMY.scale.y = 0;
				this.torso.geometry.getAttribute('aBoneVisible').setX(i, 0);
			}
			this.torso.setMatrixAt(i, DUMMY.matrix);
			this.torso.geometry.getAttribute('aBoneVisible').needsUpdate = true;
		}

		this.torso.instanceMatrix.needsUpdate = true;
	}

	onRender() {
		if (this.vertexStore) this.vertexStore.update();

		// if (this.scene && app.webgl.camera) {
		// 	app.webgl.renderer.setRenderTarget(this.fbo);
		// 	app.webgl.renderer.clear(true, true, false);
		// 	app.webgl.renderer.render(this.scene, this.camera);
		// 	app.webgl.renderer.setRenderTarget(null);
		// }
	}

	addParticles() {
		this.vertexStore = this.createVertexStore([this.head, this.tubes, this.torso]);
		this.numVertices = this.vertexStore.numVertices;

		this.vertexStore.update();
	}

	createVertexStore(meshes) {
		let totalNumVertices = 0;

		meshes.forEach((mesh) => {
			const numVertices = mesh.geometry.attributes.position.count;
			const fragIndices = new Float32Array(numVertices);
			for (let i = 0; i < numVertices; i++) {
				fragIndices[i] = i + totalNumVertices * (mesh.isInstancedMesh ? 0 : 1);
			}
			mesh.geometry.setAttribute('aFragIndex', new Float32BufferAttribute(fragIndices, 1));

			if (mesh.isInstancedMesh) {
				const indicesOffset = new Float32Array(mesh.count);
				const visibleBones = new Float32Array(mesh.count);
				for (let i = 0; i < mesh.count; i++) {
					indicesOffset[i] = i * numVertices + totalNumVertices;
					visibleBones[i] = 1;
				}
				mesh.geometry.setAttribute('aFragOffset', new InstancedBufferAttribute(indicesOffset, 1));
				mesh.geometry.setAttribute('aBoneVisible', new InstancedBufferAttribute(visibleBones, 1));
				totalNumVertices += numVertices * mesh.count;
			} else {
				totalNumVertices += numVertices;
			}
		});

		const mapWidth = 512;
		const mapHeight = MathUtils.ceilPowerOfTwo(Math.ceil(totalNumVertices / mapWidth));

		const renderTargetOptions = {
			depthBuffer: false,
			stencilBuffer: false,
			type: FloatType,
			format: RGBAFormat,
			minFilter: NearestFilter,
			magFilter: NearestFilter,
			wrapS: ClampToEdgeWrapping,
			wrapT: ClampToEdgeWrapping,
		};
		const renderTarget = new WebGLRenderTarget(mapWidth, mapHeight, renderTargetOptions);

		const material = new ShaderMaterial({
			defines: {
				USE_UV: '',
			},
			uniforms: {
				uMapWidth: {
					value: mapWidth,
				},
				uMapHeight: {
					value: mapHeight,
				},
			},
			vertexShader: meshVertexShader,
			fragmentShader: meshFragmentShader,
		});

		const scene = new Scene();

		const container = new Group();
		container.scale.multiplyScalar(1);
		scene.add(container);
		meshes.forEach((mesh) => {
			container.add(mesh);

			mesh.material.dispose();
			mesh.material = material;

			// @ts-ignore
			mesh.isMesh = false;
			// @ts-ignore
			mesh.isPoints = true;
		});

		return {
			numVertices: totalNumVertices,
			mapWidth,
			mapHeight,
			material,
			scene,
			positionMap: renderTarget.texture,
			update,
		};

		function update() {
			const renderer = app.webgl.renderer;
			const camera = app.webgl.camera;
			const originalRenderTarget = renderer.getRenderTarget();
			renderer.setRenderTarget(renderTarget);
			renderer.render(scene, camera);
			renderer.setRenderTarget(originalRenderTarget);
		}
	}
}

export { Avatar };
