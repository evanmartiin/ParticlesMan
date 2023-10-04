import { Keyboard } from './Keyboard.js';
import { Viewport } from './Viewport.js';

function createToolsModules() {
	const viewport = new Viewport();
	const keyboard = new Keyboard();

	return {
		viewport,
		keyboard,
	};
}

export { createToolsModules };
