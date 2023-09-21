function createPane(pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: false });

	const material = folder.addFolder({ title: 'Material' });
	const rotation = folder.addFolder({ title: 'Rotation' });

	material.addInput(instance._material, 'metalness', {
		min: 0,
		max: 1,
	});
	material.addInput(instance._material, 'roughness', {
		min: 0,
		max: 1,
	});

	rotation.addInput(instance._mesh.rotation, 'y', {
		min: -Math.PI * 0.5,
		max: Math.PI * 0.5,
	});

	return folder;
}

function debug(_instance) {}

export { createPane, debug };
