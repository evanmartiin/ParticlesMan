import { BoxGeometry, OctahedronGeometry, SphereGeometry } from 'three';

function createPane(pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: false });

	instance.PARAMS = {
		uCurlSize: 0.04,
		uSpeed: 1,
		uDieSpeed: 0.02,
		uScale: 1,
		particleGeometry: 0,
	};

	const geometries = [
		new OctahedronGeometry().scale(0.004, 0.005, 0.012),
		new BoxGeometry().scale(0.005, 0.004, 0.012),
		new SphereGeometry().scale(0.005, 0.005, 0.005),
		new BoxGeometry().scale(0.005, 0.005, 0.005),
	];

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
				Cube: 3,
			},
		})
		.on('change', updateGeometry);

	function update() {
		if (!instance.sim.velUniforms || !instance.sim.posUniforms) return;
		instance.sim.velUniforms.uCurlSize.value = instance.PARAMS.uCurlSize;
		instance.sim.velUniforms.uSpeed.value = instance.PARAMS.uSpeed;
		instance.sim.posUniforms.uDieSpeed.value = instance.PARAMS.uDieSpeed;
		instance.material.uniforms.uScale.value = instance.PARAMS.uScale;
	}

	function updateGeometry() {
		instance.changeGeometry(geometries[instance.PARAMS.particleGeometry]);
	}

	return folder;
}

function debug(_instance) {}

export { createPane, debug };
