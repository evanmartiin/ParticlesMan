import { EVENTS } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

function createPane(pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: false });

	let _far = 0;
	const toggleOrbit = async () => {
		const parent = app.$wrapper;
		if (!instance.orbitControls) {
			parent.style.pointerEvents = 'all';
			const OrbitThree = await import('three/addons/controls/OrbitControls.js');
			instance.orbitControls = new OrbitThree.OrbitControls(instance, parent);
			instance.orbitControls.enableDamping = true;
			instance.orbitControls.dampingFactor = 0.15;
			instance.orbitControls.enableZoom = true;
			instance.orbitControls.target.copy(app.webgl.camera.target);
			instance.orbitControls.update();
			_far = instance.far;
			instance.far = 200;
			instance.updateProjectionMatrix();
		} else {
			parent.style.pointerEvents = '';
			instance.orbitControls.dispose();
			instance.orbitControls = null;
			instance.far = _far;
			instance.updateProjectionMatrix();
		}
	};

	toggleOrbit();

	state.on(EVENTS.TICK, () => instance.orbitControls?.update());

	folder.addInput(instance, 'fov');
	folder.addInput(instance, 'near');

	folder.on('change', () => instance.updateProjectionMatrix());

	return folder;
}

function debug(_instance) {}

export { createPane, debug };
