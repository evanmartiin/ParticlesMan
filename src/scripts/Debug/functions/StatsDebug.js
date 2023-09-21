import { EVENTS } from '@utils/constants.js';
import { state } from '@scripts/State.js';

/**
 *
 * @param {*} pane
 * @param {import("@Webgl/Renderer.js").Renderer} instance
 * @param {*} name
 * @returns
 */
function createPane(pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: true });

	folder.addMonitor(instance.info.memory, 'geometries', { label: 'Geometries' });
	folder.addMonitor(instance.info.memory, 'textures', { label: 'Textures' });
	folder.addMonitor(instance.info.programs, 'length', { label: 'Programs' });
	folder.addMonitor(instance.info.render, 'calls', { label: 'Calls' });
	folder.addMonitor(instance.info.render, 'points', { label: 'Points' });
	folder.addMonitor(instance.info.render, 'triangles', { label: 'Triangles' });

	instance.info.autoReset = false;
	state.on(EVENTS.RENDER, () => instance.info.reset());

	return folder;
}

function debug(instance) {}

export { createPane, debug };
