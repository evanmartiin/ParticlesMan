function createPane(pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: false });

	const bloomPass = folder.addFolder({ title: 'Bloom Pass' });
	bloomPass.addInput(instance._bloomPass, 'strength', {
		min: 0,
		max: 5,
	});
	bloomPass.addInput(instance._bloomPass, 'radius', {
		min: 0,
		max: 1.5,
	});
	bloomPass.addInput(instance._bloomPass, 'threshold', {
		min: 0,
		max: 1,
	});

	const afterImage = folder.addFolder({ title: 'After Image' });
	afterImage.addInput(instance._afterImagePass.uniforms['damp'], 'value', {
		min: 0,
		max: 1,
	});

	// const fishEyes = folder.addFolder({ title: 'fishEyes Pass' });
	// fishEyes.addInput(instance._fishEyesPass.uniforms['strength'], 'value', {
	// 	min: 0,
	// 	max: 2,
	// 	label: 'Strength',
	// });
	// fishEyes.addInput(instance._fishEyesPass.uniforms['cylindricalRatio'], 'value', {
	// 	min: 0,
	// 	max: 5,
	// 	label: 'CylindricalRatio',
	// });

	return folder;
}

function debug(_instance) {}

export { createPane, debug };
