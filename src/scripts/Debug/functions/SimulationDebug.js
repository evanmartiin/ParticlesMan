function createPane(pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: false });

	folder.addInput(instance.options, 'mouse_force', {
		min: 20,
		max: 200,
	});
	folder.addInput(instance.options, 'cursor_size', {
		min: 10,
		max: 200,
	});
	folder.addInput(instance.options, 'isViscous');
	folder.addInput(instance.options, 'viscous', {
		min: 0,
		max: 500,
	});
	folder.addInput(instance.options, 'iterations_viscous', {
		min: 1,
		max: 32,
	});
	folder.addInput(instance.options, 'iterations_poisson', {
		min: 1,
		max: 32,
	});
	folder.addInput(instance.options, 'BFECC');

	return folder;
}

function debug(_instance) {}

export { createPane, debug };
