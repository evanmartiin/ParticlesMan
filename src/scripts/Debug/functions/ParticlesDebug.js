import { BoxGeometry, ConeGeometry, OctahedronGeometry, SphereGeometry } from 'three';

function createPane(pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: false });

	instance.PARAMS = {
		uCurlSize: 0.03,
		uSpeed: 0.75,
		uDieSpeed: 0.015,
		uScale: 1,
		particleGeometry: 0,
		quantity: 256,
	};

	const geometries = [new OctahedronGeometry(1, 0).scale(5, 1, 1), new BoxGeometry(), new SphereGeometry(1, 5, 5), new ConeGeometry(1, 5)];

	folder
		.addInput(instance.PARAMS, 'uCurlSize', {
			min: 0.01,
			max: 0.5,
			step: 0.01,
			label: 'Noise Size',
		})
		.on('change', update);
	folder
		.addInput(instance.PARAMS, 'uDieSpeed', {
			min: 0.01,
			max: 0.1,
			step: 0.01,
			label: 'Die Speed',
		})
		.on('change', update);
	folder
		.addInput(instance.PARAMS, 'uSpeed', {
			min: 0.01,
			max: 2,
			step: 0.01,
			label: 'Particule Speed',
		})
		.on('change', update);
	folder
		.addInput(instance.PARAMS, 'uScale', {
			min: 0.01,
			max: 10,
			step: 0.01,
			label: 'Particule Scale',
		})
		.on('change', update);

	folder
		.addInput(instance.PARAMS, 'particleGeometry', {
			options: {
				Octahedron: 0,
				Box: 1,
				Sphere: 2,
				Cone: 3,
			},
			label: 'Geometry',
		})
		.on('change', updateGeometry);

	folder
		.addInput(instance.PARAMS, 'quantity', {
			options: {
				'16k': 128,
				'65k': 256,
				'262k': 512,
			},
			label: 'Quantity',
		})
		.on('change', updateQuantity);

	function update() {
		if (!instance.sim.velUniforms || !instance.sim.posUniforms) return;
		instance.sim.velUniforms.uCurlSize.value = instance.PARAMS.uCurlSize;
		instance.sim.velUniforms.uSpeed.value = instance.PARAMS.uSpeed;
		instance.sim.posUniforms.uDieSpeed.value = instance.PARAMS.uDieSpeed;
		instance.material.uniforms.uScale.value = instance.PARAMS.uScale;
	}

	function updateGeometry() {
		instance.changeGeometry(geometries[instance.PARAMS.particleGeometry]);
		update();
	}

	function updateQuantity() {
		instance.changeQuantity(instance.PARAMS.quantity);
		update();
	}

	instance.onPointerDown = () => {
		instance.PARAMS.uCurlSize = Math.random() * 0.03 + 0.015;
		instance.PARAMS.uSpeed = Math.random() * 0.5 + 0.5;
		instance.PARAMS.uScale = Math.random() * 0.35 + 1.0;

		instance.PARAMS.particleGeometry = Math.floor(Math.random() * geometries.length);
		updateGeometry();
	};

	return folder;
}

function debug(_instance) {}

export { createPane, debug };
