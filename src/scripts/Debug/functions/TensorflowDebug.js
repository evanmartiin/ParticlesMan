function createPane(pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: false });

	instance.PARAMS = {
		backend: 'mediapipe',
		quality: 'lite',
	};

	folder
		.addInput(instance.PARAMS, 'backend', {
			options: {
				GPU: 'mediapipe',
				CPU: 'tfjs',
			},
			label: 'Backend',
		})
		.on('change', update);

	folder
		.addInput(instance.PARAMS, 'quality', {
			options: {
				Lite: 'lite',
				Middle: 'full',
				Heavy: 'heavy',
			},
			label: 'Quality',
		})
		.on('change', update);

	function update() {
		instance.changeModel(instance.PARAMS.backend, instance.PARAMS.quality);
	}

	return folder;
}

function debug(_instance) {}

export { createPane, debug };
