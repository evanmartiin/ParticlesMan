import { BoxGeometry, OctahedronGeometry, SphereGeometry } from 'three';

function createPane(pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: false });

	instance.PARAMS = {
		uCurlSize: 0,
		uCurlStrength: 0,
		uCurlChangeSpeed: 0,
		uDieSpeed: 0,
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
			min: 0.05,
			max: 0.5,
			step: 0.01,
		})
		.on('change', update);
	folder
		.addInput(instance.PARAMS, 'uCurlStrength', {
			min: 0.003,
			max: 0.03,
			step: 0.001,
		})
		.on('change', update);
	folder
		.addInput(instance.PARAMS, 'uCurlChangeSpeed', {
			min: 0,
			max: 1,
			step: 0.01,
		})
		.on('change', update);
	folder
		.addInput(instance.PARAMS, 'uDieSpeed', {
			min: 0.01,
			max: 0.1,
			step: 0.01,
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
		if (!instance.velocityUniforms) return;
		instance.velocityVariable.material.uniforms.uCurlSize.value = instance.PARAMS.uCurlSize;
		instance.velocityVariable.material.uniforms.uCurlStrength.value = instance.PARAMS.uCurlStrength;
		instance.velocityVariable.material.uniforms.uCurlChangeSpeed.value = instance.PARAMS.uCurlChangeSpeed;
		instance.velocityVariable.material.uniforms.uDieSpeed.value = instance.PARAMS.uDieSpeed;
	}

	function updateGeometry() {
		instance.particles.geometry = instance.createParticleGeometry(geometries[instance.PARAMS.particleGeometry]);
	}

	return folder;
}

function debug(_instance) {}

export { createPane, debug };
