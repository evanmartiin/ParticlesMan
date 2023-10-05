import { PerspectiveCamera, Vector3 } from 'three';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

const BASE_FOV = 38.7;

class MainCamera extends PerspectiveCamera {
	constructor() {
		super(BASE_FOV + 10, app.tools.viewport.ratio, 0.3, 30);
		state.register(this);

		this.baseFov = BASE_FOV + 15;
		this.target = new Vector3(0, 1, 0);
		this.position.z = 7;
		this.position.y = 1.5;
		this.lookAt(this.target);

		this.toggleOrbit();
	}

	onResize({ ratio }) {
		this.aspect = ratio;
		this.fov = this.baseFov / Math.min(1, ratio * 1.5);
		this.updateProjectionMatrix();
	}

	async toggleOrbit() {
		const OrbitThree = await import('three/addons/controls/OrbitControls.js');
		this.orbitControls = new OrbitThree.OrbitControls(this, app.$wrapper);
		this.orbitControls.enableZoom = true;
		this.orbitControls.minDistance = 4;
		this.orbitControls.maxDistance = 10;
		this.orbitControls.enablePan = false;
		this.orbitControls.enableRotate = false;
		this.orbitControls.target.copy(app.webgl.camera.target);
		this.orbitControls.update();
		this.far = 200;
		this.updateProjectionMatrix();
	}
}

export { MainCamera };
