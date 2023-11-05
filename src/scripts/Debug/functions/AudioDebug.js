function createPane(pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: false });

	folder.addInput(instance, 'FREQUENCY', {
		min: 20,
		max: 20000,
		step: 10,
		label: 'Frequency',
	});

	folder.addInput(instance, 'FORCE', {
		min: 1,
		max: 50,
		step: 1,
		label: 'Force',
	});

	folder.addInput(instance.analyser, 'smoothingTimeConstant', {
		min: 0,
		max: 1,
		step: 0.01,
		label: 'Smoothing',
	});

	return folder;
}

function debug(_instance) {}

export { createPane, debug };
