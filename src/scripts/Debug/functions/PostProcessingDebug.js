function createPane(pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: false });

	folder.addInput(instance, 'enabled', { label: 'Enabled' });

	const bloomPass = folder.addFolder({ title: 'Bloom', expanded: false });
	bloomPass.addInput(instance.bloomPass, 'strength', {
		min: 0,
		max: 5,
		label: 'Strength',
	});
	bloomPass.addInput(instance.bloomPass, 'radius', {
		min: 0,
		max: 1.5,
		label: 'Radius',
	});
	bloomPass.addInput(instance.bloomPass, 'threshold', {
		min: 0,
		max: 1,
		label: 'Threshold',
	});

	const afterImage = folder.addFolder({ title: 'After Image', expanded: false });
	afterImage.addInput(instance.afterImagePass.uniforms['damp'], 'value', {
		min: 0,
		max: 1,
		label: 'Strength',
	});

	return folder;
}

function debug(_instance) {}

export { createPane, debug };
