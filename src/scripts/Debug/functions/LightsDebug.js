function createPane(pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: false });

	const params = {};

	const light1 = folder.addFolder({ title: 'Light 1' });

	light1.addInput(instance._lights.light1.position, 'x', {
		min: -10,
		max: 10,
	});
	light1.addInput(instance._lights.light1.position, 'y', {
		min: -10,
		max: 10,
	});
	light1.addInput(instance._lights.light1.position, 'z', {
		min: -10,
		max: 10,
	});
	light1.addInput(instance._lights.helper1, 'visible', { label: 'helper' });
	light1.addInput(instance._lights.light1, 'intensity', {
		min: 0,
		max: 5,
	});

	params.color1 = '#' + instance._lights.light1.color.getHexString();
	light1.addInput(params, 'color1', { view: 'color' }).on('change', ({ value }) => instance._lights.light1.color.set(value));

	const light2 = folder.addFolder({ title: 'Light 2' });

	light2.addInput(instance._lights.light2.position, 'x', {
		min: -10,
		max: 10,
	});
	light2.addInput(instance._lights.light2.position, 'y', {
		min: -10,
		max: 10,
	});
	light2.addInput(instance._lights.light2.position, 'z', {
		min: -10,
		max: 10,
	});
	light2.addInput(instance._lights.helper2, 'visible', { label: 'helper' });
	light2.addInput(instance._lights.light2, 'intensity', {
		min: 0,
		max: 5,
	});

	params.color2 = '#' + instance._lights.light2.color.getHexString();
	light2.addInput(params, 'color2', { view: 'color' }).on('change', ({ value }) => instance._lights.light2.color.set(value));

	const light3 = folder.addFolder({ title: 'Light 3' });

	light3.addInput(instance._lights.light3.position, 'x', {
		min: -10,
		max: 10,
	});
	light3.addInput(instance._lights.light3.position, 'y', {
		min: -10,
		max: 10,
	});
	light3.addInput(instance._lights.light3.position, 'z', {
		min: -10,
		max: 10,
	});
	light3.addInput(instance._lights.helper3, 'visible', { label: 'helper' });
	light3.addInput(instance._lights.light3, 'intensity', {
		min: 0,
		max: 5,
	});

	params.color3 = '#' + instance._lights.light3.color.getHexString();
	light3.addInput(params, 'color3', { view: 'color' }).on('change', ({ value }) => instance._lights.light3.color.set(value));

	const light4 = folder.addFolder({ title: 'Ambient light' });
	light4.addInput(instance._lights.light4, 'intensity', {
		min: 0,
		max: 5,
	});

	params.color3 = '#' + instance._lights.light4.color.getHexString();
	light4.addInput(params, 'color3', { view: 'color' }).on('change', ({ value }) => instance._lights.light4.color.set(value));

	folder.addButton({ title: 'Copy params', index: 0 }).on('click', () => {
		navigator.clipboard.writeText(
			JSON.stringify({
				light1: {
					position: instance._lights.light1.position,
					intensity: instance._lights.light1.intensity,
					color: {
						r: instance._lights.light1.color.r,
						g: instance._lights.light1.color.g,
						b: instance._lights.light1.color.b,
					},
				},
				light2: {
					position: instance._lights.light2.position,
					intensity: instance._lights.light2.intensity,
					color: {
						r: instance._lights.light2.color.r,
						g: instance._lights.light2.color.g,
						b: instance._lights.light2.color.b,
					},
				},
				light3: {
					position: instance._lights.light3.position,
					intensity: instance._lights.light3.intensity,
					color: {
						r: instance._lights.light3.color.r,
						g: instance._lights.light3.color.g,
						b: instance._lights.light3.color.b,
					},
				},
				light4: {
					intensity: instance._lights.light4.intensity,
					color: {
						r: instance._lights.light4.color.r,
						g: instance._lights.light4.color.g,
						b: instance._lights.light4.color.b,
					},
				},
			}),
		);
	});

	return folder;
}

function debug(_instance) {}

export { createPane, debug };
